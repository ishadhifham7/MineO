export const getTimelineSchema = {
  tags: ['Journey Map'],
  summary: 'Get timeline entries',
  description: 'Returns all journal entries added to the journey map timeline',
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
          isPinnedToTimeline: { type: 'boolean' },
          updatedAt: { type: 'number' },
        },
        required: ['id', 'date', 'isPinnedToTimeline', 'updatedAt'],
      },
    },
  },
}
