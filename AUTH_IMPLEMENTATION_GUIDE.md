# Auth Context Implementation Guide

## 📁 File Locations

### Created Files:

1. **`src/providers/AuthProvider.tsx`** - Main AuthProvider with Context API
2. **`src/hooks/useAuth.ts`** - Custom hook for accessing auth context
3. **`app/_layout.tsx`** - Updated to wrap app with AuthProvider
4. **`EXAMPLE_AUTH_USAGE.tsx`** - Example component showing usage patterns

### Modified Files:

1. **`app/auth/login.tsx`** - Added `refreshAuth()` call after login
2. **`app/auth/register.tsx`** - Added `refreshAuth()` call after signup

---

## 🏗️ Architecture Overview

### Data Flow:

```
Login/Signup → JWT Token saved to AsyncStorage
                      ↓
            AuthProvider reads token
                      ↓
            JWT decoded using jwt-decode
                      ↓
            Extract { userId, email }
                      ↓
            Store in Context State
                      ↓
            Available globally via useAuth()
```

### Context Structure:

```typescript
{
  user: { userId: string, email: string } | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  refreshAuth: () => Promise<void>,
  logout: () => Promise<void>
}
```

---

## 🔐 How It Works

### 1. **Initial Load (App Start)**

- AuthProvider mounts when app starts
- Automatically retrieves token from AsyncStorage
- Decodes JWT to extract `userId` and `email`
- Checks if token is expired
- Sets user state if valid, or clears token if expired

### 2. **After Login/Signup**

- Backend returns JWT token
- Token is saved via `saveToken()`
- `refreshAuth()` is called to update context immediately
- User is now globally accessible

### 3. **Token Expiration Handling**

- JWT expiration is checked on load
- If expired, token is removed and user is logged out
- Error message is set in context

### 4. **Logout**

- Call `logout()` from context
- Removes token from AsyncStorage
- Clears user state

---

## 💻 How to Use

### Basic Usage in Any Component:

```typescript
import { useAuth } from "../src/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    return <Text>Please login</Text>;
  }

  // Access user ID anywhere!
  console.log("User ID:", user.userId);
  console.log("Email:", user.email);

  return <Text>Welcome, {user.email}</Text>;
}
```

### Access User ID for API Calls:

```typescript
import { useAuth } from "../src/hooks/useAuth";
import axios from "axios";

function CreateGoal() {
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user) return;

    await axios.post("/api/goals", {
      userId: user.userId, // ✅ Use this for backend requests
      title: "My Goal",
    });
  };
}
```

### Logout Example:

```typescript
import { useAuth } from "../src/hooks/useAuth";

function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <View>
      <Text>Logged in as: {user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
```

### Protected Routes Pattern:

```typescript
import { useAuth } from "../src/hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";

function ProtectedScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return <View>{/* Your protected content */}</View>;
}
```

---

## 🔄 Integration with Login Flow

### Before (login.tsx):

```typescript
await loginUser(email, password);
router.replace("/tabs/home");
```

### After (login.tsx):

```typescript
await loginUser(email, password);
await refreshAuth(); // ✅ Updates context with user data
router.replace("/tabs/home");
```

Now when you navigate to `/tabs/home`, the `useAuth()` hook will have the user data available immediately!

---

## ⚡ Key Features

✅ **Automatic token loading on app start**
✅ **JWT expiration checking**
✅ **Type-safe with TypeScript**
✅ **Error handling for invalid tokens**
✅ **Loading states for smooth UX**
✅ **Follows project's existing patterns** (matches GoalProvider structure)
✅ **No conflicts with other contexts**
✅ **Scalable logout functionality**

---

## 🎯 Quick Access Cheatsheet

```typescript
import { useAuth } from "../src/hooks/useAuth";

const {
  user, // { userId: string, email: string } | null
  isAuthenticated, // boolean - true if user logged in
  isLoading, // boolean - true while checking token
  error, // string | null - auth errors
  refreshAuth, // () => Promise<void> - refresh user data
  logout, // () => Promise<void> - logout user
} = useAuth();

// Get user ID:
console.log(user?.userId);

// Get email:
console.log(user?.email);

// Check if logged in:
if (isAuthenticated) {
  /* ... */
}
```

---

## 🚨 Important Notes

1. **Always check `isLoading` before `isAuthenticated`** to avoid flashing content
2. **Token is stored in AsyncStorage** - persists across app restarts
3. **JWT contains `userId` (Firestore doc ID)** and `email`
4. **Token expiration is 3 days** (set in backend)
5. **No Firebase client SDK required** - all auth is backend-based
6. **Context refreshes on every app restart** automatically

---

## 📝 What's Different from Firebase Client Auth?

| Feature            | Firebase Client     | This Implementation    |
| ------------------ | ------------------- | ---------------------- |
| Auth SDK           | Uses Firebase SDK   | No Firebase on client  |
| Token Type         | Firebase ID Token   | Backend JWT            |
| Storage            | Firebase handles it | Manual AsyncStorage    |
| User Data          | From Firebase Auth  | Decoded from JWT       |
| onAuthStateChanged | Built-in listener   | Manual context refresh |
| UID Source         | Firebase UID        | Firestore doc ID       |

---

## 🐛 Troubleshooting

**User is null after login?**

- Make sure you call `await refreshAuth()` after login/signup
- Check if token was saved: `console.log(await getToken())`

**Token expired error?**

- JWT has 3-day expiration
- User needs to login again
- Consider implementing refresh tokens if needed

**Context not updating?**

- Ensure AuthProvider wraps your app in `_layout.tsx`
- Check that you're calling `refreshAuth()` after auth actions

---

## 🎉 You're All Set!

You can now access `user.userId` and `user.email` from any component in your app using the `useAuth()` hook!
