import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Security } from './security.entity';
  
  @Table({ tableName: 'security_types', createdAt: false, updatedAt: false  })
  export class SecurityType extends Model<SecurityType> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @HasMany(() => Security)
    securities: Security[]
  }