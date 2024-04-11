import { Column, DataType, Table, Model } from "sequelize-typescript";

interface EmissionTypeCreateAttrs {
    name: string;
  }

  @Table({ tableName: 'emission_types' })
  export class EmissionType extends Model<EmissionType, EmissionTypeCreateAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

}