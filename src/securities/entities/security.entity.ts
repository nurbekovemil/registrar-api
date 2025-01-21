import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { SecurityType } from './security-type.entity';
import { SecurityAttitude } from './security-attitude.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { SecurityStatus } from './security-status.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { SecurityBlock } from './security-block.entity';
import { SecurityPledge } from './security-pledge.entity';

interface SecurityCreateAttrs {
  type_id: number;
  status_id: number;
  attitude_id: number;
  holder_id: number;
  emitent_id: number;
  emission_id: number;
  quantity: number;
  purchased_date: string
}

@Table({ tableName: 'securities', createdAt: false, updatedAt: false })
export class Security extends Model<Security, SecurityCreateAttrs> {

  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => SecurityType)
  @Column({ type: DataType.INTEGER })
  type_id: number;

  @ForeignKey(() => SecurityStatus)
  @Column({ type: DataType.INTEGER })
  status_id: number;

  @ForeignKey(() => SecurityAttitude)
  @Column({ type: DataType.INTEGER })
  attitude_id: number;

  @ForeignKey(() => Holder)
  @Column({ type: DataType.INTEGER })
  holder_id: number;
  
  @ForeignKey(() => Emitent)
  @Column({ type: DataType.INTEGER })
  emitent_id: number;
  
  @ForeignKey(() => Emission)
  @Column({ type: DataType.INTEGER })
  emission_id: number;

  @Column({ type: DataType.INTEGER })
  quantity: number;

  @Column({ type: DataType.DATE })
  purchased_date: Date

  @BelongsTo(() => Emission)
  emission: Emission;

  @BelongsTo(() => SecurityType)
  security_type: SecurityType;

  @BelongsTo(() => SecurityAttitude)
  security_attitude: SecurityAttitude;

  @BelongsTo(() => Holder)
  holder: Holder;

  @BelongsTo(() => Emitent)
  emitent: Emitent;

  @HasMany(() => Transaction)
  transaction: Transaction[]

  @HasOne(() => SecurityBlock)
  security_block: SecurityBlock

  @HasOne(() => SecurityPledge)
  security_pledge: SecurityPledge

}