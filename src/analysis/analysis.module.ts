import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { Emission } from 'src/emissions/entities/emission.entity';
import { EmissionsModule } from 'src/emissions/emissions.module';
import { Holder } from 'src/holders/entities/holder.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Emission,
      Holder,
      Emitent
    ]),
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService]
})
export class AnalysisModule {}
