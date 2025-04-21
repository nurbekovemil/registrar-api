import { Controller, Get, Param } from '@nestjs/common';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Get('/emitent/:id')
  findAll(@Param('id') id: number) {
    return this.journalsService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.journalsService.findOne(id);
  }
}
