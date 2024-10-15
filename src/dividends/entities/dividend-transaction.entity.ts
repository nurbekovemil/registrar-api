
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { HolderType } from 'src/holders/entities/holder-type.entity';
import { Holder } from 'src/holders/entities/holder.entity'
import { Dividend } from './dividend.entity';
  
  interface DividendTransactionCreateAttrs {
    dividend_id: number;
    holder_id: number;
    share_count: number;
    percent: number;
    share_credited: number;
    share_debited: number;
    amount_pay: number;
  }
  
  @Table({ tableName: 'dividend_transactions', updatedAt: false })
  export class DividendTransaction extends Model<DividendTransaction, DividendTransactionCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Dividend)
    @Column({ type: DataType.INTEGER })
    dividend_id: number;

    @ForeignKey(() => Holder)
    @Column({ type: DataType.INTEGER })
    holder_id: number;

    @Column({ type: DataType.INTEGER })
    share_count: number;

    @Column({ type: DataType.FLOAT })
    percent: number;

    @Column({ type: DataType.FLOAT })
    share_credited: number;

    @Column({ type: DataType.FLOAT })
    share_debited: number;

    @Column({ type: DataType.FLOAT })
    amount_pay: number;

    @BelongsTo(() => Holder)
    holder: Holder;   
    
    @BelongsTo(() => Dividend)
    dividend: Dividend;
  }

