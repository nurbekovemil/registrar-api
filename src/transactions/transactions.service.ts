import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionOperationTypes } from 'src/constants/transaction';
import { SecuritiesService } from 'src/securities/securities.service';
import { SecurityStatus, SecurityTypes, SecurityAttitudes } from 'src/constants/security';
import { TransactionOperation } from './entities/transaction-operation.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Security } from 'src/securities/entities/security.entity';
import { SecurityType } from 'src/securities/entities/security-type.entity';
import { Sequelize } from 'sequelize-typescript';
import { EmissionsService } from 'src/emissions/emissions.service';
import { col, fn, literal, Op } from 'sequelize';
import { SecurityBlock } from 'src/securities/entities/security-block.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private transactionRepository: typeof Transaction,
    @InjectModel(TransactionOperation) private transactionOperationRepository: typeof TransactionOperation,
    @InjectModel(Emitent) private emitentRepository: typeof Emitent,
    private securityService: SecuritiesService,
    @Inject(forwardRef(() => EmissionsService)) private emissionService: EmissionsService,
    private sequelize: Sequelize,
  ) {}
  // async createTransaction(createTransactionDto: CreateTransactionDto) {
  //   const t = await this.sequelize.transaction();
  //   try {
  //     const transaction = await this.transactionRepository.create(createTransactionDto, {transaction: t})
  //     let security
  //     switch (createTransactionDto.operation_id) {
  //       // Логика для начисления дивидендов
  //       case TransactionOperationTypes.DIVIDEND:        
  //         security = await this.createDividendSecurity(createTransactionDto, transaction.createdAt, t)
  //         break;
  //       // Логика для операции дарения
  //       case TransactionOperationTypes.DONATION:
  //         security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
  //         break;
  //       // Логика для операции блокировки
  //       case TransactionOperationTypes.LOCKING:
  //         security = await this.createLockingSecurity(createTransactionDto, transaction.createdAt, t)
  //         break;
  //       // Логика для операции разблокировки
  //       case TransactionOperationTypes.UNLOCKING:
  //         security = await this.createUnlockingSecurity(createTransactionDto, transaction.createdAt, t)
  //         break;
  //       // Логика для операции купли-продажи
  //         case TransactionOperationTypes.SALE:
  //         security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
  //         break;
  //       // Логика для операции передачи в номинальный держатель
  //       case TransactionOperationTypes.NOMINEE_TRANSFER:
  //         security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
  //         break;
  //       // Логика для операции наследства
  //       case TransactionOperationTypes.INHERITANCE:
  //           security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
  //       break;
  //       // Логика для операции арест
  //       case TransactionOperationTypes.ARREST:
  //         security = await this.createLockingSecurity(createTransactionDto, transaction.createdAt, t)
  //       break;
  //       // Логика для операции снятия ареста
  //       case TransactionOperationTypes.ARREST_REMOVAL:
  //         security = await this.createUnlockingSecurity(createTransactionDto, transaction.createdAt, t)
  //       break;
  //       // Логика для операции залог
  //       case TransactionOperationTypes.PLEDGE:
  //         security = await this.createPledgeSecurity(createTransactionDto, transaction.createdAt, t)
  //       break;
  //       // Логика для операции снять залог
  //       case TransactionOperationTypes.UNPLEDGE:
  //         security = await this.unpledgeSecurity(createTransactionDto, transaction.createdAt, t)
  //       break;
  //       // Логика для операции безвозмездно
  //       case TransactionOperationTypes.GRATUITOUS:
  //         security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
  //       break;
  //       // Логика для операции доверительного управления
  //       case TransactionOperationTypes.TRUST_MANAGEMENT:
  //         security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
  //       break;
  //       // Логика для операции возврата доверительного управления
  //       case TransactionOperationTypes.TRUST_MANAGEMENT_RETURN:
  //         security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
  //       break;
  //       default:
  //         break;
  //     }
  //     await t.commit();
  //     if(security && createTransactionDto.operation_id != 2){
  //       transaction.security_id = await security.id
  //     }
  //     await transaction.save()
  //     return transaction
  //   } catch (error) {
  //     t.rollback();
  //     throw new HttpException(
  //       error.message,
  //       HttpStatus.BAD_REQUEST,
  //     )
  //   }
  // }

  // Группируем типы операций, которые используют одну и ту же логику создания Security

