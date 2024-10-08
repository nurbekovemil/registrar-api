import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
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

  @Put(':id')
  update(@Param('id') id: number, @Body() updateHolderDto: UpdateHolderDto) {
    return this.holdersService.update(id, updateHolderDto);
  }

  @Get()
  findAll() {
    return this.holdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.holdersService.findOne(id);
  }

  @Get('/:hid/emissions')
  getHolderEmissions(@Param('hid') hid: number){
    return this.holdersService.getHolderEmissions(hid)
  }
  @Get('/:hid/securities')
  getHolderSecurities(@Param('hid') hid: number){
    return this.holdersService.getHolderSecurities(hid)
  }
  
  @Get('/holder-types')
  getHolderTypes(){
    return this.holdersService.getHolderTypes()
  }
}
