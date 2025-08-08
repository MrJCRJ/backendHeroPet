// src/modules/cliente/cliente.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ClienteService } from './cliente.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('ClienteService', () => {
  let service: ClienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteService, PrismaService],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
  });

  it('deve criar um cliente com nome e email', async () => {
    const clienteCriado = await service.criarCliente({
      cpf_cnpj: '12345678901',
      nome: 'José Teste',
      email: 'jose@email.com',
      telefone: '11987654321',
      cep: '12345678',
      numero: '123',
      complemento: 'Apto 1',
    });

    expect(clienteCriado).toHaveProperty('id');
    expect(clienteCriado.nome).toBe('José Teste');
    expect(clienteCriado.email).toBe('jose@email.com');
    expect(clienteCriado.cpf_cnpj).toBe('12345678901');
    expect(clienteCriado.telefone).toBe('11987654321');
    expect(clienteCriado.cep).toBe('12345678');
    expect(clienteCriado.numero).toBe('123');
    expect(clienteCriado.complemento).toBe('Apto 1');
  });
});
