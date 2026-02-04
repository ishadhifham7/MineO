import { FastifyInstance } from "fastify";
import { HabitController } from "./habit.controller";
import {
  patchHabitSchema,
  calendarSchema,
  radarSchema
} from "./habit.schema";

export async function habitRoutes(fastify: FastifyInstance) {
  fastify.patch(
    "/habits/daily/:date",
    { schema: patchHabitSchema },
    HabitController.patchDailyHabit
  );

  fastify.get(
    "/habits/calendar",
    { schema: calendarSchema },
    HabitController.getCalendar
  );

  fastify.get(
    "/habits/radar",
    { schema: radarSchema },
    HabitController.getRadar
  );
}
