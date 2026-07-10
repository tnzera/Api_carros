import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientesService } from '../application/clientes.service';
import { CreateClienteDto } from '../application/dto/create-cliente.dto';
import { UpdateClienteDto } from '../application/dto/update-cliente.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  // Somente admins autenticados cadastram clientes
  @Post()
  @UseGuards(AuthGuard('jwt'))
  criar(@Body() dto: CreateClienteDto) {
    return this.clientesService.criar(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  listar(@Query() pagination: PaginationQueryDto) {
    return this.clientesService.listar(pagination);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.buscarPorId(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClienteDto,
  ) {
    return this.clientesService.atualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.clientesService.remover(id);
    return { message: `Cliente #${id} removido com sucesso` };
  }
}