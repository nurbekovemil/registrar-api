import { Module } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Journal } from './entities/journal.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Journal
    ])
  ],
  controllers: [JournalsController],
  providers: [JournalsService],
  exports: [JournalsService]
})
export class JournalsModule {}
