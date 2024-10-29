import {
  BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Holder } from 'src/holders/entities/holder.entity';
import { Security } from 'src/securities/entities/security.entity';
  
  interface EmitentCreateAttrs {
    full_name: string;
    short_name: string;
    director_company: string;
    director_registrar: string;
    accountant: string;
    gov_name: string;
    gov_number: string;
    legal_address: string;
    postal_address: string;
    phone_number: string;
    email: string;
    bank_name: string;
    bank_account: string;
    id_number: string;
    capital: string;
    contract_date: string
  }
  
  @Table({ tableName: 'emitents', createdAt: false, updatedAt: false })
  export class Emitent extends Model<Emitent, EmitentCreateAttrs> {

    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    full_name: string;

    @Column({ type: DataType.STRING })
    short_name: string;

    @Column({ type: DataType.STRING })
    director_company: string;

    @Column({ type: DataType.STRING })
    director_registrar: string;

    @Column({ type: DataType.STRING })
    accountant:string;
    
    @Column({ type: DataType.STRING })
    gov_name: string;
    
    @Column({ type: DataType.STRING })
    gov_number: string;
    
    @Column({ type: DataType.STRING })
    legal_address: string;
    
    @Column({ type: DataType.STRING })
    postal_address: string;
    
    @Column({ type: DataType.STRING })
    phone_number: string;
    
    @Column({ type: DataType.STRING })
    email: string;
    
    @Column({ type: DataType.STRING })
    bank_name: string;
    
    @Column({ type: DataType.STRING })
    bank_account: string;
    
    @Column({ type: DataType.STRING })
    id_number: string;
    
    @Column({ type: DataType.STRING })
    capital: string;
    
    @Column({ type: DataType.STRING })
    contract_date: string;

    @HasMany(() => Emission)
    emissions: Emission[];

    @HasMany(() => Security)
    securities: Security[]
  }