import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
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

  async getExtractReestrHolders(eid: number, query: any) {
    if(query.report_type == 1) {
      return await this.holderService.extractFromRegisters(eid)
    }
    if(query.report_type == 2) {
      return await this.holderService.getExtractReestrOwns(eid)
    }
    if(query.report_type == 3) {
      return await this.holderService.getExtractReestrOwnsByEmission(eid, query)
    }
    return 'Not found operation for report type'
  }

  async getEmitentHolderAccount(eid: number, hid: number) {
    const holder = await this.holderService.findOne(hid)
    const emitent = await this.emitentService.findOne(eid)
    const operations = await this.transactionService.getTransactionByHolderAccount(eid, hid)
    const emissions  = await this.emissionService.getHolderSecurities(hid)
    return {emitent, holder, operations, emissions}
  }

  async getTransferOrder(tid: number){
    const transaction = await this.transactionService.getTransactionById(tid)
    return transaction
  }
}
