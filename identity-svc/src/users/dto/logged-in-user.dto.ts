import { UserRegisteredDto } from "./user-registered.dto.js";

export class LoggedInUserDto {
    accessToken: string;
    refreshToken: string;
    user: UserRegisteredDto
}
