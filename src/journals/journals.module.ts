import { Module } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Journal } from './entities/journal.entity';
import { SecuritiesModule } from 'src/securities/securities.module';
import { Document } from 'src/documents/entities/document.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Journal,
      Document,
      Holder,
      Emitent
    ]),
    SecuritiesModule
  ],
  controllers: [JournalsController],
  providers: [JournalsService],
  exports: [JournalsService]
})
export class JournalsModule {}
