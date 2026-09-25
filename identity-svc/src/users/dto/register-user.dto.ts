import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class RegisterUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}