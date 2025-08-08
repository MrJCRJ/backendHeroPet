import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    cpf_cnpj: string;
    nome: string;
    email: string;
    telefone?: string;
    cep?: string;
    numero?: string;
    complemento?: string;
  }) {
    // Verifica CPF/CNPJ duplicado
    const cpfCnpjExistente = await this.prisma.cliente.findUnique({
      where: { cpf_cnpj: data.cpf_cnpj },
    });
    if (cpfCnpjExistente) {
      throw new Error('CPF/CNPJ já cadastrado');
    }

    // Verifica Email duplicado
    const emailExistente = await this.prisma.cliente.findUnique({
      where: { email: data.email },
    });
    if (emailExistente) {
      throw new Error('Email já cadastrado');
    }

    // Cria o cliente
    return this.prisma.cliente.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.cliente.findMany();
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    return cliente;
  }

  async update(
    id: string,
    data: Partial<{
      cpf_cnpj: string;
      nome: string;
      email: string;
      telefone?: string;
      cep?: string;
      numero?: string;
      complemento?: string;
    }>,
  ) {
    const clienteExistente = await this.prisma.cliente.findUnique({
      where: { id },
    });
    if (!clienteExistente) {
      throw new Error('Cliente não encontrado');
    }

    if (data.cpf_cnpj) {
      const cpfCnpjExistente = await this.prisma.cliente.findUnique({
        where: { cpf_cnpj: data.cpf_cnpj },
      });
      if (cpfCnpjExistente && cpfCnpjExistente.id !== id) {
        throw new Error('CPF/CNPJ já cadastrado');
      }
    }

    if (data.email) {
      const emailExistente = await this.prisma.cliente.findUnique({
        where: { email: data.email },
      });
      if (emailExistente && emailExistente.id !== id) {
        throw new Error('Email já cadastrado');
      }
    }

    return this.prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const clienteExistente = await this.prisma.cliente.findUnique({
      where: { id },
    });
    if (!clienteExistente) {
      throw new Error('Cliente não encontrado');
    }

    return this.prisma.cliente.delete({
      where: { id },
    });
  }
}
