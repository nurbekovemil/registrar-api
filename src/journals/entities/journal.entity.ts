import {
      Column,
      DataType,
      ForeignKey,
      Model,
      Table,
    } from 'sequelize-typescript';
import { Document } from 'src/documents/entities/document.entity';
import { Emission } from 'src/emissions/entities/emission.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
import { Holder } from 'src/holders/entities/holder.entity';

    
    interface JournalCreateAttrs {
      title: string;
      old_value: object;
      new_value: object;
      change_type: string;
      emitent_id: number[];
      emission_id?: number;
      document_id: number;
      holder_id?: number;
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
      @Column({ type: DataType.ARRAY(DataType.INTEGER) })
      emitent_id: number[];

      @ForeignKey(() => Emission)
      @Column({ type: DataType.INTEGER })
      emission_id: number;

      @ForeignKey(() => Document)
      @Column({ type: DataType.INTEGER })
      document_id: number;

      @ForeignKey(() => Holder)
      @Column({ type: DataType.INTEGER })
      holder_id: number;
    }