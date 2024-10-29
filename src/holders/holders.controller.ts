import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { CreateHolderDto } from './dto/create-holder.dto';
import { UpdateHolderDto } from './dto/update-holder.dto';
import { CreateDocumentDto, CreateHolderDocumentDto } from './dto/create-holder-document.dto';

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

  @Get('/holder-types')
  getHolderTypes(){
    return this.holdersService.getHolderTypes()
  }

  @Post('/district')
  createDistrict(@Body() createDistrictDto: CreateHolderDto) {
    return this.holdersService.createDistrict(createDistrictDto)
  }

  @Get('/district/list')
  getDistricts(){
    return this.holdersService.getDistricts()
  }

  @Put('/district/:id')
  updateDistrict(@Param('id') id: number, @Body() updateDistrictDto: UpdateHolderDto) {
    return this.holdersService.updateDistrict(id, updateDistrictDto)
  }

  @Delete('/district/:id')
  deleteDistrict(@Param('id') id: number){
    return this.holdersService.deleteDistrict(id)
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

  @Post('/document/create')
  createHolderDocument(@Body() createHolderDocumentDto: CreateHolderDocumentDto) {
    return this.holdersService.createHolderDocument(createHolderDocumentDto)
  }

  @Get('/document/holder/:hid')
  getHolderDocuments(@Param('hid') hid: number){
    return this.holdersService.getHolderDocuments(hid)
  }

  @Get('/document/:id')
  getDocument(@Param('id') id: number){
    return this.holdersService.getDocument(id)
  }

  @Get('/document/emitent/:eid')
  getEmitentHolderDocuments(@Param('eid') eid: number){
    return this.holdersService.getEmitentHolderDocuments(eid)
  }
}
