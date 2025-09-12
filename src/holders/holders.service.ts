import { JournalsService } from './../journals/journals.service';
import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
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
import { EmissionType } from 'src/emissions/entities/emission-type.entity';
import { HolderStatus } from './entities/holder-status.entity';
import { is } from 'sequelize/types/lib/operators';


@Injectable()
export class HoldersService {
  constructor(
    @InjectModel(Holder) private holderRepository: typeof Holder,
    @InjectModel(HolderType) private holderTypeRepository: typeof HolderType,
    @InjectModel(HolderDistrict) private holderDistrictRepository: typeof HolderDistrict,
    @InjectModel(HolderStatus) private holderStatusRepository: typeof HolderStatus,
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
    if(!old_holder_value){
      throw new HttpException(
        'Участник не найден',
        HttpStatus.BAD_REQUEST,
      )
    }
    await this.holderRepository.update(updateHolderDto, {
      where: {
        id
      }
    })
    const emitents = await this.securityService.getEmitentsByHolderId(id)
    const journal = {
      title: `Запись изменена в участнике: ${updateHolderDto.name}`,
      old_value: old_holder_value,
      new_value: updateHolderDto,
      change_type: 'holder',
      emitent_id: emitents.map(e => e.id),
      document_id: updateHolderDto.document_id,
      holder_id: id,
      org_emitent_id: updateHolderDto.org_emitent_id
    }
    await this.journalsService.create(journal)
    return 'Updated';
  }

