import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
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

    if (data.start > data.end) {
      throw new BadRequestException('Start date must be before end date.');
    }

    if (data.start < new Date().toISOString().slice(0, 10)) {
      throw new BadRequestException('Start date must be after today.');
    }

    const newRequestVacationDays = Number(data.vacationDays);
    const saldoFerias = 30;
    let saldoFeriasUtilizado = 0;
    const inicioPeriodoAquisitivoAtual = dayjs(data.employeeContractDate).set(
      'year',
      dayjs(new Date()).year(),
    );
    const fimPeriodoAquisitivoAtual = inicioPeriodoAquisitivoAtual.add(
      1,
      'year',
    );
    const schedulesApproved = await this.showApprovedSchedulesByEmployee(
      parseInt(data.idEmployee),
    );

    if (newRequestVacationDays !== dayjs(data.end).diff(data.start, 'day')) {
      throw new BadRequestException(
        'The number of vacation days must be equal to the difference between the start and end dates.',
      );
    }

    if (
      !(
        dayjs(data.start).isAfter(inicioPeriodoAquisitivoAtual) &&
        dayjs(data.start).isBefore(fimPeriodoAquisitivoAtual) &&
        dayjs(data.end).isAfter(inicioPeriodoAquisitivoAtual) &&
        dayjs(data.end).isBefore(fimPeriodoAquisitivoAtual)
      )
    ) {
      throw new BadRequestException(
        'The requested vacation days must be within the current aquisitive period.',
      );
    }

    console.log('Dados: ', data);

    const approvedSchedulesInsidePeriod = schedulesApproved.filter(
      (schedule) => {
        return (
          dayjs(schedule.start).isAfter(inicioPeriodoAquisitivoAtual) &&
          dayjs(schedule.start).isBefore(fimPeriodoAquisitivoAtual) &&
          dayjs(schedule.end).isAfter(inicioPeriodoAquisitivoAtual) &&
          dayjs(schedule.end).isBefore(fimPeriodoAquisitivoAtual)
        );
      },
    );

    console.log(
      'férias aprovadas dentro do período aquisitivo: ',
      approvedSchedulesInsidePeriod,
    );

    approvedSchedulesInsidePeriod.forEach((schedule) => {
      saldoFeriasUtilizado += dayjs(schedule.end).diff(schedule.start, 'day');
    });

    console.log(saldoFeriasUtilizado);

    if (saldoFeriasUtilizado + newRequestVacationDays > saldoFerias) {
      throw new BadRequestException(
        'The employee has no more vacation days available or the number of vacation days requested is greater than the number of vacation days available.',
      );
    }

    if (saldoFeriasUtilizado === 10) {
      if (newRequestVacationDays < 15) {
        throw new BadRequestException(
          'The employee needs to request 15 or 20 vacation days to complete the period of 30 days of vacation.',
        );
      }
    }

    // Verifica se já possui solicitação de férias com antecipação de salário marcada como sim
    const scheduleWithAnticipateSalary = approvedSchedulesInsidePeriod.find(
      (schedule) => {
        return schedule.anticipateSalary === true;
      },
    );

    console.log('Antecipação do salario: ', data.anticipateSalary);

    if (data.anticipateSalary === true && scheduleWithAnticipateSalary) {
      throw new BadRequestException(
        'The employee already has a vacation request with the salary advance option marked as yes.',
      );
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

  async showApprovedSchedulesByEmployee(idEmployee: number) {
    return this.prisma.schedules.findMany({
      where: {
        idEmployee,
        status: 'Approved',
      },
    });
  }

  async updatePartial(id: number, data: UpdatePatchScheduleDTO) {
    await this.exists(id);

    return this.prisma.schedules.update({
      where: {
        id,
      },
      data: {
        status: data.status,
        managerComment: data.managerComment,
        employeeComment: data.employeeComment,
        anticipateSalary: data.anticipateSalary,
      },
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
