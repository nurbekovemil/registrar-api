import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './entities/account.entity';
import { AccountType } from './entities/account-type.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Account, AccountType
    ])
  ],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule {}
