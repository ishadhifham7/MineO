# Goal Feature Security Update - User Data Isolation

## 🔒 Security Implementation Summary

This update implements **user-specific data isolation** for the Goal feature, ensuring that:

- ✅ Users can only create goals under their own account
- ✅ Users can only view their own goals
- ✅ Users cannot access, modify, or delete other users' goals
- ✅ All userId values are extracted from verified JWT tokens, not request bodies

---

## 📝 Changes Made

### 1. **Model Changes** (`goal.model.ts`)

- **Added:** `userId: string` field to the `Goal` interface
- **Purpose:** Track goal ownership at the data model level

### 2. **Service Layer Changes** (`goal.service.ts`)

#### `generateGoal()`

- **Added:** `userId` parameter (required)
- **Changed:** Now attaches `userId` to goal document before saving
- **Security:** userId comes from JWT, not client input

#### `getGoals()`

- **Added:** `userId` parameter (required)
- **Changed:** Now filters goals by `userId` using Firestore query
- **Security:** Only returns goals owned by the authenticated user
- **Query:** `.where('userId', '==', userId).orderBy('createdAt', 'desc')`

#### `getGoalById()`

- **Added:** `userId` parameter (required)
- **Added:** Ownership verification check
- **Security:** Throws `FORBIDDEN` error if goal.userId !== authenticated userId
- **Prevents:** Users from accessing other users' goals by ID

#### `toggleGoalStageCompletion()`

- **Added:** `userId` parameter (required)
- **Added:** Ownership verification check
- **Security:** Throws `FORBIDDEN` error if user doesn't own the goal
- **Prevents:** Users from modifying other users' goal stages

#### `deleteGoal()`

- **Added:** `userId` parameter (required)
- **Added:** Ownership verification check
- **Security:** Throws `FORBIDDEN` error if user doesn't own the goal
- **Prevents:** Users from deleting other users' goals

### 3. **Controller Layer Changes** (`goal.controller.ts`)

All controllers now:

1. Extract `userId` from `req.user.uid` (populated by JWT verification)
2. Verify authentication before processing
3. Pass `userId` to service layer functions
4. Handle `FORBIDDEN` errors with proper 403 responses

#### `generateGoalController()`

```typescript
const userId = req.user?.uid;
if (!userId) {
  throw new AppError('Unauthorized', 401);
}
await generateGoal({ userId, title, description, stages });
```

#### `getGoalsController()`

```typescript
const userId = req.user?.uid;
const goals = await getGoals(userId); // Only user's goals
```

#### `getGoalByIdController()`

```typescript
const userId = req.user?.uid;
const goal = await getGoalById(id, userId); // Ownership verified
```

#### `toggleGoalStageController()`

```typescript
const userId = req.user?.uid;
const updatedGoal = await toggleGoalStageCompletion(goalId, stageId, completed, userId);
```

#### `deleteGoalController()`

```typescript
const userId = req.user?.uid;
await deleteGoal(goalId, userId); // Ownership verified
```

### 4. **Routes Changes** (`goal.routes.ts`)

All goal routes now require authentication:

```typescript
fastify.get('/', {
  preHandler: [fastify.authenticate], // ✅ JWT verification
  schema: getUserGoalsSchema,
  handler: getGoalsController,
});
```

**Routes protected:**

- `POST /goals/generate` - Create goal
- `GET /goals/` - List goals
- `GET /goals/:id` - Get specific goal
- `PATCH /goals/:goalId/stages/:stageId` - Toggle stage
- `DELETE /goals/:goalId` - Delete goal

### 5. **Frontend Changes** (`client/src/lib/http.ts`)

Updated HTTP client to automatically include JWT token:

```typescript
httpClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Impact:**

- All API calls now include `Authorization: Bearer <JWT>` header
- No changes needed in individual API service files
- Works seamlessly with existing frontend code

---

## 🔐 Security Architecture

### Authentication Flow:

```
Frontend Request → JWT in Authorization Header
                        ↓
              fastify.authenticate middleware
                        ↓
              Verify JWT signature
                        ↓
              Extract { userId, email }
                        ↓
              Populate req.user.uid
                        ↓
              Controller extracts userId
                        ↓
              Service filters/verifies by userId
                        ↓
              Database operation
```

### Data Isolation:

```
User A (uid: abc123)          User B (uid: xyz789)
       ↓                               ↓
  Creates Goal                    Creates Goal
  userId: abc123                  userId: xyz789
       ↓                               ↓
  GET /goals                      GET /goals
  Returns goals                   Returns goals
  WHERE userId=abc123             WHERE userId=xyz789
       ↓                               ↓
  [Goal 1, Goal 2]                [Goal 3, Goal 4]
