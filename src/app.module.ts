import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrosModule } from './carros/carros.module';
import { ClientesModule } from './clientes/clientes.module';
import { ReservasModule } from './reservas/reservas.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.typeorm-entity{.ts,.js}'],
        synchronize: true,
      }),
    }),

    CarrosModule,
    ClientesModule,
    ReservasModule,
    AuthModule,
  ],
})
export class AppModule {}
