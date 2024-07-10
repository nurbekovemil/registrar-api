import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Security } from 'src/securities/entities/security.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
  
  interface HolderCreateAttrs {
    name: string;
    actual_address: string;
    legal_address: string;
    phone_number: string;
    passport_type: string;
    passport_number: string;
    passport_agency: string;
    inn: string;
  }
  
  @Table({ tableName: 'holders', createdAt: false, updatedAt: false })
  export class Holder extends Model<Holder, HolderCreateAttrs>{

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.STRING })
    actual_address: string;

    @Column({ type: DataType.STRING })
    legal_address: string;

    @Column({ type: DataType.STRING })
    email: string;

    @Column({ type: DataType.STRING })
    phone_number: string;

    @Column({ type: DataType.STRING })
    passport_type: string;

    @Column({ type: DataType.STRING })
    passport_number: string;

    @Column({ type: DataType.STRING })
    passport_agency: string;

    @Column({ type: DataType.STRING })
    inn: string;

    @Column({ type: DataType.STRING })
    district: string;


    @HasMany(() => Transaction, { as: 'holder_from_transactions', foreignKey: 'holder_from_id' })
    holder_from_transactions: Transaction[];
  
    @HasMany(() => Transaction, { as: 'holder_to_transactions', foreignKey: 'holder_to_id' })
    holder_to_transactions: Transaction[];


    @HasMany(() => Security)
    securities: Security[];

  }