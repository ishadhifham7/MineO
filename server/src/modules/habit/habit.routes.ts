import { FastifyInstance } from 'fastify';
import { HabitController } from './habit.controller';
import { patchHabitSchema, calendarSchema, radarSchema } from './habit.schema';

export async function habitRoutes(fastify: FastifyInstance) {
  // SECURITY: All habit routes require authentication

  // Update daily habit state (user-specific)
  fastify.patch('/daily/:date', {
    preHandler: [fastify.authenticate],
    schema: patchHabitSchema,
    handler: HabitController.patchDailyHabit,
  });

  // Get monthly calendar data (user-specific)
  fastify.get('/calendar', {
    preHandler: [fastify.authenticate],
    schema: calendarSchema,
    handler: HabitController.getCalendar,
  });

  // Get radar chart data (user-specific)
  fastify.get('/radar', {
    preHandler: [fastify.authenticate],
    schema: radarSchema,
    handler: HabitController.getRadar,
  });
}
