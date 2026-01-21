import { AppError } from '../errors/app-error';

export function assertOwnership(
  resourceUserId: string,
  requesterUserId: string
) {
  if (resourceUserId !== requesterUserId) {
    throw new AppError('Forbidden', 403);
  }
}
