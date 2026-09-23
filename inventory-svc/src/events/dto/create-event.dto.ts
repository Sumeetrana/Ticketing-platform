import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator"

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    venue: string;

    @IsDateString()
    @IsNotEmpty()
    startsAt: string;

    @IsInt()
    @Min(1)
    capacity: number;

    @IsInt()
    @Min(1)
    pricePerTicket: number;
}