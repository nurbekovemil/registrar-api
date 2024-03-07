import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';

  
  interface ClientCreateAttrs {
    type_id: number;
  }
  
  @Table({ tableName: 'accounts' })
  export class Client extends Model<Client, ClientCreateAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
    
  }