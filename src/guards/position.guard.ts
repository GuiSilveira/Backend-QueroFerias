import { Position } from 'src/enums/position.enum';
import { POSITIONS_KEY } from './../decorators/positions.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PositionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredPositions = this.reflector.getAllAndOverride<Position[]>(
      POSITIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPositions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    console.log({ user, requiredPositions });
    const positionsFiltered = requiredPositions.filter(
      (position) => position === user.position,
    );

    return positionsFiltered.length > 0;
  }
}
