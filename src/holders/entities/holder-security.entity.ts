import {
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  interface HolderSecurityCreateAttrs {
    holder_id: number;
    security_id: number;
    quantity: number;
    purchased_date: string
  }
  
  @Table({ tableName: 'holder_securities' })
  export class HolderSecurity extends Model<HolderSecurity, HolderSecurityCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.INTEGER })
    holder_id: number;

    @Column({ type: DataType.INTEGER })
    security_id: number;

    @Column({ type: DataType.INTEGER })
    quantity: number;

    @Column({ type: DataType.STRING })
    purchased_date: string

  }