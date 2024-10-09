
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Holder } from 'src/holders/entities/holder.entity'
  
  interface DividendCreateAttrs {
    holder_id: number;
    emitent_id: number;
    share_count: number
    share_credited: number;
    share_debited: number;
    amount_pay: number;
    date_payment: string;
  }
  
  @Table({ tableName: 'dividends', updatedAt: false })
  export class Dividend extends Model<Dividend, DividendCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Holder)
    @Column({ type: DataType.INTEGER })
    holder_id: number;

    @ForeignKey(() => Emitent)
    @Column({ type: DataType.INTEGER })
    emitent_id: number;

    @Column({ type: DataType.INTEGER })
    share_count: number;

    @Column({ type: DataType.FLOAT })
    share_credited: number;

    @Column({ type: DataType.FLOAT })
    share_debited: number;

    @Column({ type: DataType.FLOAT })
    amount_pay: number;

    @Column({ type: DataType.DATE })
    date_payment: Date;

    @BelongsTo(() => Holder)
    holder: Holder;

    @BelongsTo(() => Emitent)
    emitent: Emitent;
  }

