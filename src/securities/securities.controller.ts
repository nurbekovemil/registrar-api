import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SecuritiesService } from './securities.service';
import { CreateSecurityDto } from './dto/create-security.dto';
import { UpdateSecurityDto } from './dto/update-security.dto';

@Controller('securities')
export class SecuritiesController {
  constructor(private readonly securitiesService: SecuritiesService) {}

  @Post()
  create(@Body() createSecurityDto: CreateSecurityDto) {
    return this.securitiesService.create(createSecurityDto);
  }

  @Get()
  findAll() {
    return this.securitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSecurityDto: UpdateSecurityDto) {
    return this.securitiesService.update(+id, updateSecurityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.securitiesService.remove(+id);
  }
}
