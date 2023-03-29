import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateScheduleDTO } from './DTO/create-schedule.dto';
import { UpdatePatchScheduleDTO } from './DTO/update-patch-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() data: CreateScheduleDTO) {
    return this.scheduleService.create(data);
  }

  @Get()
  async list() {
    return this.scheduleService.list();
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id) {
    return this.scheduleService.show(id);
  }

  @Get('employee/:id')
  async listApprovedSchedulesByEmployee(@Param('id', ParseIntPipe) id) {
    return this.scheduleService.showApprovedSchedulesByEmployee(id);
  }

  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchScheduleDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return this.scheduleService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return this.scheduleService.delete(id);
  }
}
