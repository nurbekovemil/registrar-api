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

  async findAll() {
    const emissions = await this.emissionRepository.findAll()
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
  async getEmissionsByHolderId(hid: number){
    const emissions = await this.emissionRepository.findAll({
      include: [
        {
          model: Security,
          where: {
            holder_id: hid
          }
        }
      ]
    })
    return emissions
  }

  async deductQuentityEmission(emission_id, quantity){
    const emission = await this.emissionRepository.findByPk(emission_id)
    if(emission.count > 0 && emission.count >= quantity){
      emission.count = emission.count - quantity
      return emission.save()
    }
    throw new Error('Недостаточно средств')
  }

  async getHolderSecurities(hid: number){
    const securities = await this.emissionRepository.findAll({
      attributes: [
        'id',
        'reg_number',
        'nominal',
        [sequelize.col('securities.quantity'), 'count'],
        [sequelize.col('securities->security_block.quantity'), 'blocked_count'],
      ],
      include: [
        { 
          model: Security,
          attributes: [],
          where: {
            holder_id: hid
          },
          include: [
            
              SecurityBlock
            
          ]
        }
      ]
    })
    return securities
  }
}
