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
} from '@nestjs/common';
import { ClientesService } from '../application/clientes.service';
import { CreateClienteDto } from '../application/dto/create-cliente.dto';
import { UpdateClienteDto } from '../application/dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  criar(@Body() dto: CreateClienteDto) {
    return this.clientesService.criar(dto);
  }

  @Get()
  listar() {
    return this.clientesService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClienteDto,
  ) {
    return this.clientesService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.clientesService.remover(id);
    return { message: `Cliente #${id} removido com sucesso` };
  }
}