import {
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
    
  @Table({ tableName: 'security_status', createdAt: false, updatedAt: false })
  export class SecurityStatus extends Model<SecurityStatus> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;
  }