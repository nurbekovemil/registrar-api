import { Injectable } from '@nestjs/common';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Emission } from './entities/emission.entity';
import { EmissionType } from './entities/emission-type.entity';
import { Security } from 'src/securities/entities/security.entity';

@Injectable()
export class EmissionsService {
  constructor(
    @InjectModel(Emission) private emissionRepository: typeof Emission,
    @InjectModel(EmissionType) private emissionTypeRepository: typeof EmissionType,
  ){}

  async create(createEmissionDto: CreateEmissionDto) {
    const emission = await this.emissionRepository.create(createEmissionDto)
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
}
