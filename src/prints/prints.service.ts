import { Injectable } from '@nestjs/common';
import { EmissionsService } from 'src/emissions/emissions.service';
import { EmitentsService } from 'src/emitents/emitents.service';
import { HoldersService } from 'src/holders/holders.service';
import { SecuritiesService } from 'src/securities/securities.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class PrintsService {
  constructor(
    private emitentService: EmitentsService,
    private emissionService: EmissionsService,
    private securityService: SecuritiesService,
    private holderService: HoldersService,
    private transactionService: TransactionsService,

  ){}
  
  async getEmitentCard(id) {
    const emitent = await this.emitentService.findOne(id)
    const emissions = await this.emissionService.getEmissionsByEmitentId(id)
    return {emitent, emissions};
  }

  async getExtractFromRegister(eid: number, hid: number) {
    const holder = await this.holderService.findOne(hid)
    const emitent = await this.emitentService.findOne(eid)
    const emission = await this.emissionService.getEmissionsByHolderId(hid)
    return {emitent, holder, emission}
  }

  // async getExtractFromRegister(eid: number, hid: number){
  //   const security = await this.securityService.extractFromRegister(eid, hid)
  //   return security
  // }

  async getTransferOrder(tid: number){
    const transaction = await this.transactionService.getTransactionById(tid)
    return transaction
  }
}
