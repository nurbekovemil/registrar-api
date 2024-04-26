import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { CreateHolderDto } from './dto/create-holder.dto';
import { UpdateHolderDto } from './dto/update-holder.dto';

@Controller('holders')
export class HoldersController {
  constructor(private readonly holdersService: HoldersService) {}

  @Post()
  create(@Body() createHolderDto: CreateHolderDto) {
    return this.holdersService.create(createHolderDto);
  }

  @Get()
  findAll() {
    return this.holdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.holdersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHolderDto: UpdateHolderDto) {
    return this.holdersService.update(+id, updateHolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holdersService.remove(+id);
  }
}
