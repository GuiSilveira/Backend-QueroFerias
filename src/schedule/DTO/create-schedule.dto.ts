import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

enum Status {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export class CreateScheduleDTO {
  @IsNumberString()
  idEmployee: string;

  @IsString()
  start: string;

  @IsString()
  end: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsString()
  employeeComment: string;

  @IsOptional()
  @IsString()
  managerComment: string;

  @IsOptional()
  @IsBoolean()
  anticipateSalary: boolean;

  @IsNumberString()
  vacationDays: string;

  @IsDateString()
  employeeContractDate: string;
}
