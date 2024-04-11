import { Module } from '@nestjs/common';
import { SecuritiesService } from './securities.service';
import { SecuritiesController } from './securities.controller';

@Module({
  controllers: [SecuritiesController],
  providers: [SecuritiesService]
})
export class SecuritiesModule {}