  async delete(id: number) {
    try {
      const isSecurities = await this.emissionService.getHolderSecurities(id)
      if(isSecurities.length > 0){
        throw new Error('Нельзя удалить участника, в котором есть ценные бумаги')
      }
      await this.holderRepository.destroy({
        where: {
          id
        }
      })
      return 'Участник удален';
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async findAll() {
    const holders = await this.holderRepository.findAll()
    return holders;
  }

async findOne(id: number) {
  const holder = await this.holderRepository.findOne({
    where: { id },
    include: [
      {
        model: HolderType,
        // attributes: [],
      },
      {
        model: HolderDistrict,
        // attributes: [],
      },
      {
        model: HolderStatus,
        // attributes: [],
      },
    ],
    // attributes: {
    //   // include: [
    //   //   [sequelize.col('type.name'), 'holder_type'],
    //   //   [sequelize.col('district.name'), 'district_id'],
    //   // ],
    // },
  });

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
  async getFormattedExtractFromRegisters(eid: number, query){
    let emission_type = null
    const isHasEmissionType = await this.emissionService.hasEmissionType(emission_type)
    if(!isHasEmissionType) {
      emission_type = 'all'
    } else {
      emission_type = query.emission_type
    }
    const securities = await this.securityService.getEmitentSecurities(eid, emission_type);
    const totalSecurities = securities.reduce((total, security) => total + Number(security.quantity), 0);

    return securities.map(security => {
      const emission = security.emission;
      const holder = security.holder;

      const percentageOfEmission = ((security.quantity * 100.0) / totalSecurities).toFixed(2);
      const nominal = (security.quantity * emission.nominal).toFixed(2);

      const isPreferred = emission.type_id === 2; // указывается тип акций

      return {
        id: security.id,
        holder_id: holder.id,
        full_name: holder?.name, // Ф.и.о.
        common_quantity: isPreferred ? 0 : security.quantity, // Количество простых акций
        common_nominal: isPreferred ? 0 : (security.quantity * emission.nominal).toFixed(2), // Номинал простых
        preferred_quantity: isPreferred ? security.quantity : 0, // Количество привилегированных акций
        preferred_nominal: isPreferred ? (security.quantity * emission.nominal).toFixed(2) : 0, // Номинал привилегированных
        percentage: percentageOfEmission, // Процент от эмиссии
        country: holder?.district?.name, // Страна
      };
    });
  }
  async getFormattedExtractReestrOwns(eid: number, query) {
    const { emission_type } = query;
  
    // Получаем все акции эмитента с учетом типа эмиссии
    const securities = await this.securityService.getEmitentSecurities(eid, emission_type);
  
    // Получаем общее количество акций эмитента
    const totalSecurities = securities.reduce((total, security) => total + Number(security.quantity), 0);

  
    return securities.map(security => {
      const emission = security.emission;
      const holder = security.holder;
  
      const percentageOfEmission = ((security.quantity * 100.0) / totalSecurities).toFixed(2);
  
      // Определяем, является ли акция простой или привилегированной
      const isPreferred = emission.type_id === 2; // указывается тип акций
  
      return {
        id: security.id,
        holder_id: holder.id,
        full_name: holder?.name, // Ф.и.о.
        country: holder?.district?.name, // Страна
        percentage: percentageOfEmission, // Процент от эмиссии
        common_quantity: isPreferred ? 0 : security.quantity, // Количество простых акций
        common_nominal: isPreferred ? 0 : (security.quantity * emission.nominal).toFixed(2), // Номинал простых
        preferred_quantity: isPreferred ? security.quantity : 0, // Количество привилегированных акций
        preferred_nominal: isPreferred ? (security.quantity * emission.nominal).toFixed(2) : 0, // Номинал привилегированных
        passport: `${holder?.passport_type} ${holder?.passport_number} ${holder?.passport_agency}`,
        address: holder?.actual_address
      };
    });
  }
  async getFormattedExtractReestrOwnsByEmission(eid: number, query: any) {
    const { emission_id } = query;
  
    // Получаем все акции эмитента с учетом типа эмиссии
    const securities = await this.securityService.getEmitentSecurities(eid, null, emission_id);
    // Получаем общее количество акций эмитента
    // const totalSecurities = await Security.sum('quantity', { where: { emitent_id: eid } });
    const totalSecurities = securities.reduce((total, security) => total + Number(security.quantity), 0);
  
    return securities.map(security => {
      const emission = security.emission;
      const holder = security.holder;
  
      const percentageOfEmission = ((security.quantity * 100.0) / totalSecurities).toFixed(5);
  
      // Определяем, является ли акция простой или привилегированной
      const isPreferred = emission.type_id === 2; // указывается тип акций
  
      return {
        id: security.id,
        holder_id: holder.id,
        full_name: holder?.name, // Ф.и.о.
        emission: emission.reg_number,
        percentage: percentageOfEmission, // Процент от эмиссии
        common_quantity: isPreferred ? 0 : security.quantity, // Количество простых акций
        common_nominal: isPreferred ? 0 : (security.quantity * emission.nominal).toFixed(2), // Номинал простых
        preferred_quantity: isPreferred ? security.quantity : 0, // Количество привилегированных акций
        preferred_nominal: isPreferred ? (security.quantity * emission.nominal).toFixed(2) : 0, // Номинал привилегированных
        passport: `${holder?.passport_type} ${holder?.passport_number} ${holder?.passport_agency}`,
        address: holder?.actual_address
      };
    });
  }
  

  async extractFromRegisters(eid: number, query){
    return this.getFormattedExtractFromRegisters(eid, query)
  }

  async getExtractReestrOwns(eid: number, query){
    return this.getFormattedExtractReestrOwns(eid, query)
  }

  // async extractFromRegisters(eid: number) {
  //   try {
  //     if (!eid) {
  //       throw new Error('Emitent id is required');
  //     }
  //     const totalSecurities = await Security.sum('quantity', {
  //       where: { emitent_id: eid }
  //     });
  //     const holders = this.holderRepository.findAll({
  //       attributes: [
  //         'id',
  //         'name',
  //         [sequelize.fn('SUM', sequelize.col('securities.quantity')), 'ordinary'],
  //         // [
  //         //   sequelize.literal(`(SUM(securities.quantity) * 100 / ${totalSecurities})`),
  //         //   'percentage'
  //         // ],
  //         [
  //           sequelize.literal(`(SUM(securities.quantity) * 100.0 / ${totalSecurities})::numeric(10, 2)`),
  //           'percentage'
  //         ],
  //         [
  //           sequelize.literal(`SUM(securities.quantity * "securities->emission"."nominal")`),
  //           'ordinary_nominal'
  //         ],
  //         'actual_address',
  //         // 'district_id'
  //       ],
  //       include: [
  //         {
  //           model: Security,
  //           attributes: [],
  //           where: {
  //             emitent_id: eid
  //           },
  //           include: [
  //             {
  //               model: Emission,
  //               attributes: [],
  //             }
  //           ]
  //         },
  //         {
  //           model: HolderDistrict,
  //           attributes: ['name'],
  //         }
  //       ],
  //       group: ['Holder.id','district.id'],
  //     })

  //     return holders;
  //   } catch (error) {
  //     throw new Error(`Failed to extract from registers: ${error.message}`);
  //   }
  // }

  // async getExtractReestrOwns(eid: number) {
  //   try {
  //     if (!eid) {
  //       throw new Error('Emitent id is required');
  //     }
  //     const totalSecurities = await Security.sum('quantity', {
  //       where: { emitent_id: eid }
  //     });
  //     const holders = this.holderRepository.findAll({
  //       attributes: [
  //         'id',  // Выбор конкретных полей, например, id и name
  //         'name',
  //         [sequelize.fn('SUM', sequelize.col('securities.quantity')), 'ordinary'],
  //         // [
  //         //   sequelize.literal(`(SUM(securities.quantity) * 100 / ${totalSecurities})`),
  //         //   'percentage'
  //         // ],
  //         [
  //           sequelize.literal(`(SUM(securities.quantity) * 100.0 / ${totalSecurities})::numeric(10, 2)`),
  //           'percentage'
  //         ],
  //         // [
  //         //   sequelize.literal(`(SUM(securities.quantity) * "securities->emission"."nominal")`),
  //         //   'ordinary_nominal'
  //         // ],
  //         [
  //           sequelize.literal(`SUM(securities.quantity * "securities->emission"."nominal")`),
  //           'ordinary_nominal'
  //         ],
  //         [
  //           sequelize.literal('0'),
  //           'privileged'
  //         ],
  //         [
  //           sequelize.literal('0.00'),
  //           'privileged_nominal'
  //         ],
  //         [
  //           sequelize.literal('0.00'),
  //           'percentage_quantity'
  //         ],
  //         [
  //           sequelize.literal(`CONCAT(passport_type, ' ', passport_number, ' ', passport_agency)`),
  //           'passport'
  //         ],
  //         'actual_address',
  //         // 'district'

  //       ],
  //       include: [
  //         {
  //           model: Security,
  //           attributes: [],
  //           where: {
  //             emitent_id: eid
  //           },
  //           include: [
  //             {
  //               model: Emission,
  //               attributes: [],
  //             }
  //           ]
  //         },
  //         {
  //           model: HolderDistrict,
  //           attributes: ['name'],
  //         }
  //       ],
  //       group: ['Holder.id', 'district.id'],
  //     })

  //     return holders;
  //   } catch (error) {
  //     throw new Error(`Failed to extract from registers: ${error.message}`);
  //   }
  // }

  
  async getExtractReestrOwnsByEmission(eid: number, query: any) {
    return this.getFormattedExtractReestrOwnsByEmission(eid, query)
  }

  // async getExtractReestrOwnsByEmission(eid: number, query: any) {
  //   try {
  //     if (!eid) {
  //       throw new Error('Emitent id is required');
  //     }
  //     const totalSecurities = await Security.sum('quantity', {
  //       where: { emitent_id: eid },
  //     });
  //     const holders = this.holderRepository.findAll({
  //       attributes: [
  //         'id',  // Выбор конкретных полей, например, id и name
  //         'name',
  //         [sequelize.fn('SUM', sequelize.col('securities.quantity')), 'ordinary'],
  //         [sequelize.col('securities.emission.reg_number'), 'reg_number'],
  //         [
  //           sequelize.literal(`(SUM(securities.quantity) * 100.0 / ${totalSecurities})::numeric(10, 2)`),
  //           'percentage'
  //         ],
  //         [
  //           sequelize.literal(`SUM(securities.quantity * "securities->emission"."nominal")`),
  //           'ordinary_nominal'
  //         ],
  //         [
  //           sequelize.literal('0'),
  //           'privileged'
  //         ],
  //         [
  //           sequelize.literal('0.00'),
  //           'privileged_nominal'
  //         ],
  //         [
  //           sequelize.literal(`CONCAT(passport_type, ' ', passport_number, ' ', passport_agency)`),
  //           'passport'
  //         ],
  //         'actual_address',
  //         // 'district'

  //       ],
  //       include: [
  //         {
  //           model: Security,
  //           attributes: [],
  //           where: {
  //             emitent_id: eid
  //           },
  //           include: [
  //             {
  //               model: Emission,
  //               attributes: [],
  //               where: {
  //                 id: query.emission
  //               }
  //             }
  //           ],
  //         },
  //         {
  //           model: HolderDistrict,
  //           attributes: ['name'],
  //         }
  //       ],
  //       group: ['Holder.id','securities->emission.reg_number','district.id'],
  //     })

  //     return holders;
  //   } catch (error) {
  //     throw new Error(`Failed to extract from registers: ${error.message}`);
  //   }
  // }

    
  

  // HOLDER TYPES CRUD
  async getHolderTypes(){
    const types = await this.holderTypeRepository.findAll()
    return types
  }

  async createHolderType(name: string){
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

  async deleteHolderType(id: number){
    const isHolders = await this.holderRepository.findAll({
      where: {
        holder_type: id
      }
    })
    if(isHolders.length > 0){
      throw new HttpException('Нельзя удалить категорию акционера, в котором есть участники', HttpStatus.BAD_REQUEST)
    }
    return await this.holderTypeRepository.destroy({
      where: {
        id
      }
    })
  }

  // HOLDER STATUS CRUD
  async getHolderStatus() {
    const statuses = await this.holderStatusRepository.findAll();
    return statuses;
  }
  
  async createHolderStatus(name: string) {
    const status = await this.holderStatusRepository.create({ name });
    return status;
  }
  
  async updateHolderStatus(id: number, data: { name: string }) {
    let status = await this.holderStatusRepository.findByPk(id);
    if (!status) {
      throw new HttpException('Статус участника не найден', HttpStatus.BAD_REQUEST);
    }
    status.name = data.name;
    await status.save();
    return status;
  }
  
  async deleteHolderStatus(id: number) {
    const isHolders = await this.holderRepository.findAll({
      where: {
        holder_status: id,
      },
    });
    if (isHolders.length > 0) {
      throw new HttpException('Нельзя удалить статус участника, в котором есть участники', HttpStatus.BAD_REQUEST);
    }
    return await this.holderStatusRepository.destroy({
      where: {
        id,
      },
    });
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
    const isHolders = await this.holderRepository.findAll({
      where: {
        district_id: id
      }
    })
    if(isHolders.length > 0){
      throw new HttpException('Нельзя удалить регион, в котором есть участники', HttpStatus.BAD_REQUEST)
    }
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

  async getEmitentsByHolderId(id: number) {
    return await this.securityService.getEmitentsByHolderId(id)
  }

  async getEmitentEmissions(hid, eid){
    return await this.emissionService.getEmitentEmissions(hid, eid)
  }


}
