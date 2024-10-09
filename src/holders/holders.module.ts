import { Module } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { HoldersController } from './holders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Holder } from './entities/holder.entity';
import { SecuritiesModule } from 'src/securities/securities.module';
import { EmissionsModule } from 'src/emissions/emissions.module';
import { Security } from 'src/securities/entities/security.entity';
import { HolderType } from './entities/holder-type.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      HolderType,
      Holder,
      Security
    ]),
    SecuritiesModule,
    EmissionsModule
  ],
  controllers: [HoldersController],
  providers: [HoldersService],
  exports: [HoldersService]
})
export class HoldersModule {}
