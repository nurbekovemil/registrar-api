import { Injectable } from '@nestjs/common';
import { EmissionsService } from 'src/emissions/emissions.service';
import { EmitentsService } from 'src/emitents/emitents.service';
import { HoldersService } from 'src/holders/holders.service';
import { SecuritiesService } from 'src/securities/securities.service';

@Injectable()
export class PrintsService {
  constructor(
    private emitentService: EmitentsService,
    private emissionService: EmissionsService,
    private securityService: SecuritiesService,
    private holderService: HoldersService
  ){}
  
  async emitenCard(id) {
    const emitent = await this.emitentService.findOne(id)
    const emissions = await this.emissionService.getEmissionsByEmitentId(id)
    return {emitent, emissions};
  }

  async getExtractForHolder(eid: number, hid: number) {
    const holder = await this.holderService.findOne(hid)
    const securities = await this.securityService.getSecuritiesByHolderId(hid)
    return {securities, holder}
  }
}
