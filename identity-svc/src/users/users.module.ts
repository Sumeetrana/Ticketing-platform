import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"
import { UsersService } from "./users.service.js";
import { UsersController } from "./users.controller.js";
import { ConfigModule } from "../config/configuration.module.js";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            secret: config.get<string>('jwtSecret'),
            signOptions: {
                expiresIn: '15m'
            },
            global: true
        })
    })],
    providers: [UsersService],
    controllers: [UsersController]
})

export class UsersModule { }