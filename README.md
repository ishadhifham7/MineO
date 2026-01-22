# MineO Backend API

> A modern, scalable backend API for MineO - Personal Growth & Productivity Platform

Built with **Fastify**, **TypeScript**, and **Firebase**.

## 🚀 Features

- ⚡ **Fast & Efficient** - Built on Fastify for maximum performance
- 🔒 **Secure** - Firebase Authentication with JWT
- 📝 **Type-Safe** - Full TypeScript support with strict typing
- ✅ **Validation** - Zod schema validation for all requests
- 📚 **Documentation** - Auto-generated Swagger/OpenAPI docs
- 🔥 **Firebase** - Firestore database integration
- 🎯 **Modular** - Clean architecture with domain-driven design
- 🛡️ **Error Handling** - Comprehensive error handling system

## 📁 Project Structure

```
src/
├── app.ts                    # Fastify app configuration
├── server.ts                 # Server bootstrap
├── routes.ts                 # Central route registration
│
├── config/                   # Configuration files
│   ├── env.ts               # Environment variables
│   ├── firebase.ts          # Firebase initialization
│   └── auth.ts              # Auth configuration
│
├── plugins/                  # Fastify plugins
│   ├── firebase.plugin.ts   # Firebase integration
│   ├── auth.plugin.ts       # Authentication middleware
│   ├── zod.plugin.ts        # Validation plugin
│   └── swagger.plugin.ts    # API documentation
│
├── modules/                  # Feature modules
│   ├── auth/                # Authentication module
│   ├── user/                # User management
│   ├── journal/             # Journal entries
│   ├── moment/              # Daily moments
│   ├── habit/               # Habit tracking
│   └── goal/                # Goal setting
│
├── shared/                   # Shared utilities
│   ├── errors/              # Error classes & handlers
│   ├── guards/              # Authorization guards
│   ├── utils/               # Helper functions
│   └── constants/           # App constants
│
└── types/                    # TypeScript declarations
    └── fastify.d.ts         # Fastify type extensions
```

## 🛠️ Setup

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MineO
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:

   ```env
   NODE_ENV=development
   PORT=3000

   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

   JWT_SECRET=your-super-secret-key
   ```

4. **Set up Firebase**
   - Create a Firebase project
   - Enable Firestore Database
   - Download service account credentials
   - Add credentials to `.env`

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Server runs on `http://localhost:3000`

API Documentation available at `http://localhost:3000/docs`

### Production Build

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check

```
GET /health
```

### API v1

All API endpoints are prefixed with `/api/v1`

```
GET  /api/v1                    # API info
GET  /api/v1/auth/*            # Authentication routes
GET  /api/v1/users/*           # User routes
GET  /api/v1/journals/*        # Journal routes
GET  /api/v1/moments/*         # Moment routes
GET  /api/v1/habits/*          # Habit routes
GET  /api/v1/goals/*           # Goal routes
```

## 🔐 Authentication

All protected routes require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

Example request:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/users/me
```

## 🧪 Development

### Code Quality

**Linting**

```bash
npm run lint          # Check for issues
npm run lint:fix      # Fix issues automatically
```

**Type Checking**

```bash
npm run build         # Builds and checks types
```

### Architecture Principles

1. **No Firestore calls in controllers** - Use services
2. **No cross-module DB access** - Keep modules isolated
3. **Always validate input** - Use Zod schemas
4. **Every document must have userId** - For security
5. **Use ownership guards** - Protect resources

### Adding a New Module

1. Create module folder in `src/modules/`
2. Add required files:
   - `*.model.ts` - Data models
   - `*.routes.ts` - Route definitions
   - `*.controller.ts` - Request handlers
   - `*.service.ts` - Business logic
   - `*.schema.ts` - Validation schemas
3. Register routes in `src/routes.ts`

## 📦 Dependencies

### Core

- **fastify** - Web framework
- **firebase-admin** - Firebase SDK
- **zod** - Schema validation
- **dotenv** - Environment configuration

### Plugins

- **@fastify/cors** - CORS support
- **@fastify/swagger** - API documentation
- **@fastify/swagger-ui** - Swagger UI

### Development

- **typescript** - Type safety
- **nodemon** - Auto-restart
- **eslint** - Code linting
- **prettier** - Code formatting

## 🔧 Environment Variables

| Variable                | Description                          | Required           |
| ----------------------- | ------------------------------------ | ------------------ |
| `NODE_ENV`              | Environment (development/production) | No                 |
| `PORT`                  | Server port                          | No (default: 3000) |
| `FIREBASE_PROJECT_ID`   | Firebase project ID                  | Yes                |
| `FIREBASE_CLIENT_EMAIL` | Service account email                | Yes                |
| `FIREBASE_PRIVATE_KEY`  | Service account private key          | Yes                |
| `JWT_SECRET`            | Secret for JWT signing               | Yes                |

## 📝 Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start development server with hot reload |
| `npm start`        | Start production server                  |
| `npm run build`    | Build TypeScript to JavaScript           |
| `npm run lint`     | Run ESLint                               |
| `npm run lint:fix` | Fix linting issues                       |

## 🚨 Error Handling

The API uses consistent error responses:

```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": [] // Optional additional info
}
```

Common error types:

- `ValidationError` (400) - Invalid input data
- `UnauthorizedError` (401) - Missing or invalid token
- `ForbiddenError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource already exists
- `InternalServerError` (500) - Server error

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript strict mode
3. Add proper error handling
4. Validate all inputs with Zod
5. Document your code
6. Test your changes

## 📄 License

This project is proprietary and confidential.

## 👥 Authors

MineO Development Team

---

Built with ❤️ using Fastify and Firebase
