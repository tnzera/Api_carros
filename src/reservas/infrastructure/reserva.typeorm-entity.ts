import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { CarroTypeOrmEntity } from '../../carros/infrastructure/carro.typeorm-entity';
import { ClienteTypeOrmEntity } from '../../clientes/infrastructure/cliente.typeorm-entity';

@Entity('reservas')
export class ReservaTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CarroTypeOrmEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carro_id' })
  carro!: CarroTypeOrmEntity;

  @ManyToOne(() => ClienteTypeOrmEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cliente_id' })
  cliente!: ClienteTypeOrmEntity;

  @Column({ name: 'data_inicio', type: 'timestamp' })
  dataInicio!: Date;

  @Column({ name: 'data_fim', type: 'timestamp' })
  dataFim!: Date;
}