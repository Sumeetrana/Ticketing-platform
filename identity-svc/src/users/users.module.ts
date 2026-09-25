import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"
import { jwtConstants } from "./constants/index.js";
import { UsersService } from "./users.service.js";
import { UsersController } from "./users.controller.js";

@Module({
    imports: [JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '120s' }
    })],
    providers: [UsersService],
    controllers: [UsersController]
})

export class UsersModule { }