import {
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  interface UserCreateAttrs {
    login: string;
    password: string;
    first_name: string;
    last_name: string;
    company_id: number;
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

    @Column({ type: DataType.INTEGER })
    company_id: number;
  }