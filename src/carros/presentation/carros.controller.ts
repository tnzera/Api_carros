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
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CarrosService } from '../application/carros.service';
import { CreateCarroDto } from '../application/dto/create-carro.dto';
import { UpdateCarroDto } from '../application/dto/update-carro.dto';

@Controller('carros')
@UseGuards(AuthGuard('jwt'))
export class CarrosController {
  constructor(private readonly carrosService: CarrosService) {}

  @Post()
  criar(@Body() dto: CreateCarroDto) {
    return this.carrosService.criar(dto);
  }

  @Get()
  listar() {
    return this.carrosService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.carrosService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCarroDto,
  ) {
    return this.carrosService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.carrosService.remover(id);
    return { message: `Carro #${id} removido com sucesso` };
}
}
