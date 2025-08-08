import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ClienteController } from './cliente.controller';

@Module({
  providers: [ClienteService],
  imports: [PrismaModule],
  controllers: [ClienteController],
})
export class ClienteModule {}
