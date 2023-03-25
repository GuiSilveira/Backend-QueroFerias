import { AuthRegisterDTO } from './DTO/auth-register.dto';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Employee } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeService } from 'src/employee/employee.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'funcionarios';

  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly employeeService: EmployeeService,
  ) {}

  createToken(user: Employee) {
    return {
      accessToken: this.JWTService.sign(
        {
          id: user.id,
          name: user.name,
          manager: user.idManager,
          position: user.position,
          contract: user.contract,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.JWTService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);

      return true;
    } catch (error) {
      return false;
    }
  }

  async login(credential: string, password: string) {
    // Busca se o usuário existe através do email que está unique
    const user = await this.prisma.employee.findFirst({
      where: {
        credential,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Matrícula e/ou senha incorretos.');
    }

    // Compara a senha com hash para ver se bate com a do banco e lança um erro caso não bata
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Matrícula e/ou senha incorretos.');
    }

    return this.createToken(user);
  }

  async forgotPassword(credential: string) {
    const user = await this.prisma.employee.findFirst({
      where: {
        credential,
      },
    });

    if (!user) {
      throw new UnauthorizedException('A matrícula está incorreta.');
    }

    // TODO: Enviar o email com o token para resetar a senha
    return true;
  }

  async resetPassword(password: string, token: string) {
    // TODO: validar o token

    const id = 0;

    const user = await this.prisma.employee.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.employeeService.create(data);

    return this.createToken(user);
  }
}
