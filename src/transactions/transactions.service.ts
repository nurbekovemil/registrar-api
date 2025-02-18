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
import { literal, Op } from 'sequelize';
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
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const t = await this.sequelize.transaction();
    try {
      const transaction = await this.transactionRepository.create(createTransactionDto, {transaction: t})
      let security
      switch (createTransactionDto.operation_id) {
        // Логика для начисления дивидендов
        case TransactionOperationTypes.DIVIDEND:        
          security = await this.createDividendSecurity(createTransactionDto, transaction.createdAt, t)
          break;
        // Логика для операции дарения
        case TransactionOperationTypes.DONATION:
          security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
          break;
        // Логика для операции блокировки
        case TransactionOperationTypes.LOCKING:
          security = await this.createLockingSecurity(createTransactionDto, transaction.createdAt, t)
          break;
        // Логика для операции разблокировки
        case TransactionOperationTypes.UNLOCKING:
          security = await this.createUnlockingSecurity(createTransactionDto, transaction.createdAt, t)
          break;
        // Логика для операции купли-продажи
          case TransactionOperationTypes.SALE:
          security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
          break;
        // Логика для операции передачи в номинальный держатель
        case TransactionOperationTypes.NOMINEE_TRANSFER:
          security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
          break;
        // Логика для операции наследства
        case TransactionOperationTypes.INHERITANCE:
            security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
        break;
        // Логика для операции арест
        case TransactionOperationTypes.ARREST:
          security = await this.createLockingSecurity(createTransactionDto, transaction.createdAt, t)
        break;
        // Логика для операции снятия ареста
        case TransactionOperationTypes.ARREST_REMOVAL:
          security = await this.createUnlockingSecurity(createTransactionDto, transaction.createdAt, t)
        break;
        // Логика для операции залог
        case TransactionOperationTypes.PLEDGE:
          security = await this.createPledgeSecurity(createTransactionDto, transaction.createdAt, t)
        break;
        // Логика для операции снять залог
        case TransactionOperationTypes.UNPLEDGE:
          security = await this.unpledgeSecurity(createTransactionDto, transaction.createdAt, t)
        break;
        // Логика для операции безвозмездно
        case TransactionOperationTypes.GRATUITOUS:
          security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
        break;
        // Логика для операции доверительного управления
        case TransactionOperationTypes.TRUST_MANAGEMENT:
          security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
        break;
        // Логика для операции возврата доверительного управления
        case TransactionOperationTypes.TRUST_MANAGEMENT_RETURN:
          security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
        break;
        default:
          break;
      }
      await t.commit();
      if(security && createTransactionDto.operation_id != 2){
        transaction.security_id = await security.id
      }
      await transaction.save()
      return transaction
    } catch (error) {
      t.rollback();
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      )
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
    console.log('test ----- ', createTransactionDto)
    if(!holder_to_security) {
      const holder_to_security = await this.createSecurity(createTransactionDto, transactionDate)
      return await this.securityService.pledgeSecurity({security_id: holder_to_security.id, ...createTransactionDto})
    }
    return await this.securityService.pledgeSecurity({security_id: holder_to_security.id, ...createTransactionDto})
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
}
