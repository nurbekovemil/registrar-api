import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { SecuritiesModule } from 'src/securities/securities.module';
import { TransactionOperation } from './entities/transaction-operation.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { EmissionsModule } from 'src/emissions/emissions.module';

@Module({
  imports: [
    forwardRef(() => EmissionsModule),
    SequelizeModule.forFeature([
      Transaction, 
      TransactionOperation,
      Holder,
      Emitent,
      Emission
    ]), 
    SecuritiesModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
