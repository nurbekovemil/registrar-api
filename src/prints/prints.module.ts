import { Module } from '@nestjs/common';
import { PrintsService } from './prints.service';
import { PrintsController } from './prints.controller';

@Module({
  controllers: [PrintsController],
  providers: [PrintsService]
})
export class PrintsModule {}
