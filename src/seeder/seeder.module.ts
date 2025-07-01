import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Security } from 'src/securities/entities/security.entity';
import { SeederController } from './seeder.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Emitent,
      Emission,
      Holder,
      Security
    ]),
  ],
  controllers: [SeederController],
  providers: [SeederService]
})
export class SeederModule {}
