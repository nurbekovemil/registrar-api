import { Module } from '@nestjs/common';
import { DividendsService } from './dividends.service';
import { DividendsController } from './dividends.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dividend } from './entities/dividend.entity';
import { HoldersModule } from 'src/holders/holders.module';
import { SecuritiesModule } from 'src/securities/securities.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Dividend]),
    SecuritiesModule
  ],
  controllers: [DividendsController],
  providers: [DividendsService]
})
export class DividendsModule {}
