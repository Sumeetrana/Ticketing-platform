import { Module } from '@nestjs/common';
import { ConfigModule } from './config/configuration.module.js';
import { EventsModule } from './events/events.module.js';

@Module({
  imports: [ConfigModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
