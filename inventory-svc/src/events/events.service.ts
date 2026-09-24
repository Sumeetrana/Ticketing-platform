import { Injectable, NotFoundException } from "@nestjs/common";
import { EventCreatedDto } from "./dto/event-created.dto.js";
import { EventResponseDto } from "./dto/event-response.dto.js";
import { CreateEventDto } from "./dto/create-event.dto.js";
import { PrismaService } from "../database/prisma.service.js";
import { Prisma } from "../generated/prisma/client.js";


@Injectable()
export class EventsService {

    constructor(private readonly prismaService: PrismaService) { }

    async create(payload: CreateEventDto): Promise<EventCreatedDto> {
        return await this.prismaService.event.create({ data: payload })
    }

    async getById(where: Prisma.EventWhereUniqueInput): Promise<EventResponseDto> {
        let event = await this.prismaService.event.findUnique({ where })

        if (!event) {
            throw new NotFoundException(`Event ${where.id} not found`)
        }

        return event
    }

    async getAll(): Promise<EventResponseDto[]> {
        return this.prismaService.event.findMany()
    }
}