import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carros')
export class CarroTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  marca!: string;

  @Column()
  modelo!: string;

  @Column({ unique: true })
  placa!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  diaria!: number;
}
