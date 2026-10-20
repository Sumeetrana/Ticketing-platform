import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto.js";
import { EventsService } from "./events.service.js";
import { EventCreatedDto } from "./dto/event-created.dto.js";
import { EventResponseDto } from "./dto/event-response.dto.js";
import { CreateHoldDto } from "./dto/create-hold.dto.js";
import { HoldResponseDto } from "./dto/hold-response.dto.js";
import { Public } from "../auth/public.decorator.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { AuthenticatedUser } from "../auth/jwt-auth.guard.js";
import { Roles } from "../auth/roles.decorator.js";
import { Role } from "../constants/role.enum.js";

@Controller("events")
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Roles(Role.ORGANISER, Role.ADMIN)
    @Post()
    create(@Body() payload: CreateEventDto): Promise<EventCreatedDto> {
        return this.eventsService.create(payload);
    }

    @Public()
    @Get(":id")
    getById(@Param('id') id: string): Promise<EventResponseDto> {
        return this.eventsService.getById({ id })
    }

    @Public()
    @Get()
    getAll(): Promise<EventResponseDto[]> {
        return this.eventsService.getAll()
    }

    @Post(':id/holds')
    createHold(
        @Param('id') id: string,
        @Body() payload: CreateHoldDto,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<HoldResponseDto> {
        return this.eventsService.hold(id, payload.quantity, user.userId)
    }
}
