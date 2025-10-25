import { SetMetadata } from '@nestjs/common';

export type Role =
  | 'FARMER'
  | 'EQUIPMENT_VENDOR'
  | 'INPUT_SUPPLIER'
  | 'TRANSPORTER'
  | 'CONSUMER'
  | 'ADMIN';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
