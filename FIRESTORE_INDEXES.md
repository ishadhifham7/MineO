# Firestore Index Configuration

## Required Composite Index

For optimal performance of the `GET /goals` endpoint, create this composite index in Firestore:

### Collection: `goals`

| Field     | Order      |
| --------- | ---------- |
| userId    | Ascending  |
| createdAt | Descending |

## How to Create the Index

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

When you first run `GET /goals`, Firestore will return an error with a link to auto-create the index. Click the link in the error message.

## Why This Index is Needed

The query in [goal.service.ts](src/modules/goal/goal.service.ts):

```typescript
firestore.collection('goals').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
```

Uses both:

- Equality filter on `userId`
- Order by `createdAt`

This requires a composite index in Firestore.

## Single-field Indexes

Firestore automatically creates single-field indexes for:

- `userId` (for basic equality queries)
- `createdAt` (for basic ordering)
- All other fields

No manual configuration needed for single-field indexes.
