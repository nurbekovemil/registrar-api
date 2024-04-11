import { Module } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { HoldersController } from './holders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Holder } from './entities/holder.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Holder
    ])
  ],
  controllers: [HoldersController],
  providers: [HoldersService]
})
export class HoldersModule {}
