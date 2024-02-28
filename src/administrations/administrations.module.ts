import { Module } from '@nestjs/common';
import { AdministrationsService } from './administrations.service';
import { AdministrationsController } from './administrations.controller';

@Module({
  controllers: [AdministrationsController],
  providers: [AdministrationsService]
})
export class AdministrationsModule {}
