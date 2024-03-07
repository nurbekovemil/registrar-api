import { Module } from '@nestjs/common';
import { EmitentsService } from './emitents.service';
import { EmitentsController } from './emitents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Emitent } from './entities/emitent.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Emitent
    ])
  ],
  controllers: [EmitentsController],
  providers: [EmitentsService]
})
export class EmitentsModule {}
