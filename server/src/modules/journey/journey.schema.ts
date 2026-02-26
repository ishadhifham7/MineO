export const getTimelineSchema = {
  tags: ['Journey Map'],
  summary: 'Get journey map timeline',
  description: 'Returns all pinned journal entries ordered by date',
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
