export const patchHabitSchema = {
  params: {
    type: "object",
    required: ["date"],
    properties: {
      date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" }
    }
  },
  body: {
    type: "object",
    minProperties: 1,
    properties: {
      mental: { type: "number", enum: [1, 3, 5] },
      physical: { type: "number", enum: [1, 3, 5] },
      spiritual: { type: "number", enum: [1, 3, 5] }
    }
  }
};

export const calendarSchema = {
  querystring: {
    type: "object",
    required: ["month"],
    properties: {
      month: { type: "string", pattern: "^\\d{4}-\\d{2}$" }
    }
  }
};

export const radarSchema = {
  querystring: {
    type: "object",
    required: ["start", "end"],
    properties: {
      start: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      end: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" }
    }
  }
};
