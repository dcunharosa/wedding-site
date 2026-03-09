import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { RsvpService } from './rsvp.service';
import { RsvpController } from './rsvp.controller';
import { ConfigService } from '../../config/config.service';

@Module({
  imports: [
    // Specific rate limiting for RSVP endpoints
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ([
        {
          ttl: 900000, // 15 minutes
          limit: configService.rateLimitRsvpMax,
        },
      ]),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '2h' }, // Search tokens expire in 2 hours
      }),
    }),
  ],
  controllers: [RsvpController],
  providers: [RsvpService],
})
export class RsvpModule { }
