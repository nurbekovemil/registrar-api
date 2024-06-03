import { Injectable } from '@nestjs/common';
import { CreateSecurityDto } from './dto/create-security.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Security } from './entities/security.entity';

@Injectable()
export class SecuritiesService {
  constructor(
    @InjectModel(Security) private securityRepository: typeof Security,
  ) {}

  async createSecurity(createSecurityDto: CreateSecurityDto) {
    const security = await this.securityRepository.create(createSecurityDto)
    return security
  }
  
  async getSecuritiesByHolderId(holder_id: number) {
    const securities  = await this.securityRepository.findAll({
      where: { holder_id },
    });
    return securities
  }

  async getHolderSecurities(hid: number){
    const securities = await this.securityRepository.findAll({
      where: {
        holder_id: hid
      }
    })
    return securities
  }
}
