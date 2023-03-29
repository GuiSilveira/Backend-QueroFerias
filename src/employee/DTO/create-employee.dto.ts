import {
  IsString,
  IsEmail,
  IsStrongPassword,
  Contains,
  IsEnum,
  IsNumberString,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Contract } from 'src/enums/contract.enum';
import { Position } from 'src/enums/position.enum';

export class CreateEmployeeDTO {
  @IsString()
  name: string;

  @IsNumberString()
  credential: string;

  @IsEmail()
  @Contains('@verdecard.com.br')
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

  @IsDateString()
  contractDate: string;

  @IsOptional()
  @IsBoolean()
  vacationStatus: boolean;
}
