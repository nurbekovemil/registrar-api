import {
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Holder } from './holder.entity';

  interface HolderTypeAttributes {
    name: string
  }
  @Table({ tableName: 'holder_types', createdAt: false, updatedAt: false })
  export class HolderType extends Model<HolderType, HolderTypeAttributes>{

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