import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrintsService } from './prints.service';

@Controller('prints')
export class PrintsController {
  constructor(private readonly printsService: PrintsService) {}

  // Карточка эмитента
  @Get('/emitent/:id/card')
  getEmitentCard(@Param('id') id: number) {
    return this.printsService.getEmitentCard(id);
  } 

  // Передаточное распоряжение || Выписка из реестра
  @Get('/emitent/:eid/reestr/:hid')
  getExtractReestrForHolderId(@Param('eid') eid: number, @Param('hid') hid: number) {
    return this.printsService.getExtractFromRegister(eid, hid)
  }

  // Реестр акционеров
  @Get('/emitent/:eid/reestrs/holders')
  getExtractReestrHolders(@Param('eid') eid: number, @Query() query: any) {
    return this.printsService.getExtractReestrHolders(eid, query)
  }

  // Лицевой счет держателя по эмитенту
  @Get('/emitent/:eid/account/:hid')
  getEmitentHolderAccount(@Param('eid') eid: number, @Param('hid') hid: number) {
    return this.printsService.getEmitentHolderAccount(eid, hid)
  }

  // Получить операцию по id
  @Get('/transaction/:tid')
  getTransferOrder(@Param('tid') tid: number) {
    return this.printsService.getTransferOrder(tid)
  }

}
