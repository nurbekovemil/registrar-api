import { Column, DataType, Table, Model } from "sequelize-typescript";

interface EmissionCreateAttrs {
    reg_number: string;
    release_date: number;
    start_nominal: number;
    new_nominal: number;
    start_count: number;
    new_count: number;
    splitting: number;    
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

    @Column({ type: DataType.STRING })
    reg_number: number;

    @Column({ type: DataType.INTEGER })
    release_date: number;
    
    @Column({ type: DataType.INTEGER })
    type_id: number;

    @Column({ type: DataType.INTEGER })
    emitent_id: number;

    @Column({ type: DataType.DECIMAL(18, 10)  })
    start_nominal: number;

    @Column({ type: DataType.DECIMAL(18, 10)  })
    new_nominal: number;

    @Column({ type: DataType.INTEGER })
    start_count: number;

    @Column({ type: DataType.INTEGER })
    new_count: number;

    @Column({ type: DataType.DECIMAL(18, 10) })
    splitting: number;



}