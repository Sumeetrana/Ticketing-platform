import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client.js";
import { ConfigService } from "@nestjs/config";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg'


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    constructor(configService: ConfigService) {
        const pool = new Pool({ connectionString: configService.get('databaseUrl') || "", max: 3 })

        const adapter = new PrismaPg(pool);

        super({ adapter });

        this.pool = pool
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect()
        await this.pool.end();
    }
}