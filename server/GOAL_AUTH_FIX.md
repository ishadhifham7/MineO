# Goal Authentication Fix - Implementation Summary

## Overview

Fixed user-based goal assignment to ensure all goals are securely tied to authenticated users via Firebase Auth.

## Changes Made

### 1. Goal Model ([goal.model.ts](src/modules/goal/goal.model.ts))

- **Added `userId: string` field** to the `Goal` interface
- Every goal document in Firestore now stores the owner's user ID

### 2. Goal Routes ([goal.routes.ts](src/modules/goal/goal.routes.ts))

- **Added authentication to all routes** using `preHandler: fastify.authenticate`
- **New endpoints added:**
  - `GET /goals` - Get all goals for authenticated user
  - `GET /goals/:id` - Get specific goal with ownership verification
  - `POST /goals/generate` - Create goal (now requires auth)

### 3. Goal Controller ([goal.controller.ts](src/modules/goal/goal.controller.ts))

- **`generateGoalController`:**
  - Extracts `userId` from `req.user.uid` (never from request body)
  - Validates authentication before processing
  - Passes `userId` to service layer
- **`getUserGoalsController`** (NEW):
  - Fetches all goals belonging to authenticated user
  - Returns goals array with count
- **`getGoalByIdController`** (NEW):
  - Fetches specific goal by ID
  - Performs ownership check (403 if user doesn't own the goal)
  - Returns 404 if goal doesn't exist

### 4. Goal Service ([goal.service.ts](src/modules/goal/goal.service.ts))

- **`generateGoal`:**
  - Now requires `userId` in input
  - Stores `userId` in Firestore document
- **`getGoalsByUser`** (NEW):
  - Queries Firestore: `where('userId', '==', userId)`
  - Orders by creation date (newest first)
  - Returns empty array if no goals found
- **`getGoalById`** (NEW):
  - Fetches single goal by document ID
  - Returns `null` if not found

### 5. Goal Schema ([goal.schema.ts](src/modules/goal/goal.schema.ts))

- Added schemas for new endpoints:
  - `getUserGoalsSchema` - with 200/401 responses
  - `getGoalByIdSchema` - with 200/401/403/404 responses
- Updated `generateGoalSchema` with 401 error response

## Security Guarantees

✅ **User ID Source of Truth:** `req.user.uid` from Firebase Auth token  
✅ **No Body Injection:** `userId` never accepted from request body  
✅ **Authentication Required:** All routes use `preHandler: fastify.authenticate`  
✅ **Ownership Verification:** GET by ID checks `goal.userId === req.user.uid`  
✅ **Clean Error Handling:** 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

## Data Flow

```
1. Client sends request with Authorization: Bearer <token>
2. auth.plugin.ts verifies Firebase token
3. Decorates req.user = { uid, email, emailVerified }
4. Controller extracts userId = req.user.uid
5. Service stores/queries Firestore with userId
6. Firestore document: { id, userId, title, description, stages, createdAt }
```

## API Usage Examples

### Create Goal (Authenticated)

```http
POST /goals/generate
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "title": "Learn TypeScript",
  "description": "Master TypeScript fundamentals",
  "stages": [
    { "title": "Setup", "order": 1 },
    { "title": "Learn basics", "order": 2 }
  ]
}
```

### Get My Goals (Authenticated)

```http
GET /goals
Authorization: Bearer <firebase-token>
```

### Get Specific Goal (Authenticated + Ownership Check)

```http
GET /goals/{goalId}
Authorization: Bearer <firebase-token>
```

## Next Steps (Optional)

- Add goal update endpoint with ownership check
- Add goal deletion endpoint with ownership check
- Add goal stage completion tracking
- Add pagination for goal listing
- Add goal filtering/sorting options

## Testing Checklist

- [ ] Create goal without token → 401
- [ ] Create goal with valid token → 201 + goal stored with userId
- [ ] Get goals without token → 401
- [ ] Get goals with valid token → 200 + user's goals only
- [ ] Get goal by ID (not owned) → 403
- [ ] Get goal by ID (owned) → 200
- [ ] Get goal by ID (non-existent) → 404
- [ ] Verify Firestore documents contain userId field
