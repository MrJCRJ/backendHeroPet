import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  providers: [ClienteService],
  imports: [PrismaModule], // Import PrismaModule to use PrismaService
})
export class ClienteModule {}
