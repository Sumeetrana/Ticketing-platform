import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserRegisteredDto } from "./dto/user-registered.dto.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";
import { LoginUserDto } from "./dto/login-user.dto.js";
import { PrismaService } from "../database/prisma.service.js";
import argon from "argon2";
import { LoggedInUserDto } from "./dto/logged-in-user.dto.js";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "node:crypto";
import { User, RefreshSession } from "../generated/prisma/client.js";
import { ConfigService } from "@nestjs/config";

/** What login and refresh both hand back. */
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    /** 256 bits of entropy — opaque, not a JWT. */
    private generateToken(): string {
        return randomBytes(32).toString('base64url')
    }

    /**
     * SHA-256, not argon2: the hash must be deterministic so a presented token
     * can be looked up. Safe here because the token is 256 random bits — the
     * slow-hash argument only applies to human-chosen passwords.
     */
    private hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    private refreshExpiry(): Date {
        const ttlDays = this.configService.get<number>('refreshTokenTtlDays', 7);
        return new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    }

    /**
     * `role` is in the payload so other services can authorise a request
     * without calling back here. The token is signed, not encrypted — anyone
     * holding it can read these fields, so nothing private goes in.
     */
    private signAccessToken(user: User): Promise<string> {
        return this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role
        });
    }

    /** A fresh session — one row per logged-in device. */
    private async createSession(user: User): Promise<TokenPair> {
        const refreshToken = this.generateToken();

        await this.prismaService.refreshSession.create({
            data: {
                userId: user.id,
                currentHash: this.hashToken(refreshToken),
                expiresAt: this.refreshExpiry()
            }
        });

        return { accessToken: await this.signAccessToken(user), refreshToken };
    }

    /**
     * Rotate an existing session: the token just used becomes `previousHash`,
     * which is what makes reuse detectable. Sliding expiry — an active session
     * keeps extending.
     */
    private async rotateSession(user: User, session: RefreshSession): Promise<TokenPair> {
        const refreshToken = this.generateToken();

        await this.prismaService.refreshSession.update({
            where: { id: session.id },
            data: {
                previousHash: session.currentHash,
                currentHash: this.hashToken(refreshToken),
                expiresAt: this.refreshExpiry()
            }
        });

        return { accessToken: await this.signAccessToken(user), refreshToken };
    }

    async register(payload: RegisterUserDto): Promise<UserRegisteredDto | null> {
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
    }

    async login(payload: LoginUserDto): Promise<LoggedInUserDto> {
        const user = await this.prismaService.user.findUnique({ where: { email: payload.email } })

        // Same message whether the email is unknown or the password is wrong —
        // otherwise this endpoint tells an attacker which emails are registered.
        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        if (!(await argon.verify(user.passwordHash, payload.password))) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const tokens = await this.createSession(user);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }

    async refresh(rawToken: string): Promise<LoggedInUserDto> {
        const hash = this.hashToken(rawToken);

        const session = await this.prismaService.refreshSession.findUnique({
            where: { currentHash: hash },
            include: { user: true }
        });

        if (session && !session.revokedAt && session.expiresAt > new Date()) {
            const tokens = await this.rotateSession(session.user, session);

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: session.user.id,
                    email: session.user.email,
                    role: session.user.role
                }
            }
        }

        // Not the current token. If it was the PREVIOUS one, this token has
        // already been spent — a healthy client never replays one, so two
        // parties are holding tokens from the same session. Kill it.
        if (!session) {
            const reused = await this.prismaService.refreshSession.findUnique({
                where: { previousHash: hash }
            });

            if (reused && !reused.revokedAt) {
                await this.prismaService.refreshSession.update({
                    where: { id: reused.id },
                    data: { revokedAt: new Date() }
                });

                this.logger.warn(
                    `Refresh token reuse detected for session ${reused.id} (user ${reused.userId}) — session revoked`
                );
            }
        }

        // One message for every failure: unknown, reused, revoked or expired.
        throw new UnauthorizedException("Invalid refresh token")
    }

    async logout(rawToken: string): Promise<void> {
        // updateMany, not update: `update` throws when nothing matches, and
        // logout must never fail — a 404 would also leak whether a token exists.
        await this.prismaService.refreshSession.updateMany({
            where: { currentHash: this.hashToken(rawToken), revokedAt: null },
            data: { revokedAt: new Date() }
        });
    }
}
