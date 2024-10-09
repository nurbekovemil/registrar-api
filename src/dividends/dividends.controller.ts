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

  @Get('/:eid/date') // /dividends/1/date?date=2024-10-10
  getDividendsByDate(@Param('eid') eid: number, @Query() query: any) {
    return this.dividendsService.getDividendsByDate(eid, query.date);
  }

  @Get('/:eid/all')
  getAllDividends(@Param('eid') eid: number) {
    return this.dividendsService.getAllDividends(eid);
  }
}
