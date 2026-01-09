import { Module } from '@nestjs/common';
import { RsvpModule } from './rsvp/rsvp.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [RsvpModule, ContentModule],
})
export class PublicModule {}
