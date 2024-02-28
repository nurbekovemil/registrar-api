import { Injectable } from '@nestjs/common';
import { CreateRegistryManagementDto } from './dto/create-registry-management.dto';
import { UpdateRegistryManagementDto } from './dto/update-registry-management.dto';

@Injectable()
export class RegistryManagementService {
  create(createRegistryManagementDto: CreateRegistryManagementDto) {
    return 'This action adds a new registryManagement';
  }

  findAll() {
    return `This action returns all registryManagement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registryManagement`;
  }

  update(id: number, updateRegistryManagementDto: UpdateRegistryManagementDto) {
    return `This action updates a #${id} registryManagement`;
  }

  remove(id: number) {
    return `This action removes a #${id} registryManagement`;
  }
}
