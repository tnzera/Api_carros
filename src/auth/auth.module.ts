import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { ClienteTypeOrmEntity } from '../clientes/infrastructure/cliente.typeorm-entity';
import { ClienteTypeOrmRepository } from '../clientes/infrastructure/cliente.typeorm-repository';
import { CLIENTE_REPOSITORY } from '../clientes/application/clientes.service';

@Module({
  imports: [
    // Conecta com a tabela de clientes para que o AuthService valide o e-mail
    TypeOrmModule.forFeature([ClienteTypeOrmEntity]),
    PassportModule,
    JwtModule.register({
      secret: 'SUA_CHAVE_SECRETA_SUPER_PROTEGIDA', // Use variáveis de ambiente (.env) na vida real
      signOptions: { expiresIn: '1d' }, // O token expira em 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // Registra o token que seu sistema espera para injetar o repositório
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClienteTypeOrmRepository,
    },
  ],
})
export class AuthModule {}