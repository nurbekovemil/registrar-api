import { forwardRef, Module } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { EmissionsController } from './emissions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emission } from './entities/emission.entity';
import { EmissionType } from './entities/emission-type.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { JournalsModule } from 'src/journals/journals.module';

@Module({
  imports: [
    forwardRef(() => TransactionsModule),
    SequelizeModule.forFeature([
      Emission,
      EmissionType
    ]),
    JournalsModule
  ],
  controllers: [EmissionsController],
  providers: [EmissionsService],
  exports: [EmissionsService]
})
export class EmissionsModule {}
