import { IsEmail, IsNotEmpty, IsString } from "class-validator"

/**
 * Deliberately NOT reusing RegisterUserDto. Registration rules (minimum length,
 * and any complexity rules added later) describe what a NEW password must look
 * like. Applying them at login would lock out existing users whose passwords
 * predate the rule.
 */
export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
