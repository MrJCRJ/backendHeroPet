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
              update: jest.fn(),
              delete: jest.fn(),
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

  describe('findOne', () => {
    it('deve retornar um cliente pelo ID', async () => {
      const cliente = {
        id: 'uuid-1',
        cpf_cnpj: '12345678900',
        nome: 'João da Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
        cep: '01001000',
        numero: '123',
        complemento: 'Apto 45',
        criadoEm: new Date(),
      };

      (prisma.cliente.findUnique as jest.Mock).mockResolvedValue(cliente);

      const result = await service.findOne(cliente.id);

      expect(result).toEqual(cliente);
      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({
        where: { id: cliente.id },
      });
    });

    it('deve lançar erro se cliente não for encontrado', async () => {
      (prisma.cliente.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('uuid-inexistente')).rejects.toThrowError(
        'Cliente não encontrado',
      );
    });
  });

  describe('update', () => {
    const clienteExistente = {
      id: 'uuid-1',
      cpf_cnpj: '12345678900',
      nome: 'João da Silva',
      email: 'joao@example.com',
      telefone: '11999999999',
      cep: '01001000',
      numero: '123',
      complemento: 'Apto 45',
      criadoEm: new Date(),
    };

    const dadosAtualizados = {
      nome: 'João Silva Atualizado',
      telefone: '11988887777',
    };

    it('deve atualizar cliente com sucesso', async () => {
      // mock para findUnique — responder conforme where:
      (prisma.cliente.findUnique as jest.Mock).mockImplementation(
        ({ where }) => {
          if (where.id) {
            // Quando verifica se cliente existe
            return Promise.resolve(clienteExistente);
          }
          if (where.cpf_cnpj) {
            // verifica duplicação de cpf_cnpj — não duplicado nesse teste
            return Promise.resolve(null);
          }
          if (where.email) {
            // verifica duplicação de email — não duplicado nesse teste
            return Promise.resolve(null);
          }
          return Promise.resolve(null);
        },
      );

      (prisma.cliente.update as jest.Mock).mockResolvedValue({
        ...clienteExistente,
        ...dadosAtualizados,
      });

      const result = await service.update(
        clienteExistente.id,
        dadosAtualizados,
      );

      expect(result.nome).toBe(dadosAtualizados.nome);
      expect(prisma.cliente.update).toHaveBeenCalledWith({
        where: { id: clienteExistente.id },
        data: dadosAtualizados,
      });
    });

    it('deve lançar erro se cliente não existir', async () => {
      (prisma.cliente.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('uuid-inexistente', dadosAtualizados),
      ).rejects.toThrowError('Cliente não encontrado');
    });

    it('deve lançar erro se CPF/CNPJ atualizado já existir em outro cliente', async () => {
      // cliente existe
      (prisma.cliente.findUnique as jest.Mock).mockImplementation(
        ({ where }) => {
          if (where.id) {
            return Promise.resolve(clienteExistente);
          }
          if (where.cpf_cnpj) {
            // cpf_cnpj duplicado retorna cliente diferente
            return Promise.resolve({ id: 'uuid-2', cpf_cnpj: '99999999999' });
          }
          return Promise.resolve(null);
        },
      );

      await expect(
        service.update(clienteExistente.id, { cpf_cnpj: '99999999999' }),
      ).rejects.toThrowError('CPF/CNPJ já cadastrado');
    });

    it('deve lançar erro se email atualizado já existir em outro cliente', async () => {
      (prisma.cliente.findUnique as jest.Mock).mockImplementation(
        ({ where }) => {
          if (where.id) {
            return Promise.resolve(clienteExistente);
          }
          if (where.cpf_cnpj) {
            // cpf_cnpj não duplicado
            return Promise.resolve(null);
          }
          if (where.email) {
            // email duplicado retorna cliente diferente
            return Promise.resolve({ id: 'uuid-2', email: 'email@outro.com' });
          }
          return Promise.resolve(null);
        },
      );

      await expect(
        service.update(clienteExistente.id, { email: 'email@outro.com' }),
      ).rejects.toThrowError('Email já cadastrado');
    });
  });

  describe('remove', () => {
    const clienteExistente = {
      id: 'uuid-1',
      cpf_cnpj: '12345678900',
      nome: 'João da Silva',
      email: 'joao@example.com',
      telefone: '11999999999',
      cep: '01001000',
      numero: '123',
      complemento: 'Apto 45',
      criadoEm: new Date(),
    };

    it('deve remover cliente com sucesso', async () => {
      (prisma.cliente.findUnique as jest.Mock).mockResolvedValue(
        clienteExistente,
      );
      (prisma.cliente.delete as jest.Mock).mockResolvedValue(clienteExistente);

      const result = await service.remove(clienteExistente.id);

      expect(result).toEqual(clienteExistente);
      expect(prisma.cliente.delete).toHaveBeenCalledWith({
        where: { id: clienteExistente.id },
      });
    });

    it('deve lançar erro se cliente não existir', async () => {
      (prisma.cliente.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('uuid-inexistente')).rejects.toThrowError(
        'Cliente não encontrado',
      );
    });
  });
});
