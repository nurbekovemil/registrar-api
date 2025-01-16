import { DividendsService } from './../dividends/dividends.service';
import { JournalsService } from './../journals/journals.service';
import { SecuritiesService } from 'src/securities/securities.service';
import { Injectable } from '@nestjs/common';
import { CreateEmitentDto } from './dto/create-emitent.dto';
import { UpdateEmitentDto } from './dto/update-emitent.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Emitent } from './entities/emitent.entity';
import { EmissionsService } from 'src/emissions/emissions.service';
import { HoldersService } from 'src/holders/holders.service';

@Injectable()
export class EmitentsService {
  constructor(
    @InjectModel(Emitent) private emitentRepository: typeof Emitent,
    private emissionService: EmissionsService,
    private holderService: HoldersService,
    private securityService: SecuritiesService,
    private journalsService: JournalsService,
    private dividendsService: DividendsService
  ){}
  
  async create(createEmitentDto: CreateEmitentDto) {
    const emitent = await this.emitentRepository.create(createEmitentDto)
    return emitent;
  }

  async findAll() {
    const emitents = await this.emitentRepository.findAll()
    return emitents;
  }

  async findOne(id: number) {
    const emitent = await this.emitentRepository.findByPk(id)
    return emitent;
  }

  async getEmitentEmissions(id: number){
    const emissions = await this.emissionService.getEmissionsByEmitentId(id)
    return emissions
  }

  async getEmitentHolders(id: number){
    const holders = await this.securityService.getEmitentHolders(id)
    return holders
  }
  async getEmitentAllHolders(){
    const holders = await this.holderService.getEmitentAllHolders()
    return holders
  }
  async update(id: number, updateEmitentDto: UpdateEmitentDto) {
    const old_emitent_value = await this.emitentRepository.findByPk(id)
    const emitent = await this.emitentRepository.update(updateEmitentDto, {
      where: {
        id
      }
    })
    const journal = {
      title: `Запись изменена в эмитенте: ${updateEmitentDto.full_name}`,
      old_value: old_emitent_value,
      new_value: updateEmitentDto,
      change_type: 'update',
      changed_by: 1
    }
    await this.journalsService.create(journal)
    return 'Updated';
  }

  async delete(id: number) {
    const transaction = await this.emitentRepository.sequelize.transaction();
    try {
      await this.securityService.deleteEmitentSecurities(id, transaction)
      await this.dividendsService.deleteEmitentDividends(id, transaction)
      const result =await this.emitentRepository.destroy({
        where: {
          id
        },
        transaction
      })
      if (!result) {
        throw new Error(`Emitent with ID ${id} not found.`);
      }
      await transaction.commit();
      return 'Deleted';
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to delete emitent: ${error.message}`);
    }
  }
}
