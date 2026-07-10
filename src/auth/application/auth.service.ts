import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IClienteRepository } from '../../clientes/domain/cliente.repository';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CLIENTE_REPOSITORY } from '../../clientes/application/clientes.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // Busca o cliente
    const cliente = await this.clienteRepository.buscarPorEmail(dto.email);

    // cliente não existir
    if (!cliente) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Compara a senha 
    const senhaValida = await bcrypt.compare(dto.senha, cliente.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    
    const payload = { 
      sub: cliente.id, 
      email: cliente.email, 
      nome: cliente.nome 
    };

    // Retorna o token e dados públicos 
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      },
    };
  }
}