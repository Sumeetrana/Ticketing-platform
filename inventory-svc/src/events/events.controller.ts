import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto.js";
import { EventsService } from "./events.service.js";
import { EventCreatedDto } from "./dto/event-created.dto.js";
import { EventResponseDto } from "./dto/event-response.dto.js";

@Controller("events")
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    create(@Body() payload: CreateEventDto): Promise<EventCreatedDto> {
        return this.eventsService.create(payload);
    }

    @Get(":id")
    getById(@Param('id') id: string): Promise<EventResponseDto> {
        return this.eventsService.getById({ id })
    }

    @Get()
    getAll(): Promise<EventResponseDto[]> {
        return this.eventsService.getAll()
    }
}
