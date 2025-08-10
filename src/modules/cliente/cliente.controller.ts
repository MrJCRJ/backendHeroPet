import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post()
  async create(@Body() data: CreateClienteDto) {
    try {
      return await this.clienteService.create(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Lista todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada.' })
  @Get()
  async findAll() {
    return this.clienteService.findAll();
  }

  @ApiOperation({ summary: 'Busca cliente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.clienteService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Atualiza cliente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateClienteDto) {
    console.log('Dados recebidos para update:', data);
    try {
      return await this.clienteService.update(id, data);
    } catch (error) {
      if (error.message === 'Cliente não encontrado') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Deleta cliente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cliente deletado.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.clienteService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
