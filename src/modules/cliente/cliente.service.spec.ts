import { Test, TestingModule } from '@nestjs/testing';
import { ClienteService } from './cliente.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('ClienteService', () => {
  let service: ClienteService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: PrismaService,
          useValue: {
            cliente: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    const clienteData = {
      cpf_cnpj: '12345678900',
      nome: 'João da Silva',
      email: 'joao@example.com',
      telefone: '11999999999',
      cep: '01001000',
      numero: '123',
      complemento: 'Apto 45',
    };

    it('deve criar um cliente com sucesso', async () => {
      (prisma.cliente.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.cliente.create as jest.Mock).mockResolvedValue({
        id: 'uuid-gerado',
        criadoEm: new Date(),
        ...clienteData,
      });

      const result = await service.create(clienteData);

      expect(result).toHaveProperty('id');
      expect(result.nome).toBe(clienteData.nome);
      expect(prisma.cliente.create).toHaveBeenCalledWith({
        data: clienteData,
      });
    });

    it('deve lançar erro se CPF/CNPJ já existir', async () => {
      (prisma.cliente.findUnique as jest.Mock).mockResolvedValue({
        id: 'uuid-existente',
        ...clienteData,
      });

      await expect(service.create(clienteData)).rejects.toThrowError(
        'CPF/CNPJ já cadastrado',
      );
    });

    it('deve lançar erro se email já existir', async () => {
      (prisma.cliente.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prisma.cliente.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'uuid-existente',
        ...clienteData,
      });

      await expect(service.create(clienteData)).rejects.toThrowError(
        'Email já cadastrado',
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os clientes', async () => {
      const clientes = [
        {
          id: 'uuid-1',
          cpf_cnpj: '12345678900',
          nome: 'João da Silva',
          email: 'joao@example.com',
          telefone: '11999999999',
          cep: '01001000',
          numero: '123',
          complemento: 'Apto 45',
          criadoEm: new Date(),
        },
        {
          id: 'uuid-2',
          cpf_cnpj: '98765432100',
          nome: 'Maria Souza',
          email: 'maria@example.com',
          telefone: '11888888888',
          cep: '02002000',
          numero: '456',
          complemento: 'Casa',
          criadoEm: new Date(),
        },
      ];

      (prisma.cliente.findMany as jest.Mock).mockResolvedValue(clientes);

      const result = await service.findAll();

      expect(result).toEqual(clientes);
      expect(prisma.cliente.findMany).toHaveBeenCalledTimes(1);
    });

    it('deve retornar array vazio se não houver clientes', async () => {
      (prisma.cliente.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prisma.cliente.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
