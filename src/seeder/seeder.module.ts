import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Security } from 'src/securities/entities/security.entity';
import { SeederController } from './seeder.controller';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Document } from 'src/documents/entities/document.entity';
import { SecurityType } from 'src/securities/entities/security-type.entity';
import { SecurityAttitude } from 'src/securities/entities/security-attitude.entity';
import { HolderDistrict } from 'src/holders/entities/holder-district.entity';
import { EmissionType } from 'src/emissions/entities/emission-type.entity';
import { TransactionOperation } from 'src/transactions/entities/transaction-operation.entity';
import { HolderType } from 'src/holders/entities/holder-type.entity';
import { HolderStatus } from 'src/holders/entities/holder-status.entity';
import { SecurityStatus } from 'src/securities/entities/security-status.entity';
import { User } from 'src/users/entities/users.entity';
import { SecurityBlock } from 'src/securities/entities/security-block.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Emitent,
      Emission,
      Holder,
      Security,
      Transaction,
      Document,
      SecurityAttitude,
      SecurityType,
      HolderDistrict,
      HolderType,
      EmissionType,
      TransactionOperation,
      HolderStatus,
      SecurityStatus,
      User,
      SecurityBlock,
    ]),
  ],
  controllers: [SeederController],
  providers: [SeederService]
})
export class SeederModule {}
