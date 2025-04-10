import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { User } from 'src/users/entities/users.entity';
  
  interface CompanyCreateAttrs {
    name: string;
    gov_name: string;
    gov_number: string;
    legal_address: string;
    license: string;
    phone_number: string;
  }
  
  @Table({ tableName: 'companies', createdAt: false, updatedAt: false })
  export class Company extends Model<Company, CompanyCreateAttrs> {

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
    gov_name: string;
    
    @Column({ type: DataType.STRING })
    gov_number: string;

    @Column({ type: DataType.STRING })
    license: string;

    @Column({ type: DataType.STRING })
    legal_address: string;
        
    @Column({ type: DataType.STRING })
    phone_number: string;

    // @HasMany(() => User)
    // users: User[];
  }