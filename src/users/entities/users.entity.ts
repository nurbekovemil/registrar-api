import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  interface UserCreateAttrs {
    login: string;
    password: string;
    companyId: number;
    firstName: string;
    lastName: string;
    inn: string;
  }
  
  @Table({ tableName: 'users' })
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
    firstName: string;
  
    @Column({ type: DataType.STRING })
    lastName: string;
  }