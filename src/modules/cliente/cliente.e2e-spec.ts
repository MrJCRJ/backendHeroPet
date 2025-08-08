import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('ClienteController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    // Limpa os clientes antes dos testes
    const prisma = app.get(PrismaService);
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

    console.log('Response body:', response.body);

    expect(response.status).toBe(201);
  });

  it('/clientes (GET) - listar clientes', async () => {
    const response = await request(app.getHttpServer())
      .get('/clientes')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Mais testes e2e podem ser adicionados para GET/:id, PATCH/:id, DELETE/:id
});
