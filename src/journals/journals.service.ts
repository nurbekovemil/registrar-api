import { Journal } from './entities/journal.entity';
import { Injectable } from '@nestjs/common';
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
}
