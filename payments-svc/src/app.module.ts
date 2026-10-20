import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module.js';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
