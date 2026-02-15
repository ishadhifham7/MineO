# MineO

MineO is a full-stack productivity and journaling application designed to help users manage goals, habits, journals, and moments. The project is organized into a monorepo structure with separate frontend (React Native/Expo) and backend (Node.js/Fastify) codebases.

## Features

- User authentication and authorization
- Goal and habit tracking
- Journaling with rich text and canvas support
- Moment and journey logging
- Modular, scalable backend with Fastify and plugins
- Modern frontend with React Native, NativeWind, and TypeScript
- State management with Redux
- API integration and service abstraction

## Project Structure

```
MineO/
├── app.json
├── package.json
├── client/           # Frontend (React Native/Expo)
│   ├── app/          # App screens and navigation
│   ├── assets/       # Images and static assets
│   ├── constants/    # App-wide constants
│   ├── src/          # Source code (components, features, hooks, services, etc.)
│   ├── store/        # Redux store setup
│   ├── types/        # TypeScript types
│   └── ...           # Config and setup files
├── server/           # Backend (Node.js/Fastify)
│   ├── src/          # Source code (modules, plugins, shared, etc.)
│   ├── types/        # TypeScript types
│   └── ...           # Config and setup files
└── ...               # Root-level configs
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Expo CLI (for frontend)
- Firebase account (for backend)

### Setup

#### 1. Clone the repository
```sh
git clone <repo-url>
cd MineO
```

#### 2. Install dependencies
```sh
npm install
cd client && npm install
cd ../server && npm install
```

#### 3. Configure Environment
- Copy and update environment files as needed in both `client/constants/env.ts` and `server/src/config/env.ts`.
- Set up Firebase credentials in the backend.

#### 4. Run the Backend
```sh
cd server
npm run dev
```

#### 5. Run the Frontend
```sh
cd client
npx expo start
```

## Scripts

- `npm run dev` (backend): Start Fastify server in development mode
- `npx expo start` (frontend): Start Expo development server

## Technologies Used

- **Frontend:** React Native, Expo, TypeScript, NativeWind, Redux
- **Backend:** Node.js, Fastify, TypeScript, Firebase
- **State Management:** Redux
- **Styling:** Tailwind CSS (NativeWind)
- **API:** RESTful endpoints

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

---

For more details, see the `README.md` files in the `client` and `server` directories.
