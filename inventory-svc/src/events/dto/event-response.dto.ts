export class EventResponseDto {
    readonly id: string;
    readonly name: string;
    readonly venue: string;
    readonly startsAt: string;
    readonly capacity: number;
    readonly pricePerTicket: number;
}