import {
  IsBoolean,
  IsBooleanString,
  IsDate,
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
  idEmployee: number;

  @IsString()
  start: Date;

  @IsString()
  end: Date;

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
  @IsBooleanString()
  anticipateSalary: boolean;
}
