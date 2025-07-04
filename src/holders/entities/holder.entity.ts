import {
  BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Security } from 'src/securities/entities/security.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { HolderType } from './holder-type.entity';
import { HolderDistrict } from './holder-district.entity';
import { Document } from 'src/documents/entities/document.entity';
import { HolderStatus } from './holder-status.entity';
import { SecurityPledge } from 'src/securities/entities/security-pledge.entity';
  
  interface HolderCreateAttrs {
    name: string;
    actual_address: string;
    // legal_address: string;
    // phone_number: string;
    // passport_type: string;
    // passport_number: string;
    // passport_agency: string;
    // inn: string;
    district_id: number;
    holder_type: number;
    // holder_status: number;
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
    
    @ForeignKey(() => HolderStatus)
    @Column({ type: DataType.INTEGER })
    holder_status: number;

    @ForeignKey(() => HolderType)
    @Column({ type: DataType.INTEGER })
    holder_type: number;

    @ForeignKey(() => HolderDistrict)
    @Column({ type: DataType.INTEGER })
    district_id: number;

    @ForeignKey(() => Document)
    @Column({ type: DataType.INTEGER, allowNull: true })
    document_id: number | null;

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

    @HasMany(() => Transaction, { as: 'holder_from_transactions', foreignKey: 'holder_from_id' })
    holder_from_transactions: Transaction[];
  
    @HasMany(() => Transaction, { as: 'holder_to_transactions', foreignKey: 'holder_to_id' })
    holder_to_transactions: Transaction[];

    @HasMany(() => Security)
    securities: Security[];

    @BelongsTo(() => HolderType)
    type: HolderType;

    @BelongsTo(() => HolderDistrict)
    district: HolderDistrict;

    @HasMany(() => SecurityPledge, { as: 'pledges_given', foreignKey: 'pledger_id' })
    pledges_given: SecurityPledge[];

    @HasMany(() => SecurityPledge, { as: 'pledges_received', foreignKey: 'pledgee_id' })
    pledges_received: SecurityPledge[];
  }