import { EmployeeController } from './employee.controller';
import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserIdCheckMiddleware } from 'src/middlewares/user-id-check.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [],
})
export class EmployeeModule implements NestModule {
  configure(consumer: any) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'employee/:id',
      method: RequestMethod.ALL,
    });
  }
}
