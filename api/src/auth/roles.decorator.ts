import { SetMetadata } from '@nestjs/common';

export const Roles = (...ability: any[]) => SetMetadata('ability', ability);
