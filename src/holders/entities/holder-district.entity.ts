import {
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Holder } from './holder.entity';

    
  @Table({ tableName: 'holder_districts', createdAt: false, updatedAt: false })
  export class HolderDistrict extends Model<HolderDistrict>{

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