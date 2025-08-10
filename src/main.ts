import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // bloqueia e retorna erro se vier campo extra
      transform: true, // transforma payload em instância do DTO
      transformOptions: {
        enableImplicitConversion: true, // converte tipos básicos automaticamente
      },
      validationError: {
        target: false, // não mostra o objeto original na mensagem de erro
        value: false, // não mostra o valor que falhou na validação
      },
      exceptionFactory: (errors) => {
        // Aqui você personaliza a mensagem de erro que vai pro cliente
        const messages = errors
          .map((err) => {
            const constraints = err.constraints
              ? Object.values(err.constraints)
              : [];
            return `${err.property}: ${constraints.join(', ')}`;
          })
          .join('; ');
        return new BadRequestException(`Erro de validação: ${messages}`);
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173', // Coloque a URL do seu frontend aqui
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // se precisar enviar cookies
  });

  const config = new DocumentBuilder()
    .setTitle('API Clientes')
    .setDescription('API para gerenciamento de clientes')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('Servidor iniciado na porta 3000');
  console.log('Documentação Swagger disponível em: http://localhost:3000/api');

  await app.listen(3000);
}
bootstrap();
