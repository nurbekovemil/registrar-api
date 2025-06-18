import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { CreateHolderDto } from './dto/create-holder.dto';
import { UpdateHolderDto } from './dto/update-holder.dto';

@Controller('holders')
export class HoldersController {
  constructor(private readonly holdersService: HoldersService) {}

  @Get()
  findAll() {
    return this.holdersService.findAll();
  }

  // holder types methods
  @Post('/holder-types')
  createHolderTypes(@Body() data: { name: string }) {
    return this.holdersService.createHolderType(data.name);
  }

  @Get('/holder-types')
  getHolderTypes() {
    return this.holdersService.getHolderTypes();
  }

  @Delete('/holder-types/:id')
  deleteHolderTypes(@Param('id', ParseIntPipe) id: number) {
    return this.holdersService.deleteHolderType(id);
  }

  @Put('/holder-types/:id')
  updateHolderTypes(@Param('id', ParseIntPipe) id: number, @Body() data: { name: string }) {
    return this.holdersService.updateHolderType(id, data);
  }

  // holder status methods
  @Post('/holder-status')
  createHolderStatus(@Body() data: { name: string }) {
    return this.holdersService.createHolderStatus(data.name);
  }

  @Get('/holder-status')
  getHolderStatus() {
    return this.holdersService.getHolderStatus();
  }

  @Delete('/holder-status/:id')
  deleteHolderStatus(@Param('id', ParseIntPipe) id: number) {
    return this.holdersService.deleteHolderStatus(id);
  }

  @Put('/holder-status/:id')
  updateHolderStatus(@Param('id', ParseIntPipe) id: number, @Body() data: { name: string }) {
    return this.holdersService.updateHolderStatus(id, data);
  }


  @Post('/district')
  createDistrict(@Body() createDistrictDto: CreateHolderDto) {
    return this.holdersService.createDistrict(createDistrictDto);
  }

  @Get('/district/list')
  getDistricts() {
    return this.holdersService.getDistricts();
  }

  @Put('/district/:id')
  updateDistrict(@Param('id', ParseIntPipe) id: number, @Body() updateDistrictDto:{ name: string }) {
    return this.holdersService.updateDistrict(id, updateDistrictDto);
  }

  @Delete('/district/:id')
  deleteDistrict(@Param('id', ParseIntPipe) id: number) {
    return this.holdersService.deleteDistrict(id);
  }
  @Get('/pledges/:eid/:esid/:hid')
  getExtractReestrOwns(
    @Param('eid', ParseIntPipe) eid: number, 
    @Param('esid', ParseIntPipe) esid: number, 
    @Param('hid', ParseIntPipe) hid: number) {
    return this.holdersService.getHolderPledgeSecurities(hid, eid, esid);
  }

  @Post()
  create(@Body() createHolderDto: CreateHolderDto) {
    return this.holdersService.create(createHolderDto);
  }

  @Put('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHolderDto: UpdateHolderDto) {
    return this.holdersService.update(id, updateHolderDto);
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.holdersService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.holdersService.delete(id);
  }

  @Get('/:id/emissions')
  getHolderEmissions(@Param('id', ParseIntPipe) id: number) {
    return this.holdersService.getHolderEmissions(id);
  }

  @Get('/:id/securities')
  getHolderSecurities(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: any
  ) {
    return this.holdersService.getHolderSecurities(id, query);
  }

  @Get('/:id/emitents')
  getEmitentsByHolderId(@Param('id', ParseIntPipe) id: number) {
    return this.holdersService.getEmitentsByHolderId(id);
  }

  @Get('/:hid/emitent/:eid/emissions')
  getEmitentEmissions(@Param('hid', ParseIntPipe) hid: number, @Param('eid', ParseIntPipe) eid: number) {
    return this.holdersService.getEmitentEmissions(hid, eid);
  }

}
