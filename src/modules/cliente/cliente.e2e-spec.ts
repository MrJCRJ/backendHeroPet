import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('ClienteController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let clienteId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cliente.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('/clientes (POST) - criar cliente', async () => {
    const cliente = {
      cpf_cnpj: '12345678900',
      nome: 'Teste Cliente',
      email: 'teste@cliente.com',
      telefone: '11999999999',
      cep: '01001000',
      numero: '123',
      complemento: 'Apto 45',
    };

    const response = await request(app.getHttpServer())
      .post('/clientes')
      .send(cliente);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    clienteId = response.body.id;
  });

  it('/clientes (POST) - erro ao criar com CPF já cadastrado', async () => {
    const clienteDuplicado = {
      cpf_cnpj: '12345678900',
      nome: 'Outro Cliente',
      email: 'outro@cliente.com',
      telefone: '11888888888',
      cep: '02002000',
      numero: '456',
    };

    const response = await request(app.getHttpServer())
      .post('/clientes')
      .send(clienteDuplicado);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('CPF/CNPJ já cadastrado');
  });

  it('/clientes (POST) - erro ao criar com dados inválidos', async () => {
    const clienteInvalido = {
      cpf_cnpj: '', // vazio
      nome: '', // vazio
      email: 'invalido', // formato errado
      telefone: 'abc', // formato errado
    };

    const response = await request(app.getHttpServer())
      .post('/clientes')
      .send(clienteInvalido);

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBeGreaterThan(0);
  });

  it('/clientes (GET) - listar clientes', async () => {
    const response = await request(app.getHttpServer())
      .get('/clientes')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/clientes/:id (GET) - buscar cliente por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/clientes/${clienteId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', clienteId);
  });

  it('/clientes/:id (GET) - erro ao buscar ID inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get(`/clientes/99999999-9999-9999-9999-999999999999`)
      .expect(404);

    expect(response.body.message).toContain('Cliente não encontrado');
  });

  it('/clientes/:id (PATCH) - atualizar cliente', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/clientes/${clienteId}`)
      .send({ nome: 'Cliente Atualizado' })
      .expect(200);

    expect(response.body.nome).toBe('Cliente Atualizado');
  });

  it('/clientes/:id (PATCH) - erro ao atualizar ID inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/clientes/99999999-9999-9999-9999-999999999999`)
      .send({ nome: 'Teste' })
      .expect(404);

    expect(response.body.message).toContain('Cliente não encontrado');
  });

  it('/clientes/:id (DELETE) - deletar cliente', async () => {
    await request(app.getHttpServer())
      .delete(`/clientes/${clienteId}`)
      .expect(200);

    // Garantir que foi removido
    await request(app.getHttpServer())
      .get(`/clientes/${clienteId}`)
      .expect(404);
  });

  it('/clientes/:id (DELETE) - erro ao deletar ID inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/clientes/99999999-9999-9999-9999-999999999999`)
      .expect(404);

    expect(response.body.message).toContain('Cliente não encontrado');
  });
});
