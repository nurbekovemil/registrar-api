import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Transaction } from './transaction.entity';
    
interface TransactionOperationtAttributes {
  name: string;
}
  @Table({ tableName: 'transaction_operations', createdAt: false, updatedAt: false })
  export class TransactionOperation extends Model<TransactionOperation, TransactionOperationtAttributes> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.INTEGER })
    group: number;

    @HasMany(() => Transaction)
    transactions: Transaction[]
  }