import { Injectable } from '@nestjs/common';
import { CreateHolderDto } from './dto/create-holder.dto';
import { UpdateHolderDto } from './dto/update-holder.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Holder } from './entities/holder.entity';
import { SecuritiesService } from 'src/securities/securities.service';
import { EmissionsService } from 'src/emissions/emissions.service';
import { Security } from 'src/securities/entities/security.entity';
import sequelize from 'sequelize';
import { Emission } from 'src/emissions/entities/emission.entity';


@Injectable()
export class HoldersService {
  constructor(
    @InjectModel(Holder) private holderRepository: typeof Holder,
    private emissionService: EmissionsService,
    private securitiesService: SecuritiesService,
  ){}

  async create(createHolderDto: CreateHolderDto) {
    const holder = await this.holderRepository.create(createHolderDto)
    return holder;
  }

  async update(id: number, updateHolderDto: UpdateHolderDto) {
    const holder = await this.holderRepository.update(updateHolderDto, {
      where: {
        id
      }
    })
    return holder;
  }

  async findAll() {
    const holders = await this.holderRepository.findAll()
    return holders;
  }

  async findOne(id: number) {
    const holder = await this.holderRepository.findByPk(id)
    return holder;
  }

  async getHolderEmissions(hid: number){
    const emissions = await this.emissionService.getEmissionsByHolderId(hid)
    return emissions
  }

  async extractFromRegisters(eid: number) {
    try {
      if (!eid) {
        throw new Error('Emitent id is required');
      }
      const totalSecurities = await Security.sum('quantity', {
        where: { emitent_id: eid }
      });
      const holders = this.holderRepository.findAll({
        attributes: [
          'id',  // Выбор конкретных полей, например, id и name
          'name',
          [sequelize.fn('SUM', sequelize.col('securities.quantity')), 'ordinary'],
          [
            sequelize.literal(`(SUM(securities.quantity) * 100 / ${totalSecurities})`),
            'percentage'
          ],
          [
            sequelize.literal(`(SUM(securities.quantity) * "securities->emission"."nominal")`),
            'ordinary_nominal'
          ],
          'actual_address',
          'district'
        ],
        include: [
          {
            model: Security,
            attributes: [],
            where: {
              emitent_id: eid
            },
            include: [
              {
                model: Emission,
                attributes: [],
              }
            ]
          },
        ],
        group: ['Holder.id', 'securities->emission.nominal'],
      })

      return holders;
    } catch (error) {
      throw new Error(`Failed to extract from registers: ${error.message}`);
    }
  }

  async getExtractReestrOwns(eid: number) {
    try {
      if (!eid) {
        throw new Error('Emitent id is required');
      }
      const totalSecurities = await Security.sum('quantity', {
        where: { emitent_id: eid }
      });
      const holders = this.holderRepository.findAll({
        attributes: [
          'id',  // Выбор конкретных полей, например, id и name
          'name',
          [sequelize.fn('SUM', sequelize.col('securities.quantity')), 'ordinary'],
          [
            sequelize.literal(`(SUM(securities.quantity) * 100 / ${totalSecurities})`),
            'percentage'
          ],
          [
            sequelize.literal(`(SUM(securities.quantity) * "securities->emission"."nominal")`),
            'ordinary_nominal'
          ],
          [
            sequelize.literal('0'),
            'privileged'
          ],
          [
            sequelize.literal('0.00'),
            'privileged_nominal'
          ],
          [
            sequelize.literal('0.00'),
            'percentage_quantity'
          ],
          [
            sequelize.literal(`CONCAT(passport_type, ' ', passport_number, ' ', passport_agency)`),
            'passport'
          ],
          'actual_address',
          'district'

        ],
        include: [
          {
            model: Security,
            attributes: [],
            where: {
              emitent_id: eid
            },
            include: [
              {
                model: Emission,
                attributes: [],
              }
            ]
          },
        ],
        group: ['Holder.id', 'securities->emission.nominal'],
      })

      return holders;
    } catch (error) {
      throw new Error(`Failed to extract from registers: ${error.message}`);
    }
  }

  async getExtractReestrOwnsByEmission(eid: number, query: any) {
    try {
      if (!eid) {
        throw new Error('Emitent id is required');
      }
      const totalSecurities = await Security.sum('quantity', {
        where: { emitent_id: eid },
      });
      const holders = this.holderRepository.findAll({
        attributes: [
          'id',  // Выбор конкретных полей, например, id и name
          'name',
          [sequelize.fn('SUM', sequelize.col('securities.quantity')), 'ordinary'],
          [sequelize.col('securities.emission.reg_number'), 'reg_number'],
          [
            sequelize.literal(`(SUM(securities.quantity) * 100 / ${totalSecurities})`),
            'percentage'
          ],
          [
            sequelize.literal(`(SUM(securities.quantity) * "securities->emission"."nominal")`),
            'ordinary_nominal'
          ],
          [
            sequelize.literal('0'),
            'privileged'
          ],
          [
            sequelize.literal('0.00'),
            'privileged_nominal'
          ],
          [
            sequelize.literal('0.00'),
            'percentage_quantity'
          ],
          [
            sequelize.literal(`CONCAT(passport_type, ' ', passport_number, ' ', passport_agency)`),
            'passport_test'
          ],
          'actual_address',
          'district'

        ],
        include: [
          {
            model: Security,
            attributes: [],
            where: {
              emitent_id: eid
            },
            include: [
              {
                model: Emission,
                attributes: [],
                where: {
                  id: query.emission
                }
              }
            ],
          },
        ],
        group: ['Holder.id','securities->emission.reg_number', 'securities->emission.nominal'],
      })

      return holders;
    } catch (error) {
      throw new Error(`Failed to extract from registers: ${error.message}`);
    }
  }
}
