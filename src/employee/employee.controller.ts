import { AuthGuard } from './../guards/auth.guard';
import { Positions } from './../decorators/positions.decorator';
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
  UseGuards,
} from '@nestjs/common';
import { UpdatePutEmployeeDTO } from './DTO/update-put-employee.dto';
import { UpdatePatchEmployeeDTO } from './DTO/update-patch-employee.dto';
import { EmployeeService } from './employee.service';
import { Position } from 'src/enums/position.enum';
import { PositionGuard } from 'src/guards/position.guard';

// O controller funciona como um garçom, portanto, ele vai apenas chamar os métodos definidos no service e retornar o resultado para a rota que o chamou com o método HTTP correto.
@UseGuards(AuthGuard, PositionGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() data: CreateEmployeeDTO) {
    return this.employeeService.create(data);
  }

  @Positions(Position.Employee, Position.Manager, Position.Admin)
  @Get('managers')
  async listAllManagers() {
    return this.employeeService.listAllManagers();
  }

  @Positions(Position.Admin, Position.Manager)
  @Get('/manager/employees-without-manager')
  async listEmployeesWithoutManager() {
    return this.employeeService.listEmployeesWithoutManager();
  }

  @Positions(Position.Admin)
  @Get()
  async list() {
    return this.employeeService.list();
  }

  @Positions(Position.Admin, Position.Manager, Position.Employee)
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id) {
    return this.employeeService.show(id);
  }

  @Positions(Position.Admin, Position.Manager, Position.Employee)
  @Get(':id/schedules')
  async listSchedulesByEmployee(@Param('id', ParseIntPipe) id) {
    return this.employeeService.listSchedulesByEmployee(id);
  }

  @Positions(Position.Admin, Position.Manager, Position.Employee)
  @Get(':id/schedules/pending')
  async listPendingSchedulesByEmployee(@Param('id', ParseIntPipe) id) {
    return this.employeeService.listPendingSchedulesByEmployee(id);
  }

  @Positions(Position.Manager)
  @Get('manager/:id')
  async listEmployeesByManager(@Param('id', ParseIntPipe) id) {
    return this.employeeService.listEmployeesByManager(id);
  }

  @Positions(Position.Admin, Position.Manager)
  @Get('manager/:id/schedules/all')
  async listEmployeeSchedulesByManager(@Param('id', ParseIntPipe) id) {
    return this.employeeService.listEmployeeSchedulesByManager(id);
  }

  @Positions(Position.Manager)
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

  @Positions(Position.Admin)
  @Put(':id')
  async update(
    @Body() data: UpdatePutEmployeeDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return this.employeeService.update(id, data);
  }

  @Positions(Position.Admin, Position.Manager, Position.Employee)
  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchEmployeeDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return this.employeeService.updatePartial(id, data);
  }

  @Positions(Position.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return this.employeeService.delete(id);
  }
}
