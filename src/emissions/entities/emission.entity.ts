import { Column, DataType, Table, Model } from "sequelize-typescript";

interface EmissionCreateAttrs {
    type_id: number;
    emitent_id: number;
    start_nominal: number;
    new_nominal: number;
    start_count: number;
    new_count: number;
    splitting: number;
    reg_number: number;
  }

  @Table({ tableName: 'emissions' })
  export class Emission extends Model<Emission, EmissionCreateAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.INTEGER })
    type_id: number;

    @Column({ type: DataType.INTEGER })
    emitent_id: number;

    @Column({ type: DataType.INTEGER })
    start_nominal: number;

    @Column({ type: DataType.INTEGER })
    new_nominal: number;

    @Column({ type: DataType.INTEGER })
    start_count: number;

    @Column({ type: DataType.INTEGER })
    new_count: number;

    @Column({ type: DataType.INTEGER })
    splitting: number;

    @Column({ type: DataType.INTEGER })
    reg_number: number;

}