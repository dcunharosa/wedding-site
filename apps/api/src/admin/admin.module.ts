import { Module } from '@nestjs/common';
import { HouseholdsModule } from './households/households.module';

@Module({
  imports: [HouseholdsModule],
})
export class AdminModule {}
