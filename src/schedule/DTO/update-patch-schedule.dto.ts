import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDTO } from './create-schedule.dto';

export class UpdatePatchScheduleDTO extends PartialType(CreateScheduleDTO) {}
