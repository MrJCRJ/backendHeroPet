// src/app.module.ts
import { Module } from '@nestjs/common';
import { HelloModule } from './modules/hello/hello.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { PrismaService } from './common/prisma/prisma.service';

@Module({
  imports: [HelloModule, ClienteModule],
  providers: [PrismaService],
  exports: [PrismaService],
  controllers: [], // No global controllers needed
})
export class AppModule {}
