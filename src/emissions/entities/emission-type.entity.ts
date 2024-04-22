import { Column, DataType, Table, Model, HasMany } from "sequelize-typescript";
import { Emission } from "./emission.entity";

  interface EmissionTypeCreateAttrs {
    name: string;
  }

  @Table({ tableName: 'emission_types', createdAt: false, updatedAt: false })
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

    @HasMany(() => Emission)
    emissions: Emission[];
}