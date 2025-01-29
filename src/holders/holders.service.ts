import { JournalsService } from './../journals/journals.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHolderDto } from './dto/create-holder.dto';
import { UpdateHolderDto } from './dto/update-holder.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Holder } from './entities/holder.entity';
import { EmissionsService } from 'src/emissions/emissions.service';
import { Security } from 'src/securities/entities/security.entity';
import sequelize from 'sequelize';
import { Emission } from 'src/emissions/entities/emission.entity';
import { HolderType } from './entities/holder-type.entity';
import { HolderDistrict } from './entities/holder-district.entity';
import { CreateDistrictDto } from './dto/create-holder-district.dto';
import { UpdateDistrictDto } from './dto/update-holder-district.dto';
import { SecuritiesService } from 'src/securities/securities.service';


@Injectable()
export class HoldersService {
  constructor(
    @InjectModel(Holder) private holderRepository: typeof Holder,
    @InjectModel(HolderType) private holderTypeRepository: typeof HolderType,
    @InjectModel(HolderDistrict) private holderDistrictRepository: typeof HolderDistrict,
    private emissionService: EmissionsService,
    private journalsService: JournalsService,
    private securityService: SecuritiesService
  ){}

  async create(createHolderDto: CreateHolderDto) {
    const holder = await this.holderRepository.create(createHolderDto)
    return holder;
  }

  async update(id: number, updateHolderDto: UpdateHolderDto) {
    const old_holder_value = await this.holderRepository.findByPk(id)
    const holder = await this.holderRepository.update(updateHolderDto, {
      where: {
        id
      }
    })
    const journal = {
      title: `Запись изменена в участнике: ${updateHolderDto.name}`,
      old_value: old_holder_value,
      new_value: updateHolderDto,
      change_type: 'update',
      changed_by: 1
    }
    await this.journalsService.create(journal)
    return 'Updated';
  }

  async findAll() {
    const holders = await this.holderRepository.findAll()
    return holders;
  }

  async findOne(id: number) {
    const holder = await this.holderRepository.findByPk(id)
    return holder;
  }

  async getEmitentAllHolders() {
    const holders = await this.holderRepository.findAll()
    return holders
  }

  async getHolderEmissions(hid: number){
    const emissions = await this.emissionService.getEmissionsByHolderId(hid)
    return emissions
  }
  // Фильтр по дате надо протестировать с большим количеством данных
  async getHolderSecurities(hid: number, query: any) {
    return await this.emissionService.getHolderSecurities(hid, query)
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
          'id',
          'name',
          [sequelize.fn('SUM', sequelize.col('securities.quantity')), 'ordinary'],
          // [
          //   sequelize.literal(`(SUM(securities.quantity) * 100 / ${totalSecurities})`),
          //   'percentage'
          // ],
          [
            sequelize.literal(`(SUM(securities.quantity) * 100.0 / ${totalSecurities})::numeric(10, 2)`),
            'percentage'
          ],
          [
            sequelize.literal(`SUM(securities.quantity * "securities->emission"."nominal")`),
            'ordinary_nominal'
          ],
          'actual_address',
          // 'district_id'
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
          {
            model: HolderDistrict,
            attributes: ['name'],
          }
        ],
        group: ['Holder.id','district.id'],
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
          // [
          //   sequelize.literal(`(SUM(securities.quantity) * 100 / ${totalSecurities})`),
          //   'percentage'
          // ],
          [
            sequelize.literal(`(SUM(securities.quantity) * 100.0 / ${totalSecurities})::numeric(10, 2)`),
            'percentage'
          ],
          // [
          //   sequelize.literal(`(SUM(securities.quantity) * "securities->emission"."nominal")`),
          //   'ordinary_nominal'
          // ],
          [
            sequelize.literal(`SUM(securities.quantity * "securities->emission"."nominal")`),
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
          // 'district'

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
          {
            model: HolderDistrict,
            attributes: ['name'],
          }
        ],
        group: ['Holder.id', 'district.id'],
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
          // [
          //   sequelize.literal(`(SUM(securities.quantity) * 100.0 / ${totalSecurities})`),
          //   'percentage'
          // ],
          // [
          //   sequelize.literal(`(CAST(SUM(securities.quantity) * 100.0 / ${totalSecurities} AS numeric(10, 2)))`),
          //   'percentage_test'
          // ],
          // [
          //   sequelize.literal(`TO_CHAR((SUM(securities.quantity) * 100.0 / ${totalSecurities}), 'FM999999999.00')`),
          //   'percentage_test_2'
          // ],
          [
            sequelize.literal(`(SUM(securities.quantity) * 100.0 / ${totalSecurities})::numeric(10, 2)`),
            'percentage'
          ],
          [
            sequelize.literal(`SUM(securities.quantity * "securities->emission"."nominal")`),
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
            sequelize.literal(`CONCAT(passport_type, ' ', passport_number, ' ', passport_agency)`),
            'passport'
          ],
          'actual_address',
          // 'district'

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
          {
            model: HolderDistrict,
            attributes: ['name'],
          }
        ],
        group: ['Holder.id','securities->emission.reg_number','district.id'],
      })

      return holders;
    } catch (error) {
      throw new Error(`Failed to extract from registers: ${error.message}`);
    }
  }

  async getHolderTypes(){
    const types = await this.holderTypeRepository.findAll()
    return types
  }

  async createHolderType({name}: {name: string}){
    const type = await this.holderTypeRepository.create({name})
    return type
  }

  async updateHolderType(id: number, data: {name: string}){
    let type = await this.holderTypeRepository.findByPk(id)
    if(!type){
      throw new HttpException('Тип участника не найден', HttpStatus.BAD_REQUEST)
    }
    type.name = data.name
    await type.save()
    return type
  }

  async createDistrict(createDistrictDto: CreateDistrictDto) {
    const is_district = await this.holderDistrictRepository.findOne({
      where: {
        name: createDistrictDto.name
      }
    })
    if(is_district){
      throw new HttpException('Регион уже существует', HttpStatus.BAD_REQUEST)
    }
    const district = await this.holderDistrictRepository.create(createDistrictDto)
    return district;
  }

  async getDistricts(){
    const districts = await this.holderDistrictRepository.findAll()
    return districts
  }

  async updateDistrict(id: number, updateDistrictDto: UpdateDistrictDto) {
    let district = await this.holderDistrictRepository.findByPk(id)
    district.name = updateDistrictDto.name
    district = await district.save()
    return district
  }
  async deleteDistrict(id: number) {
    const district = await this.holderDistrictRepository.destroy({
      where: { id }
    })
    return district
  }
  async getHolderPledgeSecurities (holder_from_id, emitent_id, emission_id){
    const holder_from_security = await this.securityService.getHolderSecurity({holder_id: holder_from_id, emitent_id, emission_id})
    if(!holder_from_security) {
      throw new HttpException('Ценная бумага не найден', HttpStatus.BAD_REQUEST)
    }
    return await this.securityService.getPledgedSecurity(holder_from_security.id)
  }
}
