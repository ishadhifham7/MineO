import { FastifyReply, FastifyRequest } from 'fastify';
import { HabitService } from './habit.service';
import { AppError } from '../../shared/errors/app-error';

export class HabitController {
  static async patchDailyHabit(
    req: FastifyRequest<{ Params: { date: string }; Body: any }>,
    reply: FastifyReply
  ) {
    // SECURITY: Extract userId from authenticated user (JWT)
    const userId = req.user?.uid;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    await HabitService.upsertDailyHabit(userId, req.params.date, req.body);
    return reply.code(204).send();
  }

  static async getCalendar(
    req: FastifyRequest<{ Querystring: { month: string } }>,
    reply: FastifyReply
  ) {
    // SECURITY: Extract userId from authenticated user (JWT)
    const userId = req.user?.uid;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    // SECURITY: Only return calendar data for this specific user
    const data = await HabitService.getMonthlyCalendar(userId, req.query.month);

    // Transform array to object keyed by date
    const calendarData = data.reduce(
      (acc, day) => {
        acc[day.date] = {
          spiritual: day.spiritual ?? undefined,
          mental: day.mental ?? undefined,
          physical: day.physical ?? undefined,
        };
        return acc;
      },
      {} as Record<string, any>
    );

    return reply.send(calendarData);
  }

  static async getRadar(
    req: FastifyRequest<{ Querystring: { start: string; end: string } }>,
    reply: FastifyReply
  ) {
    // SECURITY: Extract userId from authenticated user (JWT)
    const userId = req.user?.uid;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    // SECURITY: Only return radar data for this specific user
    const data = await HabitService.getRadarData(userId, req.query.start, req.query.end);
    return reply.send(data);
  }
}
