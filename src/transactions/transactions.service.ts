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
    private sercurityService: SecuritiesService,
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
        case TransactionOperationTypes.SALE:
          security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
          break;
        case TransactionOperationTypes.NOMINEE_TRANSFER:
          security = await this.createDonationSecurity(createTransactionDto, transaction.createdAt, t)
          break;
        case TransactionOperationTypes.INHERITANCE:
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

  async getTransactionByEmitent(id: number){
    const transactions = await this.transactionRepository.findAll({
      where: {
        emitent_id: id
      },
      attributes: ['id','contract_date'],
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
  
  async getTransactions(){
    const transactions = await this.transactionRepository.findAll({
      attributes: ['id','contract_date'],
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
      return await this.sercurityService.createSecurity(securityCreate)
    } catch (error) {
      throw new Error(error)
    }
  }

  private async createDividendSecurity(createTransactionDto, transactionDate, t){
    const { holder_to_id, emitent_id, emission_id} = createTransactionDto
    await this.emissionService.deductQuentityEmission(createTransactionDto.emission_id, createTransactionDto.quantity)
    const holder_to_security = await this.sercurityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    if(holder_to_security) {
      return await this.sercurityService.topUpQuentitySecurity(holder_to_security, createTransactionDto.quantity)
    }
    return this.createSecurity(createTransactionDto, transactionDate)
  }

  private async createDonationSecurity(createTransactionDto, transactionDate, t){
    const {holder_from_id, holder_to_id, emitent_id, emission_id} = createTransactionDto
    const holder_from_security = await this.sercurityService.getHolderSecurity({holder_id: holder_from_id, emitent_id, emission_id})
    if(holder_from_security && holder_from_security.quantity < createTransactionDto.quantity){
      throw new Error(`Недостаточно ценных бумаг: доступно ${holder_from_security.quantity}`);
    }
    const holder_from_security_block = await this.sercurityService.getSecurityBlock(holder_from_security.id)
    if(holder_from_security_block && (holder_from_security.quantity - holder_from_security_block.quantity) < createTransactionDto.quantity){
      throw new Error(`Заблокированы: ${holder_from_security_block.quantity} ценных бумаг из ${holder_from_security.quantity}`);
    }
    await this.sercurityService.deductQuentitySecurity(holder_from_security, createTransactionDto.quantity)
    const holder_to_security = await this.sercurityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    if(holder_to_security) {
      return await this.sercurityService.topUpQuentitySecurity(holder_to_security, createTransactionDto.quantity)
    }
    return await this.createSecurity(createTransactionDto, transactionDate)
}

  private async createLockingSecurity(createTransactionDto, transactionDate, t){
    const {holder_to_id, emitent_id, emission_id} = createTransactionDto
    const holder_to_security = await this.sercurityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    
    if(holder_to_security && holder_to_security.quantity < createTransactionDto.quantity){
      throw new Error(`Недостаточно ценных бумаг: доступно ${holder_to_security.quantity}`);
    }
    
    return await this.sercurityService.lockingSecurity({security_id: holder_to_security.id, quantity: createTransactionDto.quantity, block_date: transactionDate})
  }

  private async createUnlockingSecurity(createTransactionDto, transactionDate, t){
    const { holder_to_id, emitent_id, emission_id } = createTransactionDto
    const holder_to_security = await this.sercurityService.getHolderSecurity({holder_id: holder_to_id, emitent_id, emission_id})
    
    if(holder_to_security && holder_to_security.quantity < createTransactionDto.quantity){
      throw new Error(`Недостаточно ценных бумаг: доступно ${holder_to_security.quantity}`);
    }
    
    return await this.sercurityService.unlockingSecurity({security_id: holder_to_security.id, quantity: createTransactionDto.quantity, unblock_date: transactionDate})
  }
}
