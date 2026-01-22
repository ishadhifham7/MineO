# Development Quick Start

## 🏃 Getting Started

### First Time Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual values

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Visit the API**
   - API: http://localhost:3000/api/v1
   - Health: http://localhost:3000/health
   - Docs: http://localhost:3000/docs

## 🔧 Available Commands

```bash
npm run dev         # Start dev server with hot reload
npm run build       # Compile TypeScript to JavaScript
npm start           # Run production server
npm run lint        # Check code quality
npm run lint:fix    # Auto-fix linting issues
```

## 🧪 Testing the Setup

### 1. Check Health Endpoint

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-22T...",
  "environment": "development"
}
```

### 2. Check API Info

```bash
curl http://localhost:3000/api/v1
```

Expected response:

```json
{
  "message": "MineO API v1",
  "version": "1.0.0"
}
```

### 3. View API Documentation

Open browser: http://localhost:3000/docs

## 🔐 Firebase Setup

### Get Firebase Credentials

1. Go to Firebase Console
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Extract these values to `.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

### Environment File Example

```env
NODE_ENV=development
PORT=3000

FIREBASE_PROJECT_ID=my-project-123
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@my-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...Your Key Here...=\n-----END PRIVATE KEY-----\n"

JWT_SECRET=your-random-secret-key-change-this
```

## 📝 Module Development

### Creating a New Module

1. **Create module structure**

   ```
   src/modules/my-module/
   ├── my-module.model.ts      # Data types
   ├── my-module.routes.ts     # Routes
   ├── my-module.controller.ts # Handlers
   ├── my-module.service.ts    # Business logic
   └── my-module.schema.ts     # Validation
   ```

2. **Example Route File**

   ```typescript
   import { FastifyPluginAsync } from 'fastify';

   const myModuleRoutes: FastifyPluginAsync = async (fastify) => {
     fastify.get('/', async (request, reply) => {
       return { message: 'My Module' };
     });
   };

   export default myModuleRoutes;
   ```

3. **Register in routes.ts**

   ```typescript
   import myModuleRoutes from './modules/my-module/my-module.routes';

   // In registerRoutes function:
   await apiV1.register(myModuleRoutes, { prefix: '/my-module' });
   ```

## 🛡️ Adding Authentication

### Protected Route Example

```typescript
fastify.get(
  '/protected',
  {
    onRequest: [fastify.authenticate],
  },
  async (request, reply) => {
    const userId = request.user!.uid;
    return { message: `Hello ${userId}` };
  }
);
```

### Get Current User

```typescript
const currentUser = request.user; // Available after authentication
// { uid: string, email?: string, emailVerified?: boolean }
```

## ✅ Validation Example

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18),
});

fastify.post('/users', async (request, reply) => {
  const data = fastify.validate(CreateUserSchema, request.body);
  // data is now typed and validated
});
```

## 🗄️ Firestore Usage

```typescript
import { COLLECTIONS } from '../shared/constants/collections';
import { withTimestamps } from '../shared/utils/firestore';

// In service file
const db = fastify.firestore;

// Create document
const newUser = withTimestamps({
  userId: request.user!.uid,
  name: 'John Doe',
});

await db.collection(COLLECTIONS.USERS).add(newUser);

// Query documents
const snapshot = await db.collection(COLLECTIONS.USERS).where('userId', '==', userId).get();
```

## 🐛 Debugging Tips

### View Logs

All requests are automatically logged with detailed information in development.

### Check TypeScript Errors

```bash
npm run build
```

### Check Linting

```bash
npm run lint
```

### Common Issues

**Port already in use**

```bash
# Change PORT in .env
PORT=3001
```

**Firebase auth fails**

- Check `.env` credentials are correct
- Verify no extra spaces or quotes
- Ensure private key includes `\n` characters

**Module not found**

- Run `npm install`
- Check import paths
- Restart dev server

## 📚 Additional Resources

- [Fastify Documentation](https://www.fastify.io/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎯 Best Practices

1. ✅ Always validate request data with Zod
2. ✅ Use type-safe Firestore helpers
3. ✅ Add `userId` to all user documents
4. ✅ Use ownership guards for resource access
5. ✅ Handle errors with custom error classes
6. ✅ Keep business logic in services
7. ✅ Keep Firestore calls in services only
8. ✅ Document your code with JSDoc

---

Happy coding! 🚀
