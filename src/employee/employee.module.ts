import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from './../auth/auth.module';
import { EmployeeController } from './employee.controller';
import { forwardRef, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserIdCheckMiddleware } from 'src/middlewares/user-id-check.middleware';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule implements NestModule {
  configure(consumer: any) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'employee/:id',
      method: RequestMethod.ALL,
    });
  }
}
