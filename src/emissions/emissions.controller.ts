import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';

@Controller('emissions')
export class EmissionsController {
  constructor(private readonly emissionsService: EmissionsService) {}

  @Post()
  create(@Body() createEmissionDto: CreateEmissionDto) {
    return this.emissionsService.create(createEmissionDto);
  }

  @Get()
  findAll() {
    return this.emissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.emissionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateEmissionDto: UpdateEmissionDto) {
    return this.emissionsService.update(id, updateEmissionDto);
  }
}
