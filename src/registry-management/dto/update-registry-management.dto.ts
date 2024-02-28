import { PartialType } from '@nestjs/swagger';
import { CreateRegistryManagementDto } from './create-registry-management.dto';

export class UpdateRegistryManagementDto extends PartialType(CreateRegistryManagementDto) {}
