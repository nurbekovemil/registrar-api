import { Module } from '@nestjs/common';
import { PrintsService } from './prints.service';
import { PrintsController } from './prints.controller';
import { EmitentsModule } from 'src/emitents/emitents.module';
import { EmissionsModule } from 'src/emissions/emissions.module';

@Module({
  imports: [EmitentsModule, EmissionsModule],
  controllers: [PrintsController],
  providers: [PrintsService]
})
export class PrintsModule {}
