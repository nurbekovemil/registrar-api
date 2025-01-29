import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Emission } from './entities/emission.entity';
import { EmissionType } from './entities/emission-type.entity';
import { Security } from 'src/securities/entities/security.entity';
import sequelize from 'sequelize';
import { SecurityBlock } from 'src/securities/entities/security-block.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { SecurityPledge } from 'src/securities/entities/security-pledge.entity';
import { Op } from 'sequelize';

@Injectable()
export class EmissionsService {
  constructor(
    @InjectModel(Emission) private emissionRepository: typeof Emission,
    @InjectModel(EmissionType) private emissionTypeRepository: typeof EmissionType,
    @Inject(forwardRef(() => TransactionsService)) private transactionsService: TransactionsService,
  ){}

  async create(createEmissionDto: CreateEmissionDto) {
    const emission = await this.emissionRepository.create({...createEmissionDto, count: createEmissionDto.start_count})
    await this.transactionsService.createTransaction({
      is_exchange: false,
      operation_id: 2,
      emitent_id: createEmissionDto.emitent_id,
      emission_id: emission.id,
      holder_from_id: null,
      holder_to_id: null,
      is_family: false,
      quantity: createEmissionDto.start_count,
      amount: 0,
      contract_date: new Date().toISOString()
      
    })
    return emission
  }

  async findAll(query?: any) {
    const {start_date, end_date} = query
    const emissionCondition: any = {}
    if(start_date && end_date){
      emissionCondition.released_date = {
        [Op.between]: [start_date, end_date]
      }
    }
    const emissions = await this.emissionRepository.findAll({where: emissionCondition})
    return emissions
  }

  async findOne(id: number) {
    const emission = await this.emissionRepository.findByPk(id)
    return emission
  }

  async getEmissionsByEmitentId(emitent_id: number){
    const emissions = await this.emissionRepository.findAll({
      where: {
        emitent_id
      }
    })
    return emissions
  }
  
  async createEmissionType(name: {name: string}){
    const emissionType = await this.emissionTypeRepository.create(name)
    return emissionType
  }
  async getEmissionTypes(){
    const emissionTypes = await this.emissionTypeRepository.findAll()
    return emissionTypes
  }
  // async getEmissionsByHolderId(hid: number){
  //   const emissions = await this.emissionRepository.findAll({
  //     include: [
  //       {
  //         model: Security,
  //         where: {
  //           holder_id: hid
  //         },
  //         include: [
  //           {
  //             model: SecurityPledge,
  //             as: 'security_pledged', // В залоге для этой бумаги
  //           },
  //           {
  //             model: SecurityPledge,
  //             as: 'security_pledgee', // Принято в залог для этой бумаги
  //           },
  //           {
  //             model: SecurityBlock
  //           }
  //         ]
  //       }
  //     ]
  //   })
  //   return emissions
  // }

  async getEmissionsByHolderId(hid: number){
    const emissions = await this.emissionRepository.findAll({
      include: 
        {
          model: Security,
          where: {
            holder_id: hid
          },
          include: [
            {
              model: SecurityPledge,
              as: 'security_pledged', // В залоге для этой бумаги
            },
            {
              model: SecurityPledge,
              as: 'security_pledgee', // Принято в залог для этой бумаги
            },
            {
              model: SecurityBlock
            }
          ]
        }
      
    })
    return emissions.map(emission => ({
      reg_number: emission.reg_number,
      type: 'простые', // Или другой тип, если он у вас есть
      total_shares: emission.securities.reduce((sum, security) => sum + security.quantity, 0),
      nominal: emission.nominal || 0,
      total_nominal_value:
        (emission.nominal || 0) *
        emission.securities.reduce((sum, security) => sum + security.quantity, 0),
      pledged_shares: emission.securities.reduce(
        (sum, security) => sum + (security.security_pledged?.pledged_quantity || 0),
        0,
      ),
      accepted_in_pledge: emission.securities.reduce(
        (sum, security) => sum + (security.security_pledgee?.pledged_quantity || 0),
        0,
      ),
      blocked_shares: emission.securities.reduce(
        (sum, security) => sum + (security.security_block?.quantity || 0),
        0,
      ),
    }));
  }

  async deductQuentityEmission(emission_id, quantity){
    const emission = await this.emissionRepository.findByPk(emission_id)
    if(emission.count > 0 && emission.count >= quantity){
      emission.count = emission.count - quantity
      return emission.save()
    }
    throw new Error('Недостаточно средств')
  }

  async getHolderSecurities(hid: number, query?) {
    const { start_date, end_date } = query
    const securityCondition: any = {
      holder_id: hid
    }
    if (start_date && end_date) {
      securityCondition.purchased_date = { 
        [Op.between]: [new Date(start_date), new Date(end_date)]
      }
    }
    const securities = await this.emissionRepository.findAll({
      attributes: [
        'id',
        'reg_number',
        'nominal',
        [sequelize.col('securities.purchased_date'), 'purchased_date'],
        [sequelize.col('securities.quantity'), 'count'],
        [sequelize.col('securities->security_block.quantity'), 'blocked_count'],
        [sequelize.col('securities->security_pledgee.pledged_quantity'), 'pledge_count'],
      ],
      include: [
        { 
          model: Security,
          attributes: [],
          where: securityCondition,
          include: [
              {
                model: SecurityBlock
              },
              {
                model: SecurityPledge,
                as: 'security_pledgee',
              }
          ],
        }
      ]
    })
    return securities
  }
}
