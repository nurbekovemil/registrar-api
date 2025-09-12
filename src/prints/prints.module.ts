import { Module } from '@nestjs/common';
import { PrintsService } from './prints.service';
import { PrintsController } from './prints.controller';
import { EmitentsModule } from 'src/emitents/emitents.module';
import { EmissionsModule } from 'src/emissions/emissions.module';
import { SecuritiesModule } from 'src/securities/securities.module';
import { HoldersModule } from 'src/holders/holders.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { HolderStatus } from 'src/holders/entities/holder-status.entity';

@Module({
  imports: [EmitentsModule, EmissionsModule, SecuritiesModule, HoldersModule, TransactionsModule, HolderStatus],
  controllers: [PrintsController],
  providers: [PrintsService]
})
export class PrintsModule {}
