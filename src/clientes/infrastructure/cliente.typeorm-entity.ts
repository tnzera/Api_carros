import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class ClienteTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  cpf!: string;

  @Column({ unique: true })
  cnh!: string;

  @Column()
  email!: string;

  @Column()
  telefone!: string;

  @Column({ type: 'varchar', nullable: false }) // <-- Adicionar coluna física
  senha!: string;
}