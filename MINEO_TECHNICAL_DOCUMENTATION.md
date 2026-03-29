# MineO Technical Documentation (Viva Preparation)

## 1. Project Overview

### 1.1 What is MineO?

MineO is a gamified self-growth mobile app. It helps users improve their life through:

- journaling
- habit tracking
- AI-assisted goal planning
- a journey timeline to see progress over time

The app does not focus only on strict productivity. Its main focus is self-reflection, consistency, and personal satisfaction.

### 1.2 Main Purpose of the System

The system is built to:

- help users reflect on daily life
- help users build positive habits
- help users break big goals into small achievable stages
- keep user data private and secure through JWT authentication and user-based data isolation

### 1.3 High-Level User Flow

A typical user journey is:

1. User signs up or logs in.
2. App stores JWT token on device.
3. User creates journals, updates habits, and creates goals.
4. Frontend sends authenticated requests to backend.
5. Backend validates token, processes request, stores/retrieves data from Firestore.
6. Frontend updates UI with latest data.

---

## 2. System Architecture

### 2.1 Architecture Style

MineO uses a classic **3-layer architecture**:

- **Frontend (Client):** React Native (Expo)
- **Backend (API Server):** Node.js + Fastify + REST
- **Database:** Firestore (NoSQL)

There is also an **AI service integration** used for goal planning.

### 2.2 Frontend Layer (React Native + Expo)

Responsibilities:

- render screens and components
- collect user input
- call backend APIs with Axios
- store JWT token in AsyncStorage
- show success/error states to users

Important implementation points:

- API base URL is auto-detected for dev and configurable via env.
- Shared HTTP client attaches `Authorization: Bearer <token>` automatically.
- Feature modules call specific endpoints (`/auth`, `/journal`, `/habits`, `/goals`, `/journey`, `/ai`).

### 2.3 Backend Layer (Fastify)

Responsibilities:

- expose REST endpoints
- validate requests (schemas in modules)
- verify JWT on protected routes
- apply business logic in services
- read/write Firestore documents

Fastify setup includes:

- CORS support
- multipart/file upload support
- static file serving for uploads
- centralized error handler
- plugin-based architecture (`auth`, `firebase`, `zod`, `swagger`)

### 2.4 Database Layer (Firestore)

Firestore stores application data in collections such as:

- `users`
- `journalEntries`
- `goals`
- `dailyStates` (habits)

Key database design pattern:

- Every protected resource stores `userId`.
- Queries are filtered by `userId`.
- Ownership is checked before update/delete/read of sensitive resources.

### 2.5 AI Integration Layer

MineO includes AI chat/goal support:

- frontend sends chat messages to backend AI endpoint
- backend calls AI provider (Groq SDK in current implementation)
- backend parses AI output and can return structured goal draft JSON
- frontend can submit that structured plan to goal generation endpoint

### 2.6 Deployment View

- Backend is hosted on Render.
- Mobile app (Expo) uses deployed API URL in non-dev mode.
- In dev mode, API URL can be auto-detected from local network.

---

## 3. Data Flow (Very Important)

## 3.1 General Request-Response Cycle

### Step-by-step flow

1. User performs an action in frontend UI.
2. Frontend service prepares Axios request.
3. Request interceptor reads token from AsyncStorage.
4. Token is attached as `Authorization` header (for protected routes).
5. Request goes to backend endpoint.
6. Fastify route receives request and runs `preHandler` auth middleware (if protected).
7. Auth plugin verifies JWT and extracts `userId`.
8. Controller validates required fields and calls service.
9. Service executes business logic and Firestore operations.
10. Backend returns JSON response.
11. Frontend receives response and updates state/UI.

### Request header example

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
Content-Type: application/json
```

---

## 3.2 Example Data Flow: User Login

### Frontend side

1. User enters email and password on login screen.
2. Frontend calls `POST /auth/login`.
3. If successful, response contains JWT token.
4. Token is saved in AsyncStorage for future API calls.

### Backend side

1. Route receives email/password.
2. Service checks `users` collection by email.
3. Password is verified using `bcrypt.compare`.
4. If valid, backend creates JWT using `jsonwebtoken`.
5. Token is returned to frontend.

### Data storage

- User credentials:
  - password stored as hashed value
  - user profile stored in Firestore `users`
- JWT token:
  - stored on client device in AsyncStorage (`auth_token`)

### Example request/response

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "StrongPass123"
}
```

```json
{
  "token": "<jwt-token>"
}
```

---

## 3.3 Example Data Flow: Creating a Journal Entry

### Frontend side

1. User creates journal content (blocks, title, date, timeline pin option).
2. Frontend calls `POST /journal` with journal payload.
3. JWT is auto-attached in request header.

### Backend side

1. Auth middleware verifies token and injects `userId` into request.
2. Controller reads body and forwards to service.
3. Service creates unique `entryId`.
4. Service writes main journal entry to `journalEntries`.
5. Service writes each block into nested `canvasBlocks` subcollection.
6. Response returns created entry metadata.

