import {
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  interface SecurityCreateAttrs {
    name: string;
    type_id: number;
    emitent_id: number;
  }
  
  @Table({ tableName: 'securities' })
  export class Security extends Model<Security, SecurityCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.INTEGER })
    type_id: number;
    
    @Column({ type: DataType.INTEGER })
    emitent_id: number;
  }