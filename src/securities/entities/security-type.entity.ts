import {
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  interface SecurityTypeCreateAttrs {
    name: string;
  }
  
  @Table({ tableName: 'security_types' })
  export class SecurityType extends Model<SecurityType, SecurityTypeCreateAttrs> {

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