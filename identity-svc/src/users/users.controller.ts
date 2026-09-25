import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { RegisterUserDto } from "./dto/register-user.dto.js";
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
    async login(@Body() payload: RegisterUserDto): Promise<LoggedInUserDto> {
        return this.usersService.login(payload)
    }
}