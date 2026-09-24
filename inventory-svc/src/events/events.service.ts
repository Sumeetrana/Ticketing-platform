import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { EventCreatedDto } from "./dto/event-created.dto.js";
import { EventResponseDto } from "./dto/event-response.dto.js";
import { CreateEventDto } from "./dto/create-event.dto.js";
import { PrismaService } from "../database/prisma.service.js";
import { Prisma } from "../generated/prisma/client.js";
import { HoldResponseDto } from "./dto/hold-response.dto.js";


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

    async hold(eventId: string, quantity: number): Promise<HoldResponseDto> {
        const event = await this.prismaService.event.findUnique({ where: { id: eventId } });

        if (!event) {
            throw new NotFoundException(`Event ${eventId} not found`)
        }

        return this.prismaService.$transaction(async (tx) => {
            const result = await tx.event.updateMany({
                where: {
                    id: eventId,
                    reserved: { lte: event.capacity - quantity }
                },
                data: { reserved: { increment: quantity } }
            })

            if (result.count == 0) {
                throw new ConflictException(`Not enough tickets remaining.`)
            }


            const hold = await tx.ticketHold.create({
                data: { eventId, quantity }
            })

            return {
                id: hold.id,
                eventId: hold.eventId,
                quantity: hold.quantity,
                createdAt: hold.createdAt.toISOString()
            }
        })
    }
}