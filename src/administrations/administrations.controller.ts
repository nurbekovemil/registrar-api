import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdministrationsService } from './administrations.service';
import { CreateAdministrationDto } from './dto/create-administration.dto';
import { UpdateAdministrationDto } from './dto/update-administration.dto';

@Controller('administrations')
export class AdministrationsController {
  constructor(private readonly administrationsService: AdministrationsService) {}

  @Post()
  create(@Body() createAdministrationDto: CreateAdministrationDto) {
    return this.administrationsService.create(createAdministrationDto);
  }

  @Get()
  findAll() {
    return this.administrationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.administrationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdministrationDto: UpdateAdministrationDto) {
    return this.administrationsService.update(+id, updateAdministrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.administrationsService.remove(+id);
  }
}
