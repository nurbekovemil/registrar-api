import { Controller, Get, Param } from '@nestjs/common';
import { PrintsService } from './prints.service';

@Controller('prints')
export class PrintsController {
  constructor(private readonly printsService: PrintsService) {}

  @Get('/emitent/:id/card')
  getEmitentCard(@Param('id') id: number) {
    return this.printsService.getEmitentCard(id);
  } 

  @Get('/emitent/:eid/reestr/:hid')
  getExtractReestrForHolderId(@Param('eid') eid: number, @Param('hid') hid: number) {
    return this.printsService.getExtractForHolder(eid, hid)
  }

  @Get('/transaction/:tid')
  getTransferOrder(@Param('eid') tid: number) {
    return this.printsService.getTransferOrder(tid)
  }

}