### Data retrieval flow

When user opens a journal by date:

1. Frontend calls `GET /journal?date=YYYY-MM-DD`.
2. Backend queries `journalEntries` filtered by `userId` and `date`.
3. Backend fetches related blocks.
4. Backend returns merged object: entry + blocks.

### Example create request

```http
POST /api/v1/journal
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2026-03-29",
  "title": "Today I improved my routine",
  "isPinnedToTimeline": true,
  "blocks": [
    {
      "id": "b1",
      "type": "text",
      "content": "I completed my morning routine."
    }
  ]
}
```

### Example create response (simplified)

```json
{
  "id": "entry-uuid",
  "userId": "user-123",
  "date": "2026-03-29",
  "title": "Today I improved my routine",
  "isPinnedToTimeline": true,
  "createdAt": 1711711717,
  "updatedAt": 1711711717
}
```

---

## 3.4 Example Data Flow: AI Goal Generation

This flow happens in two stages.

### Stage A: AI conversation produces structured draft

1. User chats with AI in frontend.
2. Frontend sends `conversation` and latest `message` to `POST /ai/chat`.
3. Backend creates prompt + conversation and calls AI provider.
4. Backend parses AI response.
5. If response contains valid JSON goal structure, backend returns:
   - conversational `message`
   - `draftGoal` object (`title`, `description`, `stages`)

### Stage B: Save generated goal in database

1. User confirms the generated draft.
2. Frontend sends draft to `POST /goals/generate` (protected route).
3. Backend attaches authenticated `userId`.
4. Backend creates goal + stage IDs and stores in Firestore `goals`.
5. Backend returns created goal to frontend.

### Example AI chat request

```http
POST /api/v1/ai/chat
Content-Type: application/json

{
  "conversation": [
    { "role": "user", "content": "I want to improve fitness" }
  ],
  "message": "Can you break this into stages?"
}
```

### Example AI chat response with draftGoal

```json
{
  "message": "Great! I've created a personalized plan for you...",
  "draftGoal": {
    "title": "Achieve fitness journey",
    "description": "A personalized roadmap...",
    "stages": [{ "title": "Getting Started", "description": "...", "order": 1 }]
  }
}
```

---

## 4. Feature Breakdown (Very Important)

## 4.1 Authentication System

### What it does

- Handles signup and login.
- Issues JWT token for authenticated access.
- Protects private routes.

### How it works internally

- Signup:
  - checks email uniqueness in Firestore
  - creates unique username
  - hashes password with bcrypt
  - stores user profile in `users`
  - returns token (auto-login flow)
- Login:
  - fetches user by email
  - validates password hash
  - signs JWT with user ID and email

### Frontend to backend interaction

- `POST /auth/signup`
- `POST /auth/login`

After login/signup:

- token stored in AsyncStorage
- request interceptors attach token to protected endpoints

### Backend processing

- auth routes call auth service
- auth plugin validates token on protected APIs
- `request.user.uid` is used as trusted identity

### Data storage and retrieval

- `users` collection stores profile + hashed password
- token is not stored in Firestore (stateless JWT on client)

---

## 4.2 Journal Feature

### What it does

- lets users create and edit daily journal entries
- supports block-based content
- supports searching/listing entries and dates
- supports timeline pin metadata

### How it works internally

- Main entry metadata stored in `journalEntries` document.
- Canvas blocks stored as subcollection under entry.
- Update flow can replace all blocks in batch.
- Ownership checks prevent cross-user access.

### Frontend to backend interaction

Common calls:

- `GET /journal?date=...`
- `POST /journal`
- `PUT /journal/:entryId/canvas`
- `PATCH /journal/:entryId/meta`
- `GET /journal/all`
- `GET /journal/dates`
- `GET /journal/all-by-date?date=...`

### Backend processing

- `preHandler: authenticate` enforces login
- controller extracts `userId` from JWT
- service queries Firestore with `where('userId', '==', userId)`

### Data storage and retrieval

- Collection: `journalEntries`
- Nested blocks in entry subcollection
- Dates list is generated from entry docs (`select('date')`)

---

## 4.3 Habit Tracker

### What it does

- tracks daily habit scores by categories:
  - mental
  - physical
  - spiritual
- provides monthly calendar view
- provides radar summary view

### How it works internally

- Uses `dailyStates` collection.
- Document ID pattern: `{userId}_{date}` to avoid collisions.
- Daily updates are upsert operations (`set(..., { merge: true })`).
- Radar computes category color/state counts from date range.

### Frontend to backend interaction

- `PATCH /habits/daily/:date`
- `GET /habits/calendar?month=YYYY-MM`
- `GET /habits/radar?start=YYYY-MM-DD&end=YYYY-MM-DD`

### Backend processing

- controller checks authenticated user
- service filters all reads by `userId`
- timestamps are converted to suitable frontend date strings

### Data storage and retrieval

- Collection: `dailyStates`
- Fields include date, category values, userId, timestamps
- calendar endpoint returns object keyed by date for UI-friendly rendering

