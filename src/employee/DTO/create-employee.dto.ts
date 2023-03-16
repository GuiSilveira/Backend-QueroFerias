import {
  IsString,
  IsEmail,
  IsStrongPassword,
  Contains,
  IsEnum,
} from 'class-validator';

enum Position {
  Admin = 'Admin',
  Manager = 'Manager',
  Employee = 'Employee',
}

enum Contract {
  CLT = 'CLT',
  PJ = 'PJ',
}

export class CreateEmployeeDTO {
  @IsString()
  name: string;

  @IsString()
  credential: string;

  @IsEmail()
  email: string;

  @IsEmail()
  @Contains('@gmail.com')
  gmail: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @IsString()
  area: string;

  @IsEnum(Position)
  position: Position;

  @IsString()
  role: string;

  @IsEnum(Contract)
  contract: Contract;
}
