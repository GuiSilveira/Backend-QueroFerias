import {
  IsBoolean,
  IsBooleanString,
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

  @IsDateString()
  start: Date;

  @IsDateString()
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

  @IsBooleanString()
  anticipateSalary: boolean;
}
