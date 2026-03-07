// Journey API Schemas

export const getTimelineSchema = {
  tags: ['Journey Map'],
  summary: 'Get journey map timeline',
  description: 'Returns all journal entries ordered by date',
  security: [{ bearerAuth: [] }],

  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          date: { type: 'string', format: 'date' },
          title: { type: 'string', nullable: true },
          updatedAt: { type: 'number' },
        },
        required: ['id', 'date', 'updatedAt'],
      },
    },
  },
}
