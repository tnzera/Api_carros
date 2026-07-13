import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Cliente } from '../domain/cliente.entity';
import { IClienteRepository } from '../domain/cliente.repository';
import { CLIENTE_REPOSITORY } from './clientes.service';

/**
 * Se não existir nenhum admin, um padrão é criado
 * configuráveis via ADMIN_EMAIL / ADMIN_PASSWORD no .env).
 */
@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const jaExiste = await this.clienteRepository.existeAdmin();
    if (jaExiste) return;

    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@locadora.com');
    const senha = this.config.get<string>('ADMIN_PASSWORD', 'admin123');

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    await this.clienteRepository.criar(
      new Cliente(
        undefined,
        'Administrador',
        '00000000000',
        '00000000000',
        email,
        '00000000000',
        senhaCriptografada,
        'admin',
      ),
    );

    this.logger.warn(
      `Nenhum admin encontrado — admin padrão criado (${email}). Troque a senha após o primeiro login!`,
    );
  }
}
