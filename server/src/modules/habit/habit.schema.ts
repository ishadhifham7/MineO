export const patchHabitSchema = {
  params: {
    type: "object",
    required: ["date"],
    properties: {
      date: {
        type: "string",
        pattern: "^\\d{4}-\\d{2}-\\d{2}$"
      }
    }
  },
  body: {
    type: "object",
    minProperties: 1,
    additionalProperties: false,
    properties: {
      mental: {
        type: "number",
        enum: [1, 0.5, 0]
      },
      physical: {
        type: "number",
        enum: [1, 0.5, 0]
      },
      spiritual: {
        type: "number",
        enum: [1, 0.5, 0]
      }
    }
  }
};

export const calendarSchema = {
  querystring: {
    type: "object",
    required: ["month"],
    additionalProperties: false,
    properties: {
      month: {
        type: "string",
        pattern: "^\\d{4}-\\d{2}$"
      }
    }
  }
};

export const radarSchema = {
  querystring: {
    type: "object",
    required: ["start", "end"],
    additionalProperties: false,
    properties: {
      start: {
        type: "string",
        pattern: "^\\d{4}-\\d{2}-\\d{2}$"
      },
      end: {
        type: "string",
        pattern: "^\\d{4}-\\d{2}-\\d{2}$"
      }
    }
  }
};
