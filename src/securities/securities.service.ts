import { Injectable } from '@nestjs/common';
import { CreateSecurityDto } from './dto/create-security.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Security } from './entities/security.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Sequelize, literal } from 'sequelize';
import sequelize from 'sequelize';
import { SecurityBlock } from './entities/security-block.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
@Injectable()
export class SecuritiesService {
  constructor(
    @InjectModel(Security) private securityRepository: typeof Security,
    @InjectModel(SecurityBlock) private securityBlockRepository: typeof SecurityBlock,
    // @InjectModel(Transaction) private transactionRepository: typeof Transaction,
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

  async getEmitentHolders(eid: number){
    const holders = await this.securityRepository.findAll({
      where: {
        emitent_id: eid
      },
      attributes: [
        [sequelize.col('Security.holder_id'), 'id'],
        'quantity',
        [sequelize.literal('Holder.name'), 'name'], // Add this line
      ],
      include: [
        {
          model: Holder,
          attributes: []
          // attributes: ['id', 'name']
        }
      ],
      group: ['Security.id','holder.id']
    })
    return holders
  }
  async getEmitentHoldersByHolderType(eid: number, type: number){
    const holders = await this.securityRepository.findAll({
      where: {
        emitent_id: eid,
        quantity: {
          [sequelize.Op.ne]: 0
        }
      },
      attributes: [
        'holder_id',
        // 'quantity',
        [sequelize.literal(`
          "Security"."quantity" - COALESCE(
            (SELECT SUM(sb.quantity) 
             FROM security_blocks sb 
             WHERE sb.security_id = "Security"."id" 
               AND sb.unblock_date IS NULL), 
            0
          )
        `), 'quantity'], // Вычисление доступного количества
        [sequelize.literal('Holder.name'), 'holder_name'], // Add this line
      ],
      include: [
        {
          model: Holder,
          attributes: [],
          where: {
            holder_type: type
          }
          // attributes: ['id', 'name']
        }
      ],
      group: ['Security.id','holder.id']
    })
    return holders
  }

  async getSecurityBlock(security_id: number) {
    const security = await this.securityBlockRepository.findOne({
      where: {
        security_id
      }
    })
    return security
  }

  async lockingSecurity({security_id, quantity, block_date}) {
    const security = await this.securityBlockRepository.findOne({where: {security_id}})
    if(!security) {
      return await this.securityBlockRepository.create({
        security_id,
        quantity,
        block_date,
      })
    }
    security.quantity = security.quantity + quantity
    security.block_date = block_date
    return security.save()
  }

  async unlockingSecurity({security_id, quantity, unblock_date}) {
    const security = await this.securityBlockRepository.findOne({where: {security_id}})
    if(!security) throw new Error('Ценная бумага не найдена')
    if(security.quantity >= quantity) {
      security.quantity = security.quantity - quantity
      security.unblock_date = unblock_date
      return security.save()
    }
    throw new Error('Недостаточно средств для разблокировки')
  }

  // async getOperationsBySecurity(emitent_id: number, holder_id: number) {
  //   const operations = await this.securityRepository.findAll({
  //     where: {
  //       emitent_id,
  //       holder_id
  //     },
  //     include: [
  //       {
  //         model: Transaction
  //       }
  //     ]
  //   })
  //   return operations
  // }
}
