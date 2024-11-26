import {
      Column,
      DataType,
      Model,
      Table,
    } from 'sequelize-typescript';

    
    interface JournalCreateAttrs {
      title: string;
      old_value: object;
      new_value: object;
      change_type: string;
      changed_by: number;
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

      @Column({ type: DataType.INTEGER })
      changed_by: number;
    }