import {
  BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Company } from 'src/companies/entities/company.entity';
  
  interface UserCreateAttrs {
    login: string;
    password: string;
    first_name: string;
    last_name: string;
    // company_id: number;
  }
  
  @Table({ tableName: 'users', createdAt: false, updatedAt: false })
  export class User extends Model<User, UserCreateAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @Column({ type: DataType.STRING, unique: true })
    login: string;
  
    @Column({ type: DataType.STRING })
    password: string;
  
  
    @Column({ type: DataType.STRING })
    first_name: string;
  
    @Column({ type: DataType.STRING })
    last_name: string;

    // @ForeignKey(() => Company)
    // @Column({ type: DataType.INTEGER })
    // company_id: number;

    // @BelongsTo(() => Company)
    // company: Company;
  }