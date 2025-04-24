import { Journal } from './entities/journal.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SecuritiesService } from 'src/securities/securities.service';

@Injectable()
export class JournalsService {
  constructor(
    @InjectModel(Journal) private journalRepository: typeof Journal,
    private securityService: SecuritiesService
  ){}
  async create(createJournalDto: CreateJournalDto) {
    await this.journalRepository.create(createJournalDto);
  }

  async findAll(emitent_id: number) {
    return await this.journalRepository.findAll({
      where: {
        emitent_id: {
          [Op.contains]: [emitent_id]
        }
      }
    });
  }

  async findOne(id: number) {
    try {
      const journal = await this.journalRepository.findByPk(id);
      if(!journal) throw new Error('Журнал не найден')
      return journal;
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
