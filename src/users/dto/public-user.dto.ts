import { Prisma } from '@prisma/client';

/** Campos de `User` expostos na API (sem credenciais). */
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} as const;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;
