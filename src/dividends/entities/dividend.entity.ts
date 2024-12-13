
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { HolderType } from 'src/holders/entities/holder-type.entity';
import { Holder } from 'src/holders/entities/holder.entity'
import { DividendTransaction } from './dividend-transaction.entity';
  
  interface DividendCreateAttrs {
    title: string;
    emitent_id: number;
    type: number;
    date_close_reestr: string;
    month_year: string;
    share_price: number;
    percent: number;
    amount_share: number
    amount_share_credited: number;
    amount_share_debited: number;
    amount_pay: number;
    district_id: number
  }
  
  @Table({ tableName: 'dividends', createdAt: false, updatedAt: false })
  export class Dividend extends Model<Dividend, DividendCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    title: string;
    
    @ForeignKey(() => Emitent)
    @Column({ type: DataType.INTEGER })
    emitent_id: number;

    @ForeignKey(() => HolderType)
    @Column({ type: DataType.INTEGER })
    type: number;

    @Column({ type: DataType.INTEGER })
    district_id: number;

    @Column({ type: DataType.DATE })
    date_close_reestr: Date;

    @Column({ type: DataType.STRING })
    month_year: string;

    @Column({ type: DataType.FLOAT })
    share_price: number;

    @Column({ type: DataType.FLOAT })
    percent: number;

    @Column({ type: DataType.FLOAT })
    amount_share: number;

    @Column({ type: DataType.FLOAT })
    amount_share_credited: number;

    @Column({ type: DataType.FLOAT })
    amount_share_debited: number;

    @Column({ type: DataType.FLOAT })
    amount_pay: number;

    @BelongsTo(() => HolderType)
    dividend_type: HolderType;

    @BelongsTo(() => Emitent)
    emitent: Emitent;

    @HasMany(() => DividendTransaction)
    dividend_transactions: DividendTransaction[]

  }

