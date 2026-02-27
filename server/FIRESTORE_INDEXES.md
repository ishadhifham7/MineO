# Firestore Index Configuration

## Required Composite Indexes

For optimal performance, create these composite indexes in Firestore:

### Collection: `goals`

| Field     | Order      |
| --------- | ---------- |
| userId    | Ascending  |
| createdAt | Descending |

### Collection: `dailyStates`

| Field  | Order     |
| ------ | --------- |
| userId | Ascending |
| date   | Ascending |

## How to Create the Indexes

### Option 1: Firestore Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Configure:
   - Collection ID: `goals`
   - Fields to index:
     - Field: `userId`, Order: Ascending
     - Field: `createdAt`, Order: Descending
6. Click **Create**

### Option 2: firestore.indexes.json (Infrastructure as Code)

Create/update `firestore.indexes.json` in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "goals",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "dailyStates",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "date",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy:

```bash
firebase deploy --only firestore:indexes
```

### Option 3: Auto-creation via Error Link

When you first run queries that require indexes, Firestore will return an error with a link to auto-create the index. Click the link in the error message.

## Why These Indexes Are Needed

### Goals Index

The query in [goal.service.ts](src/modules/goal/goal.service.ts):

```typescript
firestore.collection('goals').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
```

Uses both:

- Equality filter on `userId`
- Order by `createdAt`

This requires a composite index in Firestore.

### Habit (Daily States) Indexes

The queries in [habit.service.ts](src/modules/habit/habit.service.ts):

**Calendar Query:**

```typescript
collection.where('userId', '==', userId).where('date', '>=', start).where('date', '<=', end).get();
```

**Radar Query:**

```typescript
collection.where('userId', '==', userId).where('date', '>=', start).where('date', '<=', end).get();
```

Both use:

- Equality filter on `userId`
- Range filter on `date` (>=, <=)

This requires a composite index on `userId` (ascending) and `date` (ascending).

## Single-field Indexes

Firestore automatically creates single-field indexes for:

- `userId` (for basic equality queries)
- `createdAt` (for basic ordering)
- All other fields

No manual configuration needed for single-field indexes.
