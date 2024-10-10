import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DividendsService } from './dividends.service';
import { CreateDividendDto } from './dto/create-dividend.dto';
import { UpdateDividendDto } from './dto/update-dividend.dto';

@Controller('dividends')
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) {}

  @Post()
  createDividend(@Body() createDividendDto: CreateDividendDto) {
    return this.dividendsService.createDividend(createDividendDto);
  }

  @Get('/:did')
  getDividendsByDate(@Param('did') did: number) {
    return this.dividendsService.getDividendsByDid(did);
  }

  @Get('/:eid/all')
  getAllDividends(@Param('eid') eid: number) {
    return this.dividendsService.getAllDividends(eid);
  }
}
