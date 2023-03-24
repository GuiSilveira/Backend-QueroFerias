import { IsNumberString, IsString, MinLength } from 'class-validator';

export class AuthLoginDTO {
  @IsNumberString()
  credential: string;

  @IsString()
  @MinLength(6)
  password: string;
}
