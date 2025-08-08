// cliente.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) {}

  criarCliente(data: {
    cpf_cnpj: string;
    nome: string;
    email: string;
    telefone: string;
    cep: string;
    numero: string;
    complemento?: string;
  }) {
    console.log('Criando cliente com os dados:', data);
    return this.prisma.cliente.create({ data });
  }
}
