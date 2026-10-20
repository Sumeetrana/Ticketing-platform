import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from './config/configuration.module.js';
import { EventsModule } from './events/events.module.js';
import { PrismaModule } from './database/prisma.module.js';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/jwt-auth.guard.js';
import { RolesGuard } from './auth/roles.guard.js';

@Module({
  imports: [ConfigModule, EventsModule, PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwtSecret'),
        global: true
      })
    })
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ],
})
export class AppModule { }
