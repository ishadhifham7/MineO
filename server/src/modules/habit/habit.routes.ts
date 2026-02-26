import { FastifyInstance } from "fastify";
import { HabitController } from "./habit.controller";
import {
  patchHabitSchema,
  calendarSchema,
  radarSchema
} from "./habit.schema";

export async function habitRoutes(fastify: FastifyInstance) {
  fastify.patch(
    "/daily/:date",
    { schema: patchHabitSchema },
    HabitController.patchDailyHabit
  );

  fastify.get(
    "/calendar",
    { schema: calendarSchema },
    HabitController.getCalendar
  );

  fastify.get(
    "/radar",
    { schema: radarSchema },
    HabitController.getRadar
  );
}