async createTransaction(createTransactionDto: CreateTransactionDto) {
  const DonationLikeOperations = new Set([
    TransactionOperationTypes.DONATION,                   // Дарение
    TransactionOperationTypes.SALE,                       // Купля-продажа
    TransactionOperationTypes.NOMINEE_TRANSFER,           // Передача в номинальное держание
    TransactionOperationTypes.INHERITANCE,                // Наследство
    TransactionOperationTypes.GRATUITOUS_TRANSFER,        // Безвозмездная передача
    TransactionOperationTypes.TRUST_MANAGEMENT,           // Доверительное управление
    TransactionOperationTypes.TRUST_MANAGEMENT_RETURN,    // Возврат из доверительного управления
    TransactionOperationTypes.TRANSFER,                   // Передача

    TransactionOperationTypes.AUCTION_PURCHASE,           // Покупка на аукционе
    TransactionOperationTypes.MONEY_AUCTION,              // Денежный аукцион
    TransactionOperationTypes.CLOSE_MONEY_AUCTION,        // Закрытый денежный аукцион
    TransactionOperationTypes.TRANSIT,                    // Транзит
    TransactionOperationTypes.ACCOUNT_MERGE,              // Объединение лицевых счетов
    TransactionOperationTypes.REISSUE,                    // Переоформление
    TransactionOperationTypes.POWER_OF_ATTORNEY_SALE,     // Продажа по поручению
    TransactionOperationTypes.PROTOCOL_7_1,               // Протокол 7/1
    TransactionOperationTypes.SHARE_DISTRIBUTION,         // Распределение акций
    TransactionOperationTypes.MANAGER_TRANSFER,           // Передача менеджерской группе
    TransactionOperationTypes.DISTRIBUTION_5_PERCENT,     // Распределение 5%
    TransactionOperationTypes.FOR_MEETING,                // Передача на собрание
    TransactionOperationTypes.FROM_MEETING,               // Возврат с собрания
    TransactionOperationTypes.DISTRIBUTION_40_PERCENT,    // Распределение 40%
    TransactionOperationTypes.WITHDRAW_SHARES,            // Изъятие акций
    TransactionOperationTypes.EXCHANGE,                   // Мена (обмен)
    TransactionOperationTypes.FOUNDERS_ISSUE,             // Учредительский выпуск
    TransactionOperationTypes.PAY_DIVIDENDS_SECURITIES,   // Выплата дивидендов ценными бумагами
    TransactionOperationTypes.FUND_CONTRIBUTION,          // Вклад в уставной капитал
  ]);
  const LockingLikeOperations = new Set([
    TransactionOperationTypes.LOCKING,
    TransactionOperationTypes.ARREST,
  ]);

  const UnlockingLikeOperations = new Set([
    TransactionOperationTypes.UNBLOCKING,
    TransactionOperationTypes.ARREST_REMOVAL,
  ]);
  const t = await this.sequelize.transaction();
  let security; // Типизируйте эту переменную соответствующим образом, например: let security: Security | undefined;

  try {
    const transaction = await this.transactionRepository.create(createTransactionDto, { transaction: t });
    const { operation_id } = createTransactionDto;
    // Используем группы для вызова нужного метода
    if (DonationLikeOperations.has(operation_id)) {
      security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t);
    } else if (LockingLikeOperations.has(operation_id)) {
      security = await this.createLockingSecurity(createTransactionDto, transaction.createdAt, t);
    } else if (UnlockingLikeOperations.has(operation_id)) {
      security = await this.createUnlockingSecurity(createTransactionDto, transaction.createdAt, t);
    } else {
      switch (operation_id) {
        case TransactionOperationTypes.PRIMARY_INPUT:
          security = await this.createDividendSecurity(createTransactionDto, transaction.createdAt, t);
          break;
        case TransactionOperationTypes.DIVIDEND:
          security = await this.createDividendSecurity(createTransactionDto, transaction.createdAt, t);
          break;
        case TransactionOperationTypes.PLEDGE:
          security = await this.createPledgeSecurity(createTransactionDto, transaction.createdAt, t);
          break;
        case TransactionOperationTypes.UNPLEDGE:
          security = await this.unpledgeSecurity(createTransactionDto, transaction.createdAt, t);
          break;
        // case TransactionOperationTypes.EMISSION:

        //   break;
        default:
          // Возможно, стоит добавить логирование или ошибку для необработанных типов операций
          // throw new Error(`Неизвестный тип операции: ${operation_id}`);
      }
    }

    await t.commit();
    // Логика сохранения security_id может быть перенесена сюда или даже внутрь методов создания security,
    // если они возвращают объект с уже проставленным ID транзакции
    // Убедитесь, что '2' в вашем условии не является магическим числом
    if (security && operation_id != 22) { // 22 - Эмиссия
      transaction.security_id = security.id;
      // Используем `save` вне транзакции, т.к. она уже закоммичена
      await transaction.save();
    }
    return transaction;
  } catch (error) {
    await t.rollback(); // Всегда откатываем при ошибке
    // Убедитесь, что вы импортируете HttpException и HttpStatus из @nestjs/common
    throw new HttpException(
      error.message,
      HttpStatus.BAD_REQUEST,
    );
  }
}

  

  async getTransactionById(id: number){
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      include: [
        {
          model: TransactionOperation
        },
        {
          model: Emitent
        },
        {
          model: Emission,
          attributes: ['id', 'reg_number']
        },
        {
          model: Holder,
          as: 'holder_from',
          // attributes: ['id', 'name']
        },
        {
          model: Holder,
          as: 'holder_to',
          // attributes: ['id', 'name']
        },
        {
          model: Security,
          include: [
            {
              model: SecurityType,
            }
          ]
        }
      ]
    })
    return transaction
  }

  async getTransactionByEmitent(id: number, query?: any){
    const { start_date, end_date } = query
    const trnsactionCondition: any = {
      emitent_id: id,
      
    }
    if(start_date && end_date){
      // trnsactionCondition.contract_date = Sequelize.literal(`"contract_date" BETWEEN '${start_date}' AND '${end_date} 23:59:59.999'`)
      trnsactionCondition.contract_date = {
        [Op.between]: [`${start_date}`, `${end_date} 23:59:59.999`]
      }
    }
    const transactions = await this.transactionRepository.findAll({
      where: trnsactionCondition,
      attributes: ['id','contract_date','quantity'],
      include: [
        {
          model: TransactionOperation
        },
        {
          model: Emitent,
          attributes: ['id', 'full_name']
        },
        {
          model: Emission,
          attributes: ['id', 'reg_number']
        },
        {
          model: Holder,
          as: 'holder_from',
          attributes: ['id', 'name']
        },
        {
          model: Holder,
          as: 'holder_to',
          attributes: ['id', 'name']
        },
        {
          model: Security,
          include: [
            {
              model: SecurityType,
            }
          ]
        }
      ]
    })  
    return transactions
  }
  
  async getTransactions(query?: any){
    const { start_date, end_date } = query
    const trnsactionCondition: any = {}
    if(start_date && end_date){
      trnsactionCondition.contract_date = {
        [Op.between]: [`${start_date}`, `${end_date} 23:59:59.999`]
      } 
    }
    const transactions = await this.transactionRepository.findAll({
      attributes: ['id','contract_date','quantity','createdAt'],
      where: trnsactionCondition,
      include: [
        {
          model: TransactionOperation
        },
        {
          model: Emitent,
          attributes: ['id', 'full_name']

        },
        {
          model: Emission,
          attributes: ['id', 'reg_number']
        },
        {
          model: Holder,
          as: 'holder_from',
          attributes: ['id', 'name']
        },
        {
          model: Holder,
          as: 'holder_to',
          attributes: ['id', 'name']
        },
        {
          model: Security,
          attributes: ['id'],
          include: [
            {
              model: SecurityType,
            }
          ]
        }
      ]
    })
    return transactions
  }

  async getTransactionByHolderAccount(emitent_id: number, holder_id: number){
    const operations = await this.transactionRepository.findAll({
      attributes: [
        'id',
        'contract_date',
        'quantity',
        'emission_id',
      ],
      where: {
        emitent_id,
        [Op.or] : [
          {
            holder_from_id: holder_id,
          },
          {
            holder_to_id: holder_id
          }
        ]
      },
      include: [
        {
          model: TransactionOperation
        },
        {
          model: Security,
          attributes: ['id'],
          include: [
            {
              model: SecurityType,
            },
          ]
        }
      ]
    })
    return operations
  }

  async getTransactionOperations(){
    const operations = await this.transactionOperationRepository.findAll()
    return operations
  }

  private async createSecurity(createTransactionDto, transactionDate){
    try {
      const {emitent_id, emission_id, holder_to_id: holder_id, quantity} = createTransactionDto
      const securityCreate = { 
        type_id: SecurityTypes.BOND, 
        status_id: SecurityStatus.ACTIVE,
        attitude_id: SecurityAttitudes.SHAREHOLDER,
        holder_id, 
        emitent_id, 
        emission_id, 
        quantity,
        purchased_date: transactionDate
      }
      return await this.securityService.createSecurity(securityCreate)
    } catch (error) {
      throw new Error(error)
    }
  }

  private async createDividendSecurity(createTransactionDto, transactionDate, t){
    const { holder_to_id, emitent_id, emission_id} = createTransactionDto
    await this.emissionService.deductQuentityEmission(createTransactionDto.emission_id, createTransactionDto.quantity)
    const holder_to_security = await this.securityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    if(holder_to_security) {
      return await this.securityService.topUpQuentitySecurity(holder_to_security, createTransactionDto.quantity)
    }
    return this.createSecurity(createTransactionDto, transactionDate)
  }

  private async createDonationSecurity(createTransactionDto, transactionDate, t){
    const {holder_from_id, holder_to_id, emitent_id, emission_id} = createTransactionDto
    const holder_from_security = await this.securityService.getHolderSecurity({holder_id: holder_from_id, emitent_id, emission_id})
    if(holder_from_security && holder_from_security.quantity < createTransactionDto.quantity){
      throw new Error(`Недостаточно ценных бумаг: доступно ${holder_from_security.quantity}`);
    }
    const holder_from_security_block = await this.securityService.getSecurityBlock(holder_from_security.id)
    if(holder_from_security_block && (holder_from_security.quantity - holder_from_security_block.quantity) < createTransactionDto.quantity){
      throw new Error(`Заблокированы: ${holder_from_security_block.quantity} ценных бумаг из ${holder_from_security.quantity}`);
    }
    await this.securityService.deductQuentitySecurity(holder_from_security, createTransactionDto.quantity)
    const holder_to_security = await this.securityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    if(holder_to_security) {
      return await this.securityService.topUpQuentitySecurity(holder_to_security, createTransactionDto.quantity)
    }
    return await this.createSecurity(createTransactionDto, transactionDate)
}

  private async createLockingSecurity(createTransactionDto, transactionDate, t){
    const {holder_to_id, emitent_id, emission_id} = createTransactionDto
    const holder_to_security = await this.securityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    
    if(holder_to_security && holder_to_security.quantity < createTransactionDto.quantity){
      throw new Error(`Недостаточно ценных бумаг: доступно ${holder_to_security.quantity}`);
    }
    
    return await this.securityService.lockingSecurity({security_id: holder_to_security.id, quantity: createTransactionDto.quantity, block_date: transactionDate})
  }

  private async createPledgeSecurity(createTransactionDto, transactionDate, t){
    const {
      holder_from_id, 
      holder_to_id, 
      emitent_id, 
      emission_id
    } = createTransactionDto

    const holder_from_security = await this.securityService.getHolderSecurity({holder_id: holder_from_id, emitent_id, emission_id})
    if(holder_from_security && holder_from_security.quantity < createTransactionDto.quantity){
      throw new Error(`Недостаточно ценных бумаг: доступно ${holder_from_security.quantity}`);
    }
    const holder_from_security_block = await this.securityService.getSecurityBlock(holder_from_security.id)
    if(holder_from_security_block && (holder_from_security.quantity - holder_from_security_block.quantity) < createTransactionDto.quantity){
      throw new Error(`Заблокированы: ${holder_from_security_block.quantity} ценных бумаг из ${holder_from_security.quantity}`);
    }
    const holder_to_security = await this.securityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    // console.log('test ----- ', createTransactionDto)
    if(!holder_to_security) {
      // console.log('test non security----- ', createTransactionDto)
      const new_holder_to_security = await this.createSecurity(createTransactionDto, transactionDate)
      const pladge = await this.securityService.pledgeSecurity({security_id: new_holder_to_security.id, ...createTransactionDto})
      await this.securityService.deductQuentitySecurity(holder_from_security, createTransactionDto.quantity)
      return new_holder_to_security
    }
    // console.log('test has security ----- ', createTransactionDto)
    const pladge = await this.securityService.pledgeSecurity({security_id: holder_to_security.id, ...createTransactionDto})
    await this.securityService.deductQuentitySecurity(holder_from_security, createTransactionDto.quantity)
    return holder_to_security
  }

  private async unpledgeSecurity(createTransactionDto, transactionDate, t){
    const {holder_from_id, holder_to_id, emitent_id, emission_id} = createTransactionDto
    const holder_from_security = await this.securityService.getHolderSecurity({holder_id: holder_from_id, emitent_id, emission_id})
    if(!holder_from_security) {
      throw new Error(`Ценная бумага не найдено`);
    }
    const holder_to_security = await this.securityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    if(!holder_to_security) {
      throw new Error(`Ценная бумага не найдено`);
    }
    await this.securityService.unpledgeSecurity({security_id: holder_from_security.id, ...createTransactionDto})
    return await this.securityService.topUpQuentitySecurity(holder_to_security, createTransactionDto.quantity)
  }

  private async createUnlockingSecurity(createTransactionDto, transactionDate, t){
    const { holder_to_id, emitent_id, emission_id } = createTransactionDto
    const holder_to_security = await this.securityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    
    if(holder_to_security && holder_to_security.quantity < createTransactionDto.quantity){
      throw new Error(`Недостаточно ценных бумаг: доступно ${holder_to_security.quantity}`);
    }
    
    return await this.securityService.unlockingSecurity({security_id: holder_to_security.id, quantity: createTransactionDto.quantity, unblock_date: transactionDate})
  }
  // async getOperationStats() {
  //   // получаем список всех возможных операций
  //   const operations = await TransactionOperation.findAll({
  //     attributes: ['id', 'name'],
  //     raw: true,
  //   });

  //   // основной запрос с группировкой по эмитенту и эмиссии
  //   const transactions = await this.transactionRepository.findAll({
  //     attributes: [
  //       [col('emitent.full_name'), 'emitent_name'],
  //       [col('emission.reg_number'), 'emission_name'],
  //       [col('emission.id'), 'emission_id'],
  //       'operation_id',
  //       [fn('COUNT', col('Transaction.id')), 'count'],
  //       [fn('SUM', col('Transaction.quantity')), 'quantity'],
  //       [fn('SUM', col('Transaction.amount')), 'volume'],
  //     ],
  //     include: [
  //       { model: Emitent, attributes: [] },
  //       { model: Emission, attributes: [] },
  //     ],
  //     group: ['emitent.id', 'emission.id', 'operation_id'],
  //     raw: true,
  //   });

  //   // формируем итоговую структуру
  //   const grouped = Object.values(
  //     transactions.reduce((acc, row) => {
  //       const key = row['emission_id'];

  //       if (!acc[key]) {
  //         acc[key] = {
  //           emitent: row['emitent_name'],
  //           emission: row['emission_name'],
  //           emission_id: row['emission_id'],
  //           operations: operations.map(op => ({
  //             name: op.name,
  //             count: 0,
  //             quantity: 0,
  //             volume: 0,
  //           })),
  //         };
  //       }

  //       const opIndex = operations.findIndex(
  //         op => op.id === row['operation_id'],
  //       );

  //       if (opIndex >= 0) {
  //         acc[key].operations[opIndex] = {
  //           name: operations[opIndex].name,
  //           count: Number(row['count']),
  //           quantity: Number(row['quantity']),
  //           volume: Number(row['volume']),
  //         };
  //       }

  //       return acc;
  //     }, {}),
  //   );

  //   return grouped;
  // }
  // async getOperationStats(query?: { quarter?: number; year?: number }) {
  //   const { quarter, year } = query || {};
  //   // получаем список всех возможных операций
  //   const operations = await TransactionOperation.findAll({
  //     attributes: ['id', 'name'],
  //     raw: true,
  //   });

  //   // формируем фильтр по дате
  //   const where: any = {};
  //   // if (quarter && year) {
  //   //   const monthStart = (quarter - 1) * 3;      // 0 = январь
  //   //   const monthEnd = monthStart + 2;           // конец квартала

  //   //   const startDate = new Date(year, monthStart, 1);                  // первый день квартала
  //   //   const endDate = new Date(year, monthEnd + 1, 0, 23, 59, 59, 999); // последний день квартала

  //   //   where.contract_date = { [Op.between]: [startDate, endDate] };
  //   // }
  //   if (year) {
  //     if (!quarter || quarter == 0) {
  //       // 👉 весь год
  //       const startDate = new Date(year, 0, 1);                       // 1 января
  //       const endDate = new Date(year, 11, 31, 23, 59, 59, 999);      // 31 декабря

  //       where.contract_date = { [Op.between]: [startDate, endDate] };
  //     } else {
  //       // 👉 выбран квартал (1–4)
  //       const monthStart = (quarter - 1) * 3;
  //       const monthEnd = monthStart + 2;
  //       const startDate = new Date(year, monthStart, 1);
  //       const endDate = new Date(year, monthEnd + 1, 0, 23, 59, 59, 999);
  //       where.contract_date = { [Op.between]: [startDate, endDate] };
  //     }
  //   }
  //   // console.log(where, '------- ')

  //   // основной запрос с группировкой по эмитенту и эмиссии
  //   const transactions = await this.transactionRepository.findAll({
  //     where,
  //     attributes: [
  //       [col('Transaction.is_exchange'), 'is_exchange'],
  //       [col('emitent.full_name'), 'emitent_name'],
  //       [col('emission.reg_number'), 'emission_name'],
  //       [col('emission.id'), 'emission_id'],
  //       'operation_id',
  //       [fn('COUNT', col('Transaction.id')), 'count'],
  //       [fn('SUM', col('Transaction.quantity')), 'quantity'],
  //       [fn('SUM', col('Transaction.amount')), 'volume'],
  //     ],
  //     include: [
  //       { model: Emitent, attributes: [] },
  //       { model: Emission, attributes: [] },
  //     ],
  //     group: ['emitent.id', 'emission.id', 'operation_id', 'Transaction.is_exchange'],
  //     raw: true,
  //   });

  //   // формируем итоговую структуру
  //   // const grouped = Object.values(
  //   //   transactions.reduce((acc, row) => {
  //   //     const key = row['emission_id'];

  //   //     if (!acc[key]) {
  //   //       acc[key] = {
  //   //         emitent: row['emitent_name'],
  //   //         emission: row['emission_name'],
  //   //         emission_id: row['emission_id'],
  //   //         operations: operations.map(op => ({
  //   //           name: op.name,
  //   //           count: 0,
  //   //           quantity: 0,
  //   //           volume: 0,
  //   //         })),
  //   //       };
  //   //     }

  //   //     const opIndex = operations.findIndex(op => op.id === row['operation_id']);

  //   //     if (opIndex >= 0) {
  //   //       acc[key].operations[opIndex] = {
  //   //         name: operations[opIndex].name,
  //   //         count: Number(row['count']),
  //   //         quantity: Number(row['quantity']),
  //   //         volume: Number(row['volume']),
  //   //       };
  //   //     }

  //   //     return acc;
  //   //   }, {}),
  //   // );
  //   const grouped = Object.values(
  //   transactions.reduce((acc, row) => {
  //     const key = row['emission_id'];

  //     if (!acc[key]) {
  //       acc[key] = {
  //         emitent: row['emitent_name'],
  //         emission: row['emission_name'],
  //         emission_id: row['emission_id'],

  //         // один объект для биржевых операций
  //         exchange: {
  //           count: 0,
  //           quantity: 0,
  //           volume: 0,
  //         },

  //         // как раньше — полный список не биржевых
  //         operations: operations.map(op => ({
  //           name: op.name,
  //           count: 0,
  //           quantity: 0,
  //           volume: 0,
  //         })),
  //       };
  //     }

  //     const isExchange = row['is_exchange'];

  //     if (isExchange) {
  //       // 👉 суммируем все биржевые операции в один объект
  //       acc[key].exchange.count += Number(row['count']);
  //       acc[key].exchange.quantity += Number(row['quantity']);
  //       acc[key].exchange.volume += Number(row['volume']);
  //     } else {
  //       // 👉 не биржевая — как раньше
  //       const opIndex = operations.findIndex(op => op.id === row['operation_id']);
  //       if (opIndex >= 0) {
  //         acc[key].operations[opIndex] = {
  //           name: operations[opIndex].name,
  //           count: Number(row['count']),
  //           quantity: Number(row['quantity']),
  //           volume: Number(row['volume']),
  //         };
  //       }
  //     }

  //     return acc;
  //   }, {})
  // );

  //   return grouped;
  // }

  async getOperationStats(query?: { quarter?: number; year?: number }) {
  const { quarter, year } = query || {};

  /**
   * 1️⃣ Список не-биржевых операций, которые показываем отдельно
   */
  const NON_EXCHANGE_VISIBLE_OPERATION_IDS = [
    TransactionOperationTypes.SALE,
    TransactionOperationTypes.DONATION,
    TransactionOperationTypes.TRANSFER,
    TransactionOperationTypes.INHERITANCE,
    TransactionOperationTypes.EXCHANGE,
    TransactionOperationTypes.TRUST_MANAGEMENT,
    TransactionOperationTypes.PLEDGE,
  ];

  /**
   * 2️⃣ Получаем все возможные операции
   */
  const operations = await TransactionOperation.findAll({
    attributes: ['id', 'name'],
    raw: true,
  });

  /**
   * 3️⃣ Формируем фильтр по дате
   */
  const where: any = {};

  if (year) {
    if (!quarter || quarter === 0) {
      // весь год
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      where.contract_date = { [Op.between]: [startDate, endDate] };
    } else {
      // выбран квартал
      const monthStart = (quarter - 1) * 3;
      const monthEnd = monthStart + 2;
      const startDate = new Date(year, monthStart, 1);
      const endDate = new Date(year, monthEnd + 1, 0, 23, 59, 59, 999);
      where.contract_date = { [Op.between]: [startDate, endDate] };
    }
  }

  /**
   * 4️⃣ Основной запрос
   */
  const transactions = await this.transactionRepository.findAll({
    where,
    attributes: [
      [col('Transaction.is_exchange'), 'is_exchange'],
      [col('emitent.full_name'), 'emitent_name'],
      [col('emission.reg_number'), 'emission_name'],
      [col('emission.id'), 'emission_id'],
      'operation_id',
      [fn('COUNT', col('Transaction.id')), 'count'],
      [fn('SUM', col('Transaction.quantity')), 'quantity'],
      [fn('SUM', col('Transaction.amount')), 'volume'],
    ],
    include: [
      { model: Emitent, attributes: [] },
      { model: Emission, attributes: [] },
    ],
    group: [
      'emitent.id',
      'emission.id',
      'operation_id',
      'Transaction.is_exchange',
    ],
    raw: true,
  });

  /**
   * 5️⃣ Группировка результата
   */
  const grouped = Object.values(
    transactions.reduce((acc, row: any) => {
      const key = row['emission_id'];

      if (!acc[key]) {
        acc[key] = {
          emitent: row['emitent_name'],
          emission: row['emission_name'],
          emission_id: row['emission_id'],

          exchange: {
            count: 0,
            quantity: 0,
            volume: 0,
          },

          operations: operations
            .filter(op =>
              NON_EXCHANGE_VISIBLE_OPERATION_IDS.includes(op.id)
            )
            .map(op => ({
              id: op.id,
              name: op.name,
              count: 0,
              quantity: 0,
              volume: 0,
            })),

          others: {
            count: 0,
            quantity: 0,
            volume: 0,
          },
        };
      }

      const isExchange = row['is_exchange'];
      const count = Number(row['count']);
      const quantity = Number(row['quantity']);
      const volume = Number(row['volume']);

      if (isExchange) {
        // биржевые
        acc[key].exchange.count += count;
        acc[key].exchange.quantity += quantity;
        acc[key].exchange.volume += volume;
      } else {
        // не биржевые
        const operationId = row['operation_id'];

        if (NON_EXCHANGE_VISIBLE_OPERATION_IDS.includes(operationId)) {
          const opIndex = acc[key].operations.findIndex(
            op => op.id === operationId
          );

          if (opIndex >= 0) {
            acc[key].operations[opIndex].count += count;
            acc[key].operations[opIndex].quantity += quantity;
            acc[key].operations[opIndex].volume += volume;
          }
        } else {
          acc[key].others.count += count;
          acc[key].others.quantity += quantity;
          acc[key].others.volume += volume;
        }
      }

      return acc;
    }, {} as Record<number, any>)
  );

  return grouped;
}


}
