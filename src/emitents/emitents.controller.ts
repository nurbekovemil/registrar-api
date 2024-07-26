import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { EmitentsService } from './emitents.service';
import { CreateEmitentDto } from './dto/create-emitent.dto';
import { UpdateEmitentDto } from './dto/update-emitent.dto';

@Controller('emitents')
export class EmitentsController {
  constructor(private readonly emitentsService: EmitentsService) {}

  @Post()
  create(@Body() createEmitentDto: CreateEmitentDto) {
    return this.emitentsService.create(createEmitentDto);
  }

  @Get()
  findAll() {
    return this.emitentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.emitentsService.findOne(id);
  }
  @Get(':id/emissions')
  getEmitentEmissions(@Param('id') id: number) {
    return this.emitentsService.getEmitentEmissions(id);
  }
  @Get(':id/holders')
  getEmitentHolders(@Param('id') id: number) {
    return this.emitentsService.getEmitentHolders(id);
  }

  @Get(':id/all-holders')
  getEmitentAllHolders(@Param('id') id: number) {
    return this.emitentsService.getEmitentAllHolders(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateEmitentDto: UpdateEmitentDto) {
    return this.emitentsService.update(id, updateEmitentDto);
  }
}