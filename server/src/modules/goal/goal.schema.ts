// src/modules/goal/goal.schema.ts

export const generateGoalSchema = {
  description: 'Generate a goal with stages',
  tags: ['Goal'],
  body: {
    type: 'object',
    required: ['title', 'description', 'stages'],
    properties: {
      title: { type: 'string', minLength: 3 },
      description: { type: 'string', minLength: 10 },
      stages: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['title', 'description', 'order'],
          properties: {
            title: { type: 'string', minLength: 3 },
            description: { type: 'string', minLength: 5 },
            order: { type: 'number' },
          },
        },
      },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        createdAt: { type: 'string' },
        stages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              order: { type: 'number' },
              completed: { type: 'boolean' },
            },
          },
        },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

export const getUserGoalsSchema = {
  description: 'Get all goals for the authenticated user',
  tags: ['Goal'],
  response: {
    200: {
      type: 'object',
      properties: {
        goals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              stages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    order: { type: 'number' },
                    completed: { type: 'boolean' },
                  },
                },
              },
              createdAt: { type: 'object' },
            },
          },
        },
        count: { type: 'number' },
      },
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

export const getGoalByIdSchema = {
  description: 'Get a specific goal by ID',
  tags: ['Goal'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        goal: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'object' },
            stages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  order: { type: 'number' },
                  completed: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

export const completeStageParamsSchema = {
  params: {
    type: 'object',
    required: ['goalId', 'stageId'],
    properties: {
      goalId: { type: 'string' },
      stageId: { type: 'string' },
    },
  },
};

export const deleteGoalSchema = {
  description: 'Delete a goal by ID',
  tags: ['Goal'],
  params: {
    type: 'object',
    required: ['goalId'],
    properties: {
      goalId: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        goalId: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};
