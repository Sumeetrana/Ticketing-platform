import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule } from './config/configuration.module.js';

@Module({
  imports: [PrismaModule, ConfigModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
