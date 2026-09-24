export class EventResponseDto {
    readonly id: string;
    readonly name: string;
    readonly venue: string;
    readonly startsAt: Date;
    readonly capacity: number;
    readonly pricePerTicket: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}