import { Injectable } from '@nestjs/common';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Emission } from './entities/emission.entity';
import { EmissionType } from './entities/emission-type.entity';

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

  update(id: number, updateEmissionDto: UpdateEmissionDto) {
    return `This action updates a #${id} emission`;
  }

  remove(id: number) {
    return `This action removes a #${id} emission`;
  }

  async createEmissionType(name: {name: string}){
    const emissionType = await this.emissionTypeRepository.create(name)
    return emissionType
  }
  async getEmissionTypes(){
    const emissionTypes = await this.emissionTypeRepository.findAll()
    return emissionTypes
  }
}
