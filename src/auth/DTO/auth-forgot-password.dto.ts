import { IsNumberString } from 'class-validator';

export class AuthForgotPasswordDTO {
  @IsNumberString()
  credential: string;
}
