import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Emission } from './entities/emission.entity';
import { EmissionType } from './entities/emission-type.entity';
import { Security } from 'src/securities/entities/security.entity';
import sequelize, { col, fn } from 'sequelize';
import { SecurityBlock } from 'src/securities/entities/security-block.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { SecurityPledge } from 'src/securities/entities/security-pledge.entity';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { JournalsService } from 'src/journals/journals.service';
import { Holder } from 'src/holders/entities/holder.entity';

@Injectable()
export class EmissionsService {
  constructor(
    @InjectModel(Emission) private emissionRepository: typeof Emission,
    @InjectModel(EmissionType) private emissionTypeRepository: typeof EmissionType,
    @Inject(forwardRef(() => TransactionsService)) private transactionsService: TransactionsService,
    private journalsService: JournalsService,
  ){}

  async create(createEmissionDto: CreateEmissionDto) {
    const emission = await this.emissionRepository.create({...createEmissionDto, count: createEmissionDto.start_count})
    await this.transactionsService.createTransaction({
      is_exchange: false,
      operation_id: 22, // Эмиссия
      emitent_id: createEmissionDto.emitent_id,
      emission_id: emission.id,
      holder_from_id: null,
      holder_to_id: null,
      is_family: false,
      quantity: createEmissionDto.start_count,
      amount: 0,
      contract_date: new Date().toISOString()
    })
    return emission
  }

  async findAll(query?: any) {
    const {start_date, end_date} = query
    const emissionCondition: any = {}
    if(start_date && end_date){
      emissionCondition.released_date = {
        [Op.between]: [`${start_date}`, `${end_date} 23:59:59.999`]
      } 
    }
    const emissions = await this.emissionRepository.findAll({
      attributes: {
        exclude: ['type_id'],
        include: [
          [sequelize.col('emission.name'), 'type']
        ]
      },
      where: emissionCondition,
      include: [
        {
          model: EmissionType,
          attributes:[]
        }
      ]
    })
    return emissions
  }

  async findOne(id: number) {
    const emission = await this.emissionRepository.findByPk(id)
    return emission
  }

  async getEmissionsByEmitentId(emitent_id: number){
    const emissions = await this.emissionRepository.findAll({
      where: {
        emitent_id
      },
      attributes: {
        exclude: ['type_id'],
        include: [
          [sequelize.col('emission.name'), 'type']
        ]
      },
      include: [
        {
          model: EmissionType,
          attributes: []
        }
      ]
    })
    return emissions
  }
  
  // async createEmissionType(name: {name: string}){
  //   const emissionType = await this.emissionTypeRepository.create(name)
  //   return emissionType
  // }
  async getEmissionTypes(){
    const emissionTypes = await this.emissionTypeRepository.findAll()
    return emissionTypes
  }
  async hasEmissionType(id){
    const emissionType = await this.emissionTypeRepository.findByPk(id)
    return emissionType
  }

  async createEmissionType(name: string){
    const emissionType = await this.emissionTypeRepository.create({name})
    return emissionType
  }

  async updateEmissionType(id: number, name: string){
    let type = await this.emissionTypeRepository.findByPk(id)
    type.name = name
    return await type.save()
  }

