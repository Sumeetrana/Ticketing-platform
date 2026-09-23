import { Injectable, NotFoundException } from "@nestjs/common";
import { EventCreatedDto } from "./dto/event-created.dto.js";
import { EventResponseDto } from "./dto/event-response.dto.js";
import { CreateEventDto } from "./dto/create-event.dto.js";
import { randomUUID } from "node:crypto";


@Injectable()
export class EventsService {
    private readonly events: EventResponseDto[] = []

    async create(payload: CreateEventDto): Promise<EventCreatedDto> {
        const newEvent = {
            ...payload,
            id: randomUUID()
        }

        this.events.push(newEvent);

        return {
            id: newEvent.id,
            name: newEvent.name,
        }
    }

    async getById(eventId: string): Promise<EventResponseDto> {
        let event = this.events.find(event => event.id == eventId)

        if (!event) {
            throw new NotFoundException(`Event ${eventId} not found`);
        }

        return event
    }

    async getAll(): Promise<EventResponseDto[]> {
        return this.events
    }
}