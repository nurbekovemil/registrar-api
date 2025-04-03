import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
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

  @Post('/types')
  createEmissionType(@Body() body) {
    return this.emissionsService.createEmissionType(body.name);
  }

  @Get()
  findAll(@Query() query) {
    return this.emissionsService.findAll(query);
  }

  @Get('/types')
  getEmissionTypes() {
    return this.emissionsService.getEmissionTypes();
  }

  @Put('/types/:id')
  updateEmissionType(@Param('id') id: number, @Body() body: {name: string}) {
    return this.emissionsService.updateEmissionType(id, body.name);
  }
  @Put('/:id/cancel')
  cancelEmissionCount(@Param('id') id: number, @Body() body) {
    return this.emissionsService.cancellationEmissionCount(id, body.count, body.document_id);
  }
  @Delete('/types/:id')
  deleteEmissionType(@Param('id') id: number) {
    return this.emissionsService.deleteEmissionType(id);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.emissionsService.findOne(id);
  }


}
