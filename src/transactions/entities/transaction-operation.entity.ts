import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Transaction } from './transaction.entity';
    
  @Table({ tableName: 'transaction_operations', createdAt: false, updatedAt: false })
  export class TransactionOperation extends Model<TransactionOperation> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @HasMany(() => Transaction)
    transactions: Transaction[]
  }