import { Controller, Get, Param } from '@nestjs/common';
import { PrintsService } from './prints.service';

@Controller('prints')
export class PrintsController {
  constructor(private readonly printsService: PrintsService) {}

  @Get('/emitent/:id/card')
  findOne(@Param('id') id: number) {
    return this.printsService.emitenCard(id);
  } 

  @Get('/emitent/:eid/holder/:hid')
  getExtractReestrForHolderId(@Param('eid') eid: number, @Param('hid') hid: number) {
    return this.printsService.getExtractForHolder(eid, hid)
  }

}
