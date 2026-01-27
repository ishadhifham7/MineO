import { ForbiddenError } from '../errors/app-error';

/**
 * Assert that the requester owns the resource
 * @throws {ForbiddenError} if ownership check fails
 */
export function assertOwnership(
  resourceUserId: string,
  requesterUserId: string,
  resourceName = 'Resource'
): void {
  if (!resourceUserId || !requesterUserId) {
    throw new ForbiddenError('Invalid user IDs');
  }

  if (resourceUserId !== requesterUserId) {
    throw new ForbiddenError(
      `You do not have permission to access this ${resourceName.toLowerCase()}`
    );
  }
}

/**
 * Check if the requester owns the resource (returns boolean)
 */
export function isOwner(resourceUserId: string, requesterUserId: string): boolean {
  return resourceUserId === requesterUserId;
}
