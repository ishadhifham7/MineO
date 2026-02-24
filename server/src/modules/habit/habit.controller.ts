import { FastifyReply, FastifyRequest } from "fastify";
import { HabitService } from "./habit.service";

export class HabitController {
  static async patchDailyHabit(
    req: FastifyRequest<{ Params: { date: string }; Body: any }>,
    reply: FastifyReply
  ) {
    await HabitService.upsertDailyHabit(req.params.date, req.body);
    return reply.code(204).send();
  }

  static async getCalendar(
    req: FastifyRequest<{ Querystring: { month: string } }>,
    reply: FastifyReply
  ) {
    const data = await HabitService.getMonthlyCalendar(req.query.month);
    
    // Transform array to object keyed by date
    const calendarData = data.reduce((acc, day) => {
      acc[day.date] = {
        spiritual: day.spiritual ?? undefined,
        mental: day.mental ?? undefined,
        physical: day.physical ?? undefined,
      };
      return acc;
    }, {} as Record<string, any>);
    
    return reply.send(calendarData);
  }

  static async getRadar(
    req: FastifyRequest<{ Querystring: { start: string; end: string } }>,
    reply: FastifyReply
  ) {
    const data = await HabitService.getRadarData(
      req.query.start,
      req.query.end
    );
    return reply.send(data);
  }
}
