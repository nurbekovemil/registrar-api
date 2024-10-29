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
import { HolderType } from './holder-type.entity';
import { HolderDistrict } from './holder-district.entity';
import { Holder } from './holder.entity';
import { Emitent } from 'src/emitents/entities/emitent.entity';
  
  interface HolderDocumentCreateAttrs {
    title: string;
    emitent_id: number;
    holder_id: number;
    provider_name: string;
    signer_name: string;
    receipt_date: Date;
    sending_date: Date;
    sending_address: string;
    reponse_number: number;
    data: object;
  }
  
  @Table({ tableName: 'holder_documents', updatedAt: false })
  export class HolderDocument extends Model<HolderDocument, HolderDocumentCreateAttrs>{

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

    @ForeignKey(() => Holder)
    @Column({ type: DataType.INTEGER })
    holder_id: number;


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