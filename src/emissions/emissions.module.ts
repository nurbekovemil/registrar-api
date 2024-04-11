import { Module } from '@nestjs/common';
import { EmissionsService } from './emissions.service';
import { EmissionsController } from './emissions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emission } from './entities/emission.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Emission
    ])
  ],
  controllers: [EmissionsController],
  providers: [EmissionsService]
})
export class EmissionsModule {}
