export type Category = "spiritual" | "mental" | "physical";

export type DailyScore = {
	spiritual?: number;
	mental?: number;
	physical?: number;
};

export type CalendarData = Record<string, DailyScore>;

export type RadarData = { labels: string[]; values: number[] };

export default {};
