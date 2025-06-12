import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
  } from 'sequelize-typescript';
  import { Security } from './security.entity';
  import { Holder } from 'src/holders/entities/holder.entity'; // Владелец
  
  interface CreatePledgeAttrs {
    security_id: number;
    pledged_quantity: number;
    pledger_id: number;
    pledgee_id: number;
  }

  @Table({ tableName: 'security_pledges', timestamps: false })
  export class SecurityPledge extends Model<SecurityPledge, CreatePledgeAttrs> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    })
    id: number;
  
    @ForeignKey(() => Security)
    @Column({ type: DataType.INTEGER })
    security_id: number;
  
    @Column({ type: DataType.INTEGER })
    pledged_quantity: number; // Количество заложенных бумаг
  
    @ForeignKey(() => Holder)
    @Column({ type: DataType.INTEGER })
    pledger_id: number; // Залогодатель (кто дает в залог)
  
    @ForeignKey(() => Holder)
    @Column({ type: DataType.INTEGER })
    pledgee_id: number; // Залогополучатель (кто получает залог)
  
    @BelongsTo(() => Holder, { as: 'pledger', foreignKey: 'pledger_id' })
    pledger: Holder;
  
    @BelongsTo(() => Holder, { as: 'pledgee', foreignKey: 'pledgee_id' })
    pledgee: Holder;

    @BelongsTo(() => Security)
    security: Security
  }
  