import { FastifyRequest, FastifyReply } from 'fastify'
import { getJourneyTimeline } from './journey.service'

export async function getTimeline(
  request: FastifyRequest,
  reply: FastifyReply

) {
  // const userId = request.user.id

  // const timeline = await getJourneyTimeline(userId)

  // return reply.status(200).send(timeline)
}
