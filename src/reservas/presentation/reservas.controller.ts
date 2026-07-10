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
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReservasService } from '../application/reservas.service';
import { CreateReservaDto } from '../application/dto/create-reserva.dto';
import { UpdateReservaDto } from '../application/dto/update-reserva.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('reservas')
@UseGuards(AuthGuard('jwt'))
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  criar(@Body() dto: CreateReservaDto) {
    return this.reservasService.criar(dto);
  }

  @Get()
  listar(@Query() pagination: PaginationQueryDto) {
    return this.reservasService.listar(pagination);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservaDto,
  ) {
    return this.reservasService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.reservasService.remover(id);
    return { message: `Reserva #${id} cancelada e removida com sucesso` };
  }
}