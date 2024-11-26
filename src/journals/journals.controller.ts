import { Controller, Get } from '@nestjs/common';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Get()
  findAll() {
    return this.journalsService.findAll();
  }
}
