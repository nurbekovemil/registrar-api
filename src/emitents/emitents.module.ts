import { Module } from '@nestjs/common';
import { EmitentsService } from './emitents.service';
import { EmitentsController } from './emitents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emitent } from './entities/emitent.entity';
import { EmissionsModule } from 'src/emissions/emissions.module';
import { HoldersModule } from 'src/holders/holders.module';
import { SecuritiesModule } from 'src/securities/securities.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Emitent,
    ]),
    EmissionsModule,
    HoldersModule,
    SecuritiesModule
  ],
  controllers: [EmitentsController],
  providers: [EmitentsService],
  exports: [EmitentsService]
})
export class EmitentsModule {}
