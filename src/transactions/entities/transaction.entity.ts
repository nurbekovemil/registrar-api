import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
import { TransactionOperation } from './transaction-operation.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Security } from 'src/securities/entities/security.entity';
import { Document } from 'src/documents/entities/document.entity';
  
  interface TransactionCreateAttrs {
    is_exchange: boolean;
    operation_id: number;
    emission_id: number;
    holder_from_id?: number;
    holder_to_id: number;
    security_id?: number;
    is_family: boolean;
    quantity: number;
    amount: number;
    contract_date: string;
  }
  
  @Table({ tableName: 'transactions', updatedAt: false })
  export class Transaction extends Model<Transaction, TransactionCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.BOOLEAN })
    is_exchange: boolean;

    @ForeignKey(() => TransactionOperation)
    @Column({ type: DataType.INTEGER })
    operation_id: number;

    @ForeignKey(() => Emitent)
    @Column({ type: DataType.INTEGER })
    emitent_id: number;
    
    @ForeignKey(() => Emission)
    @Column({ type: DataType.INTEGER })
    emission_id: number;
    
    @ForeignKey(() => Holder)
    @Column({ type: DataType.INTEGER })
    holder_from_id: number;
    
    @ForeignKey(() => Holder)
    @Column({ type: DataType.INTEGER })
    holder_to_id: number;

    @ForeignKey(() => Security)
    @Column({ type: DataType.INTEGER })
    security_id: number;

    @ForeignKey(() => Document)
    @Column({ type: DataType.INTEGER, allowNull: true })
    document_id: number | null;
  
    @Column({ type: DataType.BOOLEAN })
    is_family: boolean;
    
    @Column({ type: DataType.INTEGER })
    quantity: number;

    @Column({ type: DataType.FLOAT })
    amount: number;

    @Column({ type: DataType.DATE })
    contract_date: Date;


    @BelongsTo(() => TransactionOperation)
    operation: TransactionOperation;

    @BelongsTo(() => Emitent)
    emitent: Emitent;

    @BelongsTo(() => Emission)
    emission: Emission;

    @BelongsTo(() => Holder, { as: 'holder_from', foreignKey: 'holder_from_id' })
    holder_from: Holder;
  
    @BelongsTo(() => Holder, { as: 'holder_to', foreignKey: 'holder_to_id' })
    holder_to: Holder;

    @BelongsTo(() => Security)
    security: Security;
  }