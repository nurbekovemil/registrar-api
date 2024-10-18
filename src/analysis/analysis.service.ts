import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import sequelize from 'sequelize';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectModel(Holder) private holderRepository: typeof Holder,
    @InjectModel(Emitent) private emitentRepository: typeof Emitent,
    @InjectModel(Emission) private emissionRepository: typeof Emission,
  ){}
  async getDashboardTopPanelData() {
    const holderCount = await this.holderRepository.count();
    const emitentCount = await this.emitentRepository.count();
    const emissionCount = await this.emissionRepository.count();
    const emissions = await this.emissionRepository.findAll({
      attributes: {
        include: [
          [sequelize.literal('nominal * start_count'), 'totalVolumePrice']
        ]
      }
    });
    let totalVolumePrice = 0.00
    emissions.forEach(emission => {
      totalVolumePrice = totalVolumePrice + (emission.get('totalVolumePrice') as number)
    });
    return {
      holderCount: holderCount,
      emitentCount: emitentCount,
      emissionCount: emissionCount,
      totalVolumePrice
    }
  }
}
