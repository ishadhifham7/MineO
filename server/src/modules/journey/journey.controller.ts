import { FastifyRequest, FastifyReply } from 'fastify'
import { getJourneyTimeline } from './journey.service'
import { AppError } from '../../shared/errors/app-error'

export async function getTimeline(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user?.uid
  if (!userId) {
    throw new AppError('Unauthorized', 401)
  }

  const timeline = await getJourneyTimeline(userId)

  return reply.status(200).send(timeline)
}
