import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDTO } from './DTO/create-schedule.dto';
import { UpdatePatchScheduleDTO } from './DTO/update-patch-schedule.dto';

function dateIsValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateScheduleDTO) {
    // TODO: Verificar se o funcionário possui gerente antes de permitir a criação do agendamento.
    if (!dateIsValid(data.start) || !dateIsValid(data.end)) {
      throw new BadRequestException('Invalid date format.');
    }

    return this.prisma.schedules.create({
      data: {
        idEmployee: Number(data.idEmployee),
        start: data.start,
        end: data.end,
        anticipateSalary: data.anticipateSalary,
        employeeComment: data.employeeComment,
      },
      select: {
        id: true,
      },
    });
  }

  async list() {
    return this.prisma.schedules.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return this.prisma.schedules.findUnique({
      where: {
        id,
      },
    });
  }

  async updatePartial(id: number, data: UpdatePatchScheduleDTO) {
    await this.exists(id);

    return this.prisma.schedules.update({
      where: {
        id,
      },
      data,
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.schedules.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException('Employee not found for this id.');
    }
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.schedules.delete({
      where: {
        id,
      },
    });
  }
}
