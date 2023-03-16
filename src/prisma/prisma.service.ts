import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Abre a conexão do banco depois que é importado por algum módulo.
  async onModuleInit() {
    await this.$connect();
  }

  // Fecha a conexão do banco depois de ser utilizada.
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
