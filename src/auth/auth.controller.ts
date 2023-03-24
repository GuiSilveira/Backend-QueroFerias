import { AuthService } from './auth.service';
import { AuthLoginDTO } from './DTO/auth-login.dto';
import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthRegisterDTO } from './DTO/auth-register.dto';
import { AuthForgotPasswordDTO } from './DTO/auth-forgot-password.dto';
import { AuthResetPasswordDTO } from './DTO/auth-reset-password.dto';
import { EmployeeService } from 'src/employee/employee.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() { credential, password }: AuthLoginDTO) {
    return this.authService.login(credential, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('verify')
  async verifyToken(@Req() req) {
    return this.authService.checkToken(req.headers.authorization);
  }

  // Envia o email com o token para resetar a senha
  @Post('forgot-password')
  async forgotPassword(@Body() { credential }: AuthForgotPasswordDTO) {
    return this.authService.forgotPassword(credential);
  }

  // Recebe o token e a nova senha para resetar a senha
  @Post('reset-password')
  async resetPassword(@Body() { password, token }: AuthResetPasswordDTO) {
    return this.authService.resetPassword(password, token);
  }
}
