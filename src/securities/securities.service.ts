import { Injectable } from '@nestjs/common';
import { CreateSecurityDto } from './dto/create-security.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Security } from './entities/security.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Sequelize, literal } from 'sequelize';

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

  // async extractFromRegister(eid, hid){
  //   const security = await this.securityRepository.findAll({
  //     where: {
  //       holder_id: hid,
  //       emitent_id: eid
  //     },
  //     include: [
  //       {
  //         model: Holder
  //       },
  //       {
  //         model: Emitent
  //       },
  //       {
  //         model: Emission,
  //       }
  //     ]
  //   })
  //   return security
  // }
  async extractFromRegister(eid: number, hid: number) {
    const security = await this.securityRepository.findAll({
      where: {
        holder_id: hid,
        emitent_id: eid,
      },
      include: [
        {
          model: Holder,
        },
        {
          model: Emitent,
        },
        {
          model: Emission,
        }
      ],
    });
  
    return security;
  }
}
