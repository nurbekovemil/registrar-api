import {
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Holder } from './holder.entity';

  interface HolderStatusAttributes {
    name: string
  }
  @Table({ tableName: 'holder_status', createdAt: false, updatedAt: false })
  export class HolderStatus extends Model<HolderStatus, HolderStatusAttributes>{

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @HasMany(() => Holder)
    holders: Holder[]
  }