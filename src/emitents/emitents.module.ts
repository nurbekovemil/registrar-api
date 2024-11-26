import { Module } from '@nestjs/common';
import { EmitentsService } from './emitents.service';
import { EmitentsController } from './emitents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emitent } from './entities/emitent.entity';
import { EmissionsModule } from 'src/emissions/emissions.module';
import { HoldersModule } from 'src/holders/holders.module';
import { SecuritiesModule } from 'src/securities/securities.module';
import { JournalsModule } from 'src/journals/journals.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Emitent,
    ]),
    EmissionsModule,
    HoldersModule,
    SecuritiesModule,
    JournalsModule
  ],
  controllers: [EmitentsController],
  providers: [EmitentsService],
  exports: [EmitentsService]
})
export class EmitentsModule {}
