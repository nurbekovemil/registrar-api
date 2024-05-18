import { Controller, Get, Param } from '@nestjs/common';
import { PrintsService } from './prints.service';

@Controller('prints')
export class PrintsController {
  constructor(private readonly printsService: PrintsService) {}

  @Get('/emitent/card')
  findOne(@Param('id') id: string) {
    return this.printsService.findOne(+id);
  } 

}
