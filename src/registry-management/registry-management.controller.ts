import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistryManagementService } from './registry-management.service';
import { CreateRegistryManagementDto } from './dto/create-registry-management.dto';
import { UpdateRegistryManagementDto } from './dto/update-registry-management.dto';

@Controller('registry-management')
export class RegistryManagementController {
  constructor(private readonly registryManagementService: RegistryManagementService) {}

  @Post()
  create(@Body() createRegistryManagementDto: CreateRegistryManagementDto) {
    return this.registryManagementService.create(createRegistryManagementDto);
  }

  @Get()
  findAll() {
    return this.registryManagementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registryManagementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistryManagementDto: UpdateRegistryManagementDto) {
    return this.registryManagementService.update(+id, updateRegistryManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registryManagementService.remove(+id);
  }
}
