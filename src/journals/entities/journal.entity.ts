import {
      Column,
      DataType,
      ForeignKey,
      Model,
      Table,
    } from 'sequelize-typescript';
import { Emitent } from 'src/emitents/entities/emitent.entity';

    
    interface JournalCreateAttrs {
      title: string;
      old_value: object;
      new_value: object;
      change_type: string;
      emitent_id: number;
    }
    
    @Table({ tableName: 'journals', updatedAt: false })
    export class Journal extends Model<Journal, JournalCreateAttrs>{
  
      @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      })
      id: number;

      @Column({ type: DataType.STRING })
      title: string;
    
      @Column({ type: DataType.JSON })
      old_value: object;

      @Column({ type: DataType.JSON })
      new_value: object;

      @Column({ type: DataType.STRING })
      change_type: string;

      @ForeignKey(() => Emitent)
      @Column({ type: DataType.INTEGER })
      emitent_id: number;


    }