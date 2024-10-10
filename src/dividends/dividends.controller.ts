import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DividendsService } from './dividends.service';
import { CreateDividendDto } from './dto/create-dividend.dto';
import { UpdateDividendDto } from './dto/update-dividend.dto';

@Controller('dividends')
export class DividendsController {
  constructor(private readonly dividendsService: DividendsService) {}

  @Post('/create')
  createDividend(@Body() createDividendDto: CreateDividendDto) {
    return this.dividendsService.createDividend(createDividendDto);
  }

  @Get('/:did/details')
  getDividendDetails(@Param('did') did: number) {
    return this.dividendsService.getDividendDetails(did);
  }

  @Get('/:did/transactions')
  getDividendTransactions(@Param('did') did: number) {
    return this.dividendsService.getDividendTransactions(did);
  }

  @Get('/:eid/all-list')
  getAllDividends(@Param('eid') eid: number) {
    return this.dividendsService.getAllDividendList(eid);
  }
}
