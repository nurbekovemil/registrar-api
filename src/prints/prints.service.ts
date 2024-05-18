import { Injectable } from '@nestjs/common';
import { EmissionsService } from 'src/emissions/emissions.service';
import { EmitentsService } from 'src/emitents/emitents.service';

@Injectable()
export class PrintsService {
  constructor(
    private emitentService: EmitentsService,
    private emissionService: EmissionsService,
  ){}
  
  async emitenCard(id) {
    const emitent = await this.emitentService.findOne(id)
    const emissions = await this.emissionService.getEmissionsByEmitentId(id)
    return {emitent, emissions};
  }
}
