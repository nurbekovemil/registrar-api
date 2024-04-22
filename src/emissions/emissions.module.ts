import { Module } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { EmissionsController } from './emissions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emission } from './entities/emission.entity';
import { EmissionType } from './entities/emission-type.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Emission,
      EmissionType
    ])
  ],
  controllers: [EmissionsController],
  providers: [EmissionsService],
  exports: [EmissionsService]
})
export class EmissionsModule {}
