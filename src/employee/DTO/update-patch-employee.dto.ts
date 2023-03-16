import { CreateEmployeeDTO } from './create-employee.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumberString } from 'class-validator';

export class UpdatePatchEmployeeDTO extends PartialType(CreateEmployeeDTO) {
  @IsOptional()
  @IsNumberString()
  idManager: number;
}
