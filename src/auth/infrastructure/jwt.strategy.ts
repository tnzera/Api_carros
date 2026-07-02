import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrai o token JWT do cabeçalho 'Authorization' como Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ignora a expiração? Não! Se o token expirar, a requisição deve ser rejeitada
      ignoreExpiration: false,
      // A mesma chave secreta que você vai definir no Módulo
      secretOrKey: 'SUA_CHAVE_SECRETA_SUPER_PROTEGIDA', 
    });
  }

  // O NestJS injeta automaticamente o objeto retornado aqui dentro de 'req.user'
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, nome: payload.nome };
  }
}