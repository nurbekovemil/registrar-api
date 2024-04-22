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

  findAll() {
    return `This action returns all holders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} holder`;
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
