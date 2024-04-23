import { Injectable } from '@nestjs/common';
import { CreateHolderDto } from './dto/create-holder.dto';
import { UpdateHolderDto } from './dto/update-holder.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Holder } from './entities/holder.entity';

@Injectable()
export class HoldersService {
  constructor(
    @InjectModel(Holder) private holderRepository: typeof Holder,
  ){}

  async create(createHolderDto: CreateHolderDto) {
    const holder = await this.holderRepository.create(createHolderDto)
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

  async getHoldersByEmitentId(id: number){
    
  }

  update(id: number, updateHolderDto: UpdateHolderDto) {
    return `This action updates a #${id} holder`;
  }

  remove(id: number) {
    return `This action removes a #${id} holder`;
  }
}
