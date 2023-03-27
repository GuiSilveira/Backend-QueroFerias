import { CreateEmployeeDTO } from './create-employee.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber, IsEmpty } from 'class-validator';

export class UpdatePatchEmployeeDTO extends PartialType(CreateEmployeeDTO) {
  @IsOptional()
  @IsNumber()
  idManager: number;
}
