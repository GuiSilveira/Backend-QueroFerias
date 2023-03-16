import { CreateEmployeeDTO } from './DTO/create-employee.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutEmployeeDTO } from './DTO/update-put-employee.dto';
import { UpdatePatchEmployeeDTO } from './DTO/update-patch-employee.dto';

// Um Service é a "cozinha", nele é onde os dados serão tratados e manipulados antes de serem enviados para o controller.
@Injectable()
export class EmployeeService {
  // Para acessar um serviço, basta injetá-lo no construtor da classe.
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEmployeeDTO) {
    return this.prisma.employee.create({
      data,
      select: {
        id: true,
        name: true,
        credential: true,
      },
    });
  }

  async list() {
    return this.prisma.employee.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return this.prisma.employee.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdatePutEmployeeDTO) {
    await this.exists(id);

    return this.prisma.employee.update({
      where: {
        id,
      },
      data,
    });
  }

  async updatePartial(id: number, data: UpdatePatchEmployeeDTO) {
    await this.exists(id);

    return this.prisma.employee.update({
      where: {
        id,
      },
      data: {
        area: data.area,
        contract: data.contract,
        credential: data.credential,
        email: data.email,
        idManager: data.idManager ? Number(data.idManager) : undefined,
        name: data.name,
        password: data.password,
        gmail: data.gmail,
        position: data.position,
        role: data.role,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.employee.delete({
      where: {
        id,
      },
    });
  }

  async listSchedulesByEmployee(id: number) {
    await this.exists(id);

    return this.prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        schedules: true,
      },
    });
  }

  async listEmployeesByManager(id: number) {
    await this.exists(id);
    return this.prisma.employee.findMany({
      where: {
        idManager: id,
      },
    });
  }

  async listSelectedEmployeeSchedulesByManager(
    id: number,
    status: 'Pending' | 'Approved' | 'Rejected',
  ) {
    await this.exists(id);

    return this.prisma.employee.findMany({
      where: {
        idManager: id,
      },
      include: {
        schedules: {
          where: {
            status: status,
          },
        },
      },
    });
  }

  async listEmployeeSchedulesByManager(id: number) {
    await this.exists(id);
    return this.prisma.employee.findMany({
      where: {
        idManager: id,
      },
      include: {
        schedules: true,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.employee.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException('Employee not found for this id.');
    }
  }
}