```

**User A CANNOT:**

- See User B's goals
- Modify User B's goal stages
- Delete User B's goals
- Access User B's goal by ID

---

## ⚠️ Firestore Index Requirement

The `getGoals()` function uses a **compound query**:

```typescript
.where('userId', '==', userId)
.orderBy('createdAt', 'desc')
```

### Required Index:

- **Collection:** `goals`
- **Fields:**
  1. `userId` (Ascending)
  2. `createdAt` (Descending)

### How to Create:

#### Option 1: Automatic (First Query Attempt)

When you first run `GET /goals` with this implementation, Firestore will return an error with a link to create the index automatically. Click the link.

#### Option 2: Manual (Firebase Console)

1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Configure:
   - Collection ID: `goals`
   - Fields to index:
     - `userId`: Ascending
     - `createdAt`: Descending
   - Query scope: Collection
4. Click "Create Index"
5. Wait for index to build (usually < 1 minute)

#### Option 3: Using Firebase CLI

```bash
# firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "goals",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

Deploy:

```bash
firebase deploy --only firestore:indexes
```

---

## ✅ Security Guarantees

### Before Implementation:

- ❌ Any user could create goals without authentication
- ❌ `GET /goals` returned ALL goals from ALL users
- ❌ Users could access other users' goals by ID
- ❌ Users could modify/delete other users' goals
- ❌ No ownership verification
- ❌ No authentication required

### After Implementation:

- ✅ All goal routes require valid JWT authentication
- ✅ Goals are automatically tagged with owner's userId
- ✅ `GET /goals` returns only the authenticated user's goals
- ✅ Goal access by ID verifies ownership
- ✅ Stage modifications verify ownership
- ✅ Goal deletion verifies ownership
- ✅ userId is NEVER accepted from request body (only from JWT)
- ✅ Returns 401 Unauthorized if no token
- ✅ Returns 403 Forbidden if user tries to access another user's goal

---

## 🧪 Testing Security

### Test Case 1: User Isolation

```bash
# User A creates a goal
curl -X POST http://localhost:3001/api/v1/goals/generate \
  -H "Authorization: Bearer <USER_A_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Goal","description":"Test","stages":[...]}'

# User B tries to get all goals
curl -X GET http://localhost:3001/api/v1/goals \
  -H "Authorization: Bearer <USER_B_TOKEN>"

# Expected: User B should NOT see User A's goal
```

### Test Case 2: Goal Access Control

```bash
# User A gets their goal ID: goal-123

# User B tries to access User A's goal
curl -X GET http://localhost:3001/api/v1/goals/goal-123 \
  -H "Authorization: Bearer <USER_B_TOKEN>"

# Expected: 403 Forbidden
{
  "error": "Forbidden",
  "message": "You do not have permission to access this goal"
}
```

### Test Case 3: Unauthorized Access

```bash
# Try to access without token
curl -X GET http://localhost:3001/api/v1/goals

# Expected: 401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header"
}
```

---

## 📊 Database Structure

### Before:

```json
{
  "id": "goal-123",
  "title": "Learn TypeScript",
  "description": "Master TypeScript",
  "stages": [...],
  "createdAt": "2026-02-25T10:00:00.000Z"
}
```

### After:

```json
{
  "id": "goal-123",
  "userId": "abc123",  // ← ADDED: Owner's Firebase Auth UID
  "title": "Learn TypeScript",
  "description": "Master TypeScript",
  "stages": [...],
  "createdAt": "2026-02-25T10:00:00.000Z"
}
```

---

## 🚀 Migration Notes

### Existing Goals (Created Before This Update)

Existing goals in the database **do not have a `userId` field**.

#### Options:

1. **Delete old goals** (if test data):

   ```bash
   # Delete all goals without userId
   ```

2. **Migrate existing goals** (if production data):

   ```typescript
   // One-time migration script
   const goals = await firestore.collection('goals').get();
   for (const doc of goals.docs) {
     if (!doc.data().userId) {
       // Assign to a default user or delete
       await doc.ref.update({ userId: 'default-user-id' });
       // OR
       await doc.ref.delete();
     }
   }
   ```

3. **Handle gracefully in code**:
   - Goals without `userId` will be filtered out in queries
   - They effectively become inaccessible

**Recommendation:** For development, delete existing goals and recreate them with proper authentication.

---

## ✨ Summary

| Aspect                     | Implementation                             |
| -------------------------- | ------------------------------------------ |
| **Authentication**         | Required on all routes via JWT             |
| **User Isolation**         | Goals filtered by userId in all operations |
| **Ownership Verification** | Enforced on read, update, delete           |
| **userId Source**          | Extracted from verified JWT (req.user.uid) |
| **Frontend Changes**       | Auto-includes JWT in Authorization header  |
| **API Contract**           | No breaking changes for frontend           |
| **Security Level**         | ✅ Production-ready                        |

**Result:** User A cannot see, access, modify, or delete User B's goals. Complete data isolation achieved.
