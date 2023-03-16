import { CreateEmployeeDTO } from './DTO/create-employee.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UpdatePutEmployeeDTO } from './DTO/update-put-employee.dto';
import { UpdatePatchEmployeeDTO } from './DTO/update-patch-employee.dto';
import { EmployeeService } from './employee.service';

// O controller funciona como um garçom, portanto, ele vai apenas chamar os métodos definidos no service e retornar o resultado para a rota que o chamou com o método HTTP correto.
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() data: CreateEmployeeDTO) {
    return this.employeeService.create(data);
  }

  @Get()
  async list() {
    return this.employeeService.list();
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id) {
    return this.employeeService.show(id);
  }

  @Get(':id/schedules')
  async listSchedulesByEmployee(@Param('id', ParseIntPipe) id) {
    return this.employeeService.listSchedulesByEmployee(id);
  }

  @Get('manager/:id')
  async listEmployeesByManager(@Param('id', ParseIntPipe) id) {
    return this.employeeService.listEmployeesByManager(id);
  }

  @Get('manager/:id/schedules/all')
  async listEmployeeSchedulesByManager(@Param('id', ParseIntPipe) id) {
    return this.employeeService.listEmployeeSchedulesByManager(id);
  }

  @Get('manager/:id/schedules/:status')
  async listSelectedEmployeeSchedulesByManager(
    @Param('id', ParseIntPipe) id,
    @Param('status') status: 'Pending' | 'Approved' | 'Rejected',
  ) {
    return this.employeeService.listSelectedEmployeeSchedulesByManager(
      id,
      status,
    );
  }

  @Put(':id')
  async update(
    @Body() data: UpdatePutEmployeeDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return this.employeeService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchEmployeeDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return this.employeeService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return this.employeeService.delete(id);
  }
}
