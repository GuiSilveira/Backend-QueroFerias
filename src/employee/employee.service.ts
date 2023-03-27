import { Position } from 'src/enums/position.enum';
import { CreateEmployeeDTO } from './DTO/create-employee.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutEmployeeDTO } from './DTO/update-put-employee.dto';
import { UpdatePatchEmployeeDTO } from './DTO/update-patch-employee.dto';
import * as bcrypt from 'bcrypt';

// Um Service é a "cozinha", nele é onde os dados serão tratados e manipulados antes de serem enviados para o controller.
@Injectable()
export class EmployeeService {
  // Para acessar um serviço, basta injetá-lo no construtor da classe.
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEmployeeDTO) {
    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return this.prisma.employee.create({
      data,
    });
  }

  async list() {
    return this.prisma.employee.findMany();
  }

  async listAllManagers() {
    const managers = await this.prisma.employee.findMany({
      where: {
        position: 'Manager',
      },
    });

    const managersNameAndArea = managers.map((manager) => {
      return {
        id: manager.id,
        name: manager.name,
        area: manager.area,
        role: manager.role,
      };
    });

    return managersNameAndArea;
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

    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return this.prisma.employee.update({
      where: {
        id,
      },
      data,
    });
  }

  async updatePartial(id: number, data: UpdatePatchEmployeeDTO) {
    await this.exists(id);

    const verifiedData: any = {};

    if (data.area) {
      verifiedData.area = data.area;
    }

    if (data.contract) {
      verifiedData.contract = data.contract;
    }

    if (data.credential) {
      verifiedData.credential = data.credential;
    }

    if (data.email) {
      verifiedData.email = data.email;
    }

    if (data.idManager) {
      verifiedData.idManager = Number(data.idManager);
    }

    if (data.name) {
      verifiedData.name = data.name;
    }

    if (data.password) {
      const salt = await bcrypt.genSalt();

      verifiedData.password = await bcrypt.hash(data.password, salt);
    }

    if (data.gmail) {
      verifiedData.gmail = data.gmail;
    }

    if (data.position) {
      verifiedData.position = data.position;
    }

    if (data.role) {
      verifiedData.role = data.role;
    }

    return this.prisma.employee.update({
      where: {
        id,
      },
      data: verifiedData,
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

    const { schedules } = await this.prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        schedules: true,
      },
    });

    return schedules;
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
