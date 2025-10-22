import {
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
import { Holder } from './holder.entity';


interface HolderDistrictAttributes {
  // id?: number;
  name: string;
}

  @Table({ tableName: 'holder_districts', createdAt: false, updatedAt: false })
  export class HolderDistrict extends Model<HolderDistrict, HolderDistrictAttributes>{

// CREATE SEQUENCE IF NOT EXISTS holder_districts_id_seq;
// ALTER TABLE holder_districts
// ALTER COLUMN id SET DEFAULT nextval('holder_districts_id_seq');
// SELECT setval('holder_districts_id_seq', COALESCE((SELECT MAX(id) FROM holder_districts), 0));

// SELECT setval('holder_districts_id_seq', (SELECT MAX(id) FROM holder_districts));

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
    region: string;

    @HasMany(() => Holder)
    holders: Holder[]
  }