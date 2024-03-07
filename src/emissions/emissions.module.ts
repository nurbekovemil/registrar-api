import { Module } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { EmissionsController } from './emissions.controller';

@Module({
  controllers: [EmissionsController],
  providers: [EmissionsService]
})
export class EmissionsModule {}
