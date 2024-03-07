import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
import { AccountType } from './account-types.entity';
  
  interface AccountCreateAttrs {
    type_id: number;
  }
  
  @Table({ tableName: 'accounts' })
  export class Account extends Model<Account, AccountCreateAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @ForeignKey(() => AccountType)
    @Column({ type: DataType.INTEGER })
    type_id: number;

    @BelongsTo(() => AccountType)
    account_type: AccountType;
  }