import { FastifyInstance } from 'fastify'
import { getTimeline } from './journey.controller'
import { getTimelineSchema } from './journey.schema'

export default async function journeyRoutes(
  fastify: FastifyInstance
) {

  fastify.get(
    '/timeline',
    { schema: getTimelineSchema },
    getTimeline
  )
}