---

## 4.4 AI Goal Tracker

### What it does

- helps users build goal plans with AI assistance
- saves generated plans as real goals with stages
- tracks stage completion

### How it works internally

There are two related modules:

- **AI module**
  - chat endpoint receives conversation
  - calls AI provider (or mock fallback)
  - parses and validates JSON-like draft plan from response
- **Goal module**
  - stores goal and stages in Firestore
  - supports fetch, fetch by ID, delete
  - supports toggling stage completion

### Frontend to backend interaction

- `POST /ai/chat`
- `POST /goals/generate`
- `GET /goals`
- `GET /goals/:id`
- `PATCH /goals/:goalId/stages/:stageId`
- `DELETE /goals/:goalId`

### Backend processing

- goal endpoints are protected by JWT middleware
- backend ensures `userId` comes from JWT, not request body
- backend verifies ownership for read/update/delete of specific goal

### Data storage and retrieval

- Collection: `goals`
- Goal document contains title, description, createdAt, `userId`, and stages array

---

## 4.5 Journey Map

### What it does

- provides timeline/history view of user journey
- shows journal-based progress points over time

### How it works internally

- journey service reads journal entries for current user
- entries are sorted in memory by date ascending
- transformed into timeline node format

### Frontend to backend interaction

- `GET /journey/timeline`

### Backend processing

- protected route with auth preHandler
- controller gets `userId` from token
- repository queries `journalEntries` filtered by `userId`

### Data storage and retrieval

- Source data: `journalEntries`
- timeline node contains id, date, optional title, updatedAt

---

## 5. API Design

### 5.1 API Style

MineO backend follows REST principles:

- clear resource-based endpoints (`/auth`, `/journal`, `/goals`, etc.)
- HTTP methods represent action:
  - `GET` for read
  - `POST` for create
  - `PATCH/PUT` for update
  - `DELETE` for remove

### 5.2 Versioning

Client is configured to use versioned base URL:

- `/api/v1`

This allows safe future changes (for example introducing `/api/v2` later).

### 5.3 Authentication Pattern

Protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

If token is missing/invalid:

- backend returns `401 Unauthorized`

### 5.4 Example Endpoint Summary

#### Authentication

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`

#### Journal

- `GET /api/v1/journal?date=YYYY-MM-DD`
- `POST /api/v1/journal`
- `PUT /api/v1/journal/:entryId/canvas`
- `PATCH /api/v1/journal/:entryId/meta`

#### Habits

- `PATCH /api/v1/habits/daily/:date`
- `GET /api/v1/habits/calendar?month=YYYY-MM`
- `GET /api/v1/habits/radar?start=...&end=...`

#### Goals + AI

- `POST /api/v1/ai/chat`
- `POST /api/v1/goals/generate`
- `GET /api/v1/goals`
- `PATCH /api/v1/goals/:goalId/stages/:stageId`

#### Journey

- `GET /api/v1/journey/timeline`

### 5.5 Example Error Response Format

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

## 6. Key Libraries and Why They Were Used

### Frontend Libraries

- **React Native + Expo**
  - cross-platform mobile app development
  - faster student-friendly setup and testing
- **Expo Router**
  - file-based routing for cleaner navigation structure
- **Axios**
  - simple and consistent HTTP calls
  - interceptors make JWT token handling easy
- **AsyncStorage**
  - local persistent storage for auth token

### Backend Libraries

- **Fastify**
  - high performance and plugin-based backend framework
- **@fastify/cors**
  - controls cross-origin access
- **@fastify/multipart**
  - file upload handling
- **@fastify/static**
  - serves uploaded files
- **jsonwebtoken**
  - JWT token creation and validation
- **bcryptjs**
  - secure password hashing
- **zod**
  - runtime input validation and schema safety

### Database and Cloud

- **firebase-admin (Firestore)**
  - NoSQL storage for users, journals, habits, goals
  - flexible schema for evolving product features

### AI

- **groq-sdk**
  - AI chat completion calls
  - used to generate structured goal drafts

---

## 7. Conclusion

MineO is a well-structured full-stack mobile system built for personal growth. The architecture cleanly separates frontend, backend, and database responsibilities.

Key strengths of the implementation:

- clear modular backend design
- secure JWT-based route protection
- user-isolated Firestore queries with ownership checks
- flexible feature modules (journal, habits, goals, journey)
- AI-assisted goal planning integrated into normal app workflow

For viva preparation, remember this main idea:

- **MineO is not just a UI app.** It is a complete end-to-end system where each user action goes through authenticated API layers, business logic, and secure data persistence, then returns structured results to the mobile client.

---

## Quick Revision Checklist (for Team)

- Can you explain how JWT is created, stored, and verified?
- Can you explain the full flow of creating and reading a journal?
- Can you explain how habit calendar/radar data is computed?
- Can you explain AI chat output vs goal persistence as two separate steps?
- Can you explain how `userId` protects all private data queries?
