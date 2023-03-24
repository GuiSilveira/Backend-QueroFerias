import { SetMetadata } from '@nestjs/common';
import { Position } from '../enums/position.enum';

export const POSITIONS_KEY = 'positions';

export const Positions = (...positions: Position[]) =>
  SetMetadata(POSITIONS_KEY, positions);
