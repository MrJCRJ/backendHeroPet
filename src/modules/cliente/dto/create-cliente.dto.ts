import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    example: '12345678900',
    description: 'CPF ou CNPJ do cliente',
  })
  @IsString()
  @IsNotEmpty()
  cpf_cnpj: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do cliente' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: 'joao@exemplo.com',
    description: 'Email do cliente',
    required: false,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Telefone do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({
    example: '01001000',
    description: 'CEP do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  cep?: string;

  @ApiProperty({
    example: '123',
    description: 'Número do endereço',
    required: false,
  })
  @IsString()
  @IsOptional()
  numero?: string;

  @ApiProperty({
    example: 'Apto 45',
    description: 'Complemento do endereço',
    required: false,
  })
  @IsString()
  @IsOptional()
  complemento?: string;
}
