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
    // const emission = await th
    return security
  }

  async deductQuentitySecurity(holder_security, quantity) {
    const security = await this.securityRepository.findByPk(holder_security.id)
    security.quantity = security.quantity - quantity
    return security.save()
  }

  async topUpQuentitySecurity(holder_security, quantity) {
    try {
      const security = await this.securityRepository.findByPk(holder_security.id)
      security.quantity = security.quantity + quantity
      return security.save()
    } catch (error) {
      
    }
  }

  async getHolderSecurity({holder_id, emitent_id, emission_id}){
    const securities = await this.securityRepository.findOne({
      where: {
        holder_id,
        emitent_id,
        emission_id
      }
    })
    return securities
  }
}
