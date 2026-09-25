import { UserRegisteredDto } from "./user-registered.dto.js";

export class LoggedInUserDto {
    accessToken: string;
    user: UserRegisteredDto
}