import { BadRequestException, ConflictException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRegisteredDto } from "./dto/user-registered.dto.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";
import { PrismaService } from "../database/prisma.service.js";
import argon from "argon2";
import { LoggedInUserDto } from "./dto/logged-in-user.dto.js";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async register(payload: RegisterUserDto): Promise<UserRegisteredDto | null> {
        console.log("Payload: ", payload.email)
        try {
            const user = await this.prismaService.user.findUnique({ where: { email: payload.email } })

            if (user) {
                throw new ConflictException("User already registered")
            }

            const result = await this.prismaService.user.create({
                data: {
                    email: payload.email,
                    passwordHash: await argon.hash(payload.password)
                }
            })

            return {
                id: result.id,
                email: result.email,
                role: result.role
            }
        } catch (error) {
            console.log("Error: ", error)
            throw new BadRequestException(error)
        }

    }

    async login(payload: RegisterUserDto): Promise<LoggedInUserDto> {
        const user = await this.prismaService.user.findUnique({ where: { email: payload.email } })

        if (!user) {
            throw new UnauthorizedException("User is not registered")
        }

        if (await argon.verify(user.passwordHash, payload.password)) {
            const sub = { userId: user.id, email: user.email }

            return {
                accessToken: await this.jwtService.signAsync(sub),
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }

            }
        } else {
            throw new UnauthorizedException("Invalid credentials")
        }
    }
}