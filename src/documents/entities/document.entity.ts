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

  import { Emitent } from 'src/emitents/entities/emitent.entity';
    
    interface DocumentCreateAttrs {
      title: string;
      emitent_id: number;
    }
    
    @Table({ tableName: 'documents', updatedAt: false })
    export class Document extends Model<Document, DocumentCreateAttrs>{
  
      @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      })
      id: number;
  
      @Column({ type: DataType.STRING })
      title: string;
  
      @ForeignKey(() => Emitent)
      @Column({ type: DataType.INTEGER })
      emitent_id: number;  
  
      @Column({ type: DataType.STRING })
      provider_name: string;
  
      @Column({ type: DataType.STRING })
      signer_name: string;
  
      @Column({ type: DataType.STRING })
      receipt_date: string;
  
      @Column({ type: DataType.STRING })
      sending_date: string;
  
      @Column({ type: DataType.STRING })
      sending_address: string;
  
      @Column({ type: DataType.INTEGER })
      reponse_number: number;
      
      @Column({ type: DataType.JSON })
      data: object;
    }