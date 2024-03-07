import { Injectable } from '@nestjs/common';
import { CreateEmitentDto } from './dto/create-emitent.dto';
import { UpdateEmitentDto } from './dto/update-emitent.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Emitent } from './entities/emitent.entity';

@Injectable()
export class EmitentsService {
  constructor(@InjectModel(Emitent) private emitentRepository: typeof Emitent){}
  
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

  async update(id: number, updateEmitentDto: UpdateEmitentDto) {
    const emitent = await this.emitentRepository.update(updateEmitentDto, {
      where: {
        id
      }
    })
    return emitent;
  }

  async remove(id: number) {
    const emitent = await this.emitentRepository.destroy({
      where: {
        id
      }
    })
    return emitent;
  }
}
