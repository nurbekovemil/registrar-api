import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { SecuritiesModule } from 'src/securities/securities.module';
import { TransactionOperation } from './entities/transaction-operation.entity';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, TransactionOperation]), SecuritiesModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
