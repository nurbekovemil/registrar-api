import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Account } from './account.entity';
  
  interface AccountTypeCreateAttrs {
    name: string;
  }
  
  @Table({ tableName: 'account_types', createdAt: false, updatedAt: false })
  export class AccountType extends Model<AccountType, AccountTypeCreateAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @HasMany(() => Account)
    accounts: Account[];
  }