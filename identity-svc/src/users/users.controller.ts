import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";
import { LoginUserDto } from "./dto/login-user.dto.js";
import { RefreshTokenDto } from "./dto/refresh-token.dto.js";
import { UserRegisteredDto } from "./dto/user-registered.dto.js";
import { LoggedInUserDto } from "./dto/logged-in-user.dto.js";

@Controller("auth")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post("register")
    async register(@Body() payload: RegisterUserDto): Promise<UserRegisteredDto | null> {
        return this.usersService.register(payload)
    }

    @Post("login")
    async login(@Body() payload: LoginUserDto): Promise<LoggedInUserDto> {
        return this.usersService.login(payload)
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() payload: RefreshTokenDto): Promise<LoggedInUserDto> {
        return this.usersService.refresh(payload.refreshToken)
    }

    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Body() payload: RefreshTokenDto): Promise<void> {
        return this.usersService.logout(payload.refreshToken)
    }
}
