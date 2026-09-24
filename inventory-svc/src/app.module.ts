import { Module } from '@nestjs/common';
import { ConfigModule } from './config/configuration.module.js';
import { EventsModule } from './events/events.module.js';
import { PrismaModule } from './database/prisma.module.js';

@Module({
  imports: [ConfigModule, EventsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
