import { Module } from '@nestjs/common';
import { RegistryManagementService } from './registry-management.service';
import { RegistryManagementController } from './registry-management.controller';

@Module({
  controllers: [RegistryManagementController],
  providers: [RegistryManagementService]
})
export class RegistryManagementModule {}
