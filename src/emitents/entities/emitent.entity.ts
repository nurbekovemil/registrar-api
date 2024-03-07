import {
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  interface EmitentCreateAttrs {
    name: string;
    gov_reg: string;
    authority_reg: string;
    legal_address: string;
    postal_address: string;
    phone: number;
    email: string;
    bank: string;
    bank_account: number;
    indentity_number: string;
    capital: string;
    contract_date: string
  }
  
  @Table({ tableName: 'emitents' })
  export class Emitent extends Model<Emitent, EmitentCreateAttrs> {
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
    gov_reg: string;
    
    @Column({ type: DataType.STRING })
    authority_reg: string;
    
    @Column({ type: DataType.STRING })
    legal_address: string;
    
    @Column({ type: DataType.STRING })
    postal_address: string;
    
    @Column({ type: DataType.INTEGER })
    phone: number;
    
    @Column({ type: DataType.STRING })
    email: string;
    
    @Column({ type: DataType.STRING })
    bank: string;
    
    @Column({ type: DataType.INTEGER })
    bank_account: number;
    
    @Column({ type: DataType.STRING })
    indentity_number: string;
    
    @Column({ type: DataType.STRING })
    capital: string;
    
    @Column({ type: DataType.STRING })
    contract_date: string;
  }