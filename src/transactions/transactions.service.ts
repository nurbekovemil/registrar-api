import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionOperationTypes } from 'src/constants/transaction';
import { SecuritiesService } from 'src/securities/securities.service';
import { SecurityStatus, SecurityTypes, SecurityAttitudes } from 'src/constants/security';
import { TransactionOperation } from './entities/transaction-operation.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private transactionRepository: typeof Transaction,
    @InjectModel(TransactionOperation) private transactionOperationRepository: typeof TransactionOperation,
    private sercurityService: SecuritiesService,
  ) {}
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionRepository.create(createTransactionDto)
    switch (createTransactionDto.operation_id) {
      case TransactionOperationTypes.DIVIDEND:
        // Логика для начисления дивидендов        
        await this.createTransactionSecurity(createTransactionDto, transaction)
        break;
      case TransactionOperationTypes.DONATION:
        // Логика для операции дарения
        await this.createTransactionSecurity(createTransactionDto, transaction)
        break;
      default:
        // Логика по умолчанию или обработка неизвестной операции
        break;
    }
    return transaction
  }
  async getTransactionById(id: number){
    const transaction = await this.transactionRepository.findByPk(id)
    return transaction
  }
  async getTransactions(){
    const transactions = await this.transactionRepository.findAll()
    return transactions
  }

  async getTransactionOperations(){
    const operations = await this.transactionOperationRepository.findAll()
    return operations
  }

  private async createTransactionSecurity(createTransactionDto, transaction){
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
        purchased_date: transaction.createdAt
      }
      return await this.sercurityService.createSecurity(securityCreate)
    } catch (error) {
      
    }
  }
}
