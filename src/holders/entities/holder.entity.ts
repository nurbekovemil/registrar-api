import {
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  interface HolderCreateAttrs {
    name: string;
    actual_address: string;
    legal_address: string;
    passport_type: string;
    passport_number: string;
    passport_agency: string;
    inn: string;
  }
  
  @Table({ tableName: 'holders' })
  export class Holder extends Model<Holder, HolderCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.STRING })
    actual_address: string;

    @Column({ type: DataType.STRING })
    legal_address: string;

    @Column({ type: DataType.STRING })
    email: string;

    @Column({ type: DataType.STRING })
    phone_number: string;

    @Column({ type: DataType.STRING })
    passport_type: string;

    @Column({ type: DataType.STRING })
    passport_number: string;

    @Column({ type: DataType.STRING })
    passport_agency: string;

    @Column({ type: DataType.STRING })
    inn: string;
  }