import { Journal } from './entities/journal.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class JournalsService {
  constructor(
    @InjectModel(Journal) private journalRepository: typeof Journal,
  ){}
  async create(createJournalDto: CreateJournalDto) {
    await this.journalRepository.create(createJournalDto);
  }

  async findAll() {
    return await this.journalRepository.findAll();
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
