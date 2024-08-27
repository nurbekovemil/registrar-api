import {
  BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Security } from './security.entity';
  
interface SecurityBlockCreateAttrs {
  security_id: number;
  quantity: number;
  block_date?: Date
  unblock_date?: Date}
  @Table({ tableName: 'security_blocks' })
  export class SecurityBlock extends Model<SecurityBlock, SecurityBlockCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Security)
    @Column({ type: DataType.INTEGER })
    security_id: number;
    
    @Column({ type: DataType.INTEGER })
    quantity: number;

    @Column({ type: DataType.DATE })
    block_date: Date

    @Column({ type: DataType.DATE })
    unblock_date: Date

    @BelongsTo(() => Security)
    security: Security
  }