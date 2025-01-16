import { Module } from '@nestjs/common';
import { SecuritiesService } from './securities.service';
import { SecuritiesController } from './securities.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Security } from './entities/security.entity';
import { SecurityBlock } from './entities/security-block.entity';
import { SecurityPledge } from './entities/security-pledge.entity';

@Module({
  controllers: [SecuritiesController],
  providers: [SecuritiesService],
  imports: [SequelizeModule.forFeature([Security, SecurityBlock, SecurityPledge])],
  exports: [SecuritiesService]
})
export class SecuritiesModule {}