  async deleteEmissionType(id: number){
    try {
      const isEmissions = await this.emissionRepository.findAll({
        where: {
          type_id: id
        }
      })
      if(isEmissions.length > 0){
        throw new Error('Нельзя удалить тип эмиссии, в котором есть эмиссии')
      }
      return await this.emissionTypeRepository.destroy({
        where: {
          id
        }
      })
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async getEmissionsByHolderId(hid: number){
  //   const emissions = await this.emissionRepository.findAll({
  //     include: [
  //       {
  //         model: Security,
  //         where: {
  //           holder_id: hid
  //         },
  //         include: [
  //           {
  //             model: SecurityPledge,
  //             as: 'security_pledged', // В залоге для этой бумаги
  //             required: false,
  //             where: {
  //               pledger_id: hid
  //             }
  //           },
  //           {
  //             model: SecurityPledge,
  //             as: 'security_pledgee', // Принято в залог для этой бумаги
  //             required: false,
  //             where: {
  //               pledgee_id: hid
  //             }
  //           },
  //           {
  //             model: SecurityBlock
  //           }
  //         ]
  //       },
  //       {
  //         model: EmissionType
  //       }
  //     ]
  //   })
  //   return emissions.map(emission => ({
  //     reg_number: emission.reg_number,
  //     // type: 'простые', // Или другой тип, если он у вас есть
  //     type: emission?.emission?.name,
  //     total_shares: emission.securities.reduce((sum, security) => sum + security.quantity, 0),
  //     nominal: emission.nominal || 0,
  //     total_nominal_value:
  //       (emission.nominal || 0) *
  //       emission.securities.reduce((sum, security) => sum + security.quantity, 0),
  //     pledged_shares: emission.securities.reduce(
  //       (sum, security) => sum + (security.security_pledged?.pledged_quantity || 0),
  //       0,
  //     ),
  //     accepted_in_pledge: emission.securities.reduce(
  //       (sum, security) => sum + (security.security_pledgee?.pledged_quantity || 0),
  //       0,
  //     ),
  //     blocked_shares: emission.securities.reduce(
  //       (sum, security) => sum + (security.security_block?.quantity || 0),
  //       0,
  //     ),
  //   }));
  // }

  async getEmissionsByHolderId(hid: number) {
  const emissions = await this.emissionRepository.findAll({
    include: [
      {
        model: Security,
        where: Sequelize.literal(`(
          "securities"."holder_id" = ${hid} OR 
          EXISTS (
            SELECT 1 FROM "security_pledges" AS "sp" 
            WHERE "sp"."security_id" = "securities"."id" 
            AND ("sp"."pledger_id" = ${hid} OR "sp"."pledgee_id" = ${hid})
          )
        )`),
        include: [
          {
            model: SecurityPledge,
            as: 'security_pledged',
            required: false,
            where: { pledger_id: hid }
          },
          {
            model: SecurityPledge,
            as: 'security_pledgee',
            required: false,
            where: { pledgee_id: hid }
          },
          {
            model: SecurityBlock,
            required: false // Рекомендуется добавить
          }
        ]
      },
      {
        model: EmissionType // Убедитесь, что это поле совпадает с emission?.emission_type
      }
    ]
  });

  return emissions.map(emission => {
    // 1. Считаем общее кол-во акций текущего холдера в этой эмиссии
    const totalShares = emission.securities.reduce((sum, s) => sum + (s.quantity || 0), 0);
    
    // 2. Считаем акции в залоге (сумма по всем записям массива security_pledged)
    const pledgedShares = emission.securities.reduce((sum, s) => {
      const pledgeSum = s.security_pledged?.reduce((pSum, p) => pSum + (p.pledged_quantity || 0), 0) || 0;
      return sum + pledgeSum;
    }, 0);

    // 3. Считаем акции, принятые в залог
    const acceptedInPledge = emission.securities.reduce((sum, s) => {
      const pledgeeSum = s.security_pledgee?.reduce((pSum, p) => pSum + (p.pledged_quantity || 0), 0) || 0;
      return sum + pledgeeSum;
    }, 0);

    // 4. Считаем заблокированные акции
    const blockedShares = emission.securities.reduce((sum, s) => {
      return sum + (s.security_block?.quantity || 0);
    }, 0);

    return {
      reg_number: emission.reg_number,
      // Исправлено обращение к типу эмиссии (зависит от вашей модели EmissionType)
      type: emission?.emission?.name,
      total_shares: totalShares,
      nominal: emission.nominal || 0,
      total_nominal_value: (emission.nominal || 0) * totalShares,
      pledged_shares: pledgedShares,
      accepted_in_pledge: acceptedInPledge,
      blocked_shares: blockedShares,
    };
  });
}

  // async getEmissionsByEmitentIdHolderId(eid: number, hid: number){
  //   const emissions = await this.emissionRepository.findAll({
  //     include: [
  //       {
  //         model: Security,
  //         where: {
  //           emitent_id: eid,
  //           holder_id: hid
  //         },
  //         include: [
  //           {
  //             model: SecurityPledge,
  //             as: 'security_pledged', // В залоге для этой бумаги
  //             required: false,
  //             where: {
  //               pledger_id: hid
  //             }
  //           },
  //           {
  //             model: SecurityPledge,
  //             as: 'security_pledgee', // Принято в залог для этой бумаги
  //             required: false,
  //             where: {
  //               pledgee_id: hid
  //             }
  //           },
  //           {
  //             model: SecurityBlock
  //           }
  //         ]
  //       },
  //       {
  //         model: EmissionType
  //       }
  //     ]
  //   })
  //   return emissions.map(emission => ({
  //     reg_number: emission.reg_number,
  //     // type: 'простые', // Или другой тип, если он у вас есть
  //     type: emission?.emission?.name,
  //     total_shares: emission.securities.reduce((sum, security) => sum + security.quantity, 0),
  //     nominal: emission.nominal || 0,
  //     total_nominal_value:
  //       (emission.nominal || 0) *
  //       emission.securities.reduce((sum, security) => sum + security.quantity, 0),
  //     pledged_shares: emission.securities.reduce((sum, security) => {
  //       return sum + (security.security_pledged?.pledged_quantity || 0);
  //     }, 0),

  //     accepted_in_pledge: emission.securities.reduce((sum, security) => {
  //       return sum + (security.security_pledgee?.pledged_quantity || 0);
  //     }, 0),

  //     blocked_shares: emission.securities.reduce(
  //       (sum, security) => sum + (security.security_block?.quantity || 0),
  //       0,
  //     ),
  //     share_percent: (emission.securities.reduce((sum, security) => sum + security.quantity, 0) / emission.start_count) * 100
  //   }));
  // }

  async getEmissionsByEmitentIdHolderId(eid: number, hid: number) {
  const emissions = await this.emissionRepository.findAll({
    where: {
      emitent_id: eid,
    },
    include: [
      {
        model: Security,
        required: false,
        where: Sequelize.literal(`(
          "securities"."holder_id" = ${hid} OR 
          EXISTS (
            SELECT 1 FROM "security_pledges" AS "sp" 
            WHERE "sp"."security_id" = "securities"."id" 
            AND ("sp"."pledger_id" = ${hid} OR "sp"."pledgee_id" = ${hid})
          )
        )`),
        include: [
          {
            model: SecurityPledge,
            as: 'security_pledged', // Акции, которые ХОЛДЕР отдал в залог
            required: false,
            where: { pledger_id: hid },
          },
          {
            model: SecurityPledge,
            as: 'security_pledgee', // Акции, которые ХОЛДЕР принял в залог
            required: false,
            where: { pledgee_id: hid },
          },
          {
            model: SecurityBlock,
            required: false,
          },
        ],
      },
      {
        model: EmissionType,
      },
    ],
  });

  return emissions.map((emission) => {
    // Предварительно считаем общее количество акций холдера в этой эмиссии
    const totalShares = emission.securities.reduce(
      (sum, security) => sum + (security.quantity || 0),
      0,
    );

    // Суммируем залоги (помним, что security_pledged — это МАССИВ)
    const pledgedShares = emission.securities.reduce((sum, security) => {
      const securityPledgeSum = security.security_pledged?.reduce(
        (pSum, pledge) => pSum + (pledge.pledged_quantity || 0),
        0,
      ) || 0;
      return sum + securityPledgeSum;
    }, 0);

    const acceptedInPledge = emission.securities.reduce((sum, security) => {
      const securityPledgeeSum = security.security_pledgee?.reduce(
        (pSum, pledge) => pSum + (pledge.pledged_quantity || 0),
        0,
      ) || 0;
      return sum + securityPledgeeSum;
    }, 0);

    const blockedShares = emission.securities.reduce(
      (sum, security) => sum + (security.security_block?.quantity || 0),
      0,
    );

    return {
      reg_number: emission.reg_number,
      // Исправьте путь к названию типа в зависимости от вашей модели EmissionType
      type: emission?.emission?.name,
      total_shares: totalShares,
      nominal: emission.nominal || 0,
      total_nominal_value: (emission.nominal || 0) * totalShares,
      pledged_shares: pledgedShares,
      accepted_in_pledge: acceptedInPledge,
      blocked_shares: blockedShares,
      // Проверка на деление на ноль для процента
      share_percent: emission.start_count 
        ? (totalShares / emission.start_count) * 100 
        : 0,
    };
  });
  }

  async deductQuentityEmission(emission_id, quantity){
    const emission = await this.emissionRepository.findByPk(emission_id)
    if(emission.count > 0 && emission.count >= quantity){
      emission.count = emission.count - quantity
      return emission.save()
    }
    throw new Error('Недостаточно эмиссий: доступно ' + emission.count)
  }

  async getHolderSecurities(hid: number, query: any = {}) {
    const { start_date, end_date } = query
    const securityCondition: any = {
      holder_id: hid
    }
    if (start_date && end_date) {
      securityCondition.purchased_date = {
        [Op.between]: [`${start_date}`, `${end_date} 23:59:59.999`]
      }
    }
    const securities = await this.emissionRepository.findAll({
      attributes: [
        'id',
        'reg_number',
        'nominal',
        [sequelize.col('emission.name'), 'type'],
        [sequelize.col('securities.purchased_date'), 'purchased_date'],
        [sequelize.col('securities.quantity'), 'count'],
        [sequelize.col('securities->security_block.quantity'), 'blocked_count'],
        [sequelize.col('securities->security_pledgee.pledged_quantity'), 'pledge_count'],
      ],
      include: [
        { 
          model: Security,
          attributes: [],
          where: securityCondition,
          include: [
              {
                model: SecurityBlock
              },
              {
                model: SecurityPledge,
                as: 'security_pledgee',
              }
          ],
        },
        {
          model: EmissionType,
          attributes: []
        }
      ]
    })
    return securities
  }

  async cancellationEmissionCount(emission_id, count, document_id){
    try {
      const emission = await this.emissionRepository.findByPk(emission_id)
      if(emission.count > 0 && emission.count >= count){
        const updateEmissionCount = { count: emission.count - count }
        await this.emissionRepository.update(updateEmissionCount, {where: { id: emission_id }})
        const journal = {
          title: `Запись изменена в эмиссии (Аннулирование): ${emission.reg_number}`,
          old_value: {
            count: emission.count,
          },
          new_value: {
            count: updateEmissionCount.count
          },
          change_type: 'emission',
          emitent_id: [emission.emitent_id],
          emission_id: emission_id,
          document_id,
          org_emitent_id: emission.emitent_id
        }
        emission.count = emission.count - count
        return await this.journalsService.create(journal)
      }
      throw new Error('Недостаточно средств')
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
  }

// async getEmitentEmissions(hid: number, eid: number) {
//     const emissions = await this.emissionRepository.findAll({
//       where: {
//         emitent_id: eid
//       },
//       include: [
//         {
//           model: Security,
//           include: [
//             {
//               model: SecurityPledge,
//               as: 'security_pledged', // В залоге для этой бумаги
//               required: false,
//               where: {
//                 pledger_id: hid
//               }
//             },
//             {
//               model: SecurityPledge,
//               as: 'security_pledgee', // Принято в залог для этой бумаги
//               required: false,
//               where: {
//                 pledgee_id: hid
//               }
//             },
//             {
//               model: SecurityBlock
//             }
//           ]
//         },
//         {
//           model: EmissionType
//         }
//       ]
//     })
//     return emissions.map(emission => ({
//       id: emission.id,
//       reg_number: emission.reg_number,
//       // type: 'простые', // Или другой тип, если он у вас есть
//       type: emission?.emission?.name,
//       total_shares: emission.securities.reduce((sum, security) => sum + (security.holder_id === hid ? security.quantity || 0 : 0), 0),
//       nominal: emission.nominal || 0,
//       total_nominal_value:
//         (emission.nominal || 0) *
//         emission.securities.reduce((sum, security) => sum + (security.holder_id === hid ? security.quantity || 0 : 0), 0),
//       pledged_shares: emission.securities.reduce(
//         (sum, security) => sum + (security.security_pledged?.pledger_id === hid ? security.security_pledged?.pledged_quantity || 0 : 0),
//         0,
//       ),
//       accepted_in_pledge: emission.securities.reduce(
//         (sum, security) => sum + (security.security_pledgee?.pledgee_id === hid ? security.security_pledgee?.pledged_quantity || 0 : 0),
//         0,
//       ),
//       blocked_shares: emission.securities.reduce(
//         (sum, security) => sum + (security.holder_id === hid ? security.security_block?.quantity || 0 : 0),
//         0,
//       ),
//     })).filter(em => 
//       em.total_shares > 0 ||
//       em.pledged_shares > 0 ||
//       em.accepted_in_pledge > 0 ||
//       em.blocked_shares > 0
//     );
// }

async getEmitentEmissions(hid: number, eid: number) {
  const emissions = await this.emissionRepository.findAll({
    where: {
      emitent_id: eid,
    },
    include: [
      {
        model: Security,
        // where: Sequelize.literal(`(
        //   "securities"."holder_id" = ${hid} OR 
        //   EXISTS (
        //     SELECT 1 FROM "security_pledges" AS "sp" 
        //     WHERE "sp"."security_id" = "securities"."id" 
        //     AND ("sp"."pledger_id" = ${hid} OR "sp"."pledgee_id" = ${hid})
        //   )
        // )`),
        include: [
          {
            model: SecurityPledge,
            as: 'security_pledged',
            required: false,
            where: { pledger_id: hid },
          },
          {
            model: SecurityPledge,
            as: 'security_pledgee',
            required: false,
            where: { pledgee_id: hid },
          },
          {
            model: SecurityBlock,
            required: false,
          },
        ],
      },
      {
        model: EmissionType,
      },
    ],
  });

  return emissions
    .map((emission) => {
      // 1. Считаем акции, где пользователь является владельцем
      const holderShares = emission.securities
        .filter((s) => s.holder_id === hid)
        .reduce((sum, s) => sum + (s.quantity || 0), 0);

      // 2. Считаем акции в залоге (пользователь — залогодатель)
      // Проходим по всем бумагам и суммируем массивы security_pledged
      const pledgedShares = emission.securities.reduce((sum, s) => {
        const pledgeSum = s.security_pledged?.reduce(
          (pSum, p) => pSum + (p.pledged_quantity || 0),
          0
        ) || 0;
        return sum + pledgeSum;
      }, 0);

      // 3. Считаем акции, принятые в залог (пользователь — залогодержатель)
      const acceptedInPledge = emission.securities.reduce((sum, s) => {
        const pledgeeSum = s.security_pledgee?.reduce(
          (pSum, p) => pSum + (p.pledged_quantity || 0),
          0
        ) || 0;
        return sum + pledgeeSum;
      }, 0);

      // 4. Считаем заблокированные акции (только для тех, где пользователь — владелец)
      const blockedShares = emission.securities
        .filter((s) => s.holder_id === hid)
        .reduce((sum, s) => sum + (s.security_block?.quantity || 0), 0);

      return {
        id: emission.id,
        reg_number: emission.reg_number,
        type: emission?.emission?.name,
        total_shares: holderShares,
        nominal: emission.nominal || 0,
        total_nominal_value: (emission.nominal || 0) * holderShares,
        pledged_shares: pledgedShares,
        accepted_in_pledge: acceptedInPledge,
        blocked_shares: blockedShares,
      };
    })
    .filter(
      (em) =>
        em.total_shares > 0 ||
        em.pledged_shares > 0 ||
        em.accepted_in_pledge > 0 ||
        em.blocked_shares > 0
    );
}
}
