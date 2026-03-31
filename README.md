🚀 MineO

A full-stack mobile application for self-growth, combining journaling, habit tracking, goal management, and AI-driven personalization.

📌 Overview

MineO is designed to help users understand themselves, track their growth, and take meaningful action.

Unlike traditional productivity apps, MineO connects:

Reflection (journaling)
Measurement (habit tracking)
Execution (goal planning)

into one unified system.

🎯 Key Features
📝 Daily Journal
One structured entry per day
Supports reflective inputs (thoughts, experiences, feelings)
Serves as the core data source for personalization
📊 Habit Tracker
Tracks habits across:
Mental
Physical
Spiritual
Based on user satisfaction, not just completion
Weekly insights visualized through charts
🎯 Goal Management System
Users can define long-term goals
System organizes them into manageable progress units
Integrated with AI for smarter planning
🤖 AI Goal Planning Assistant
Built using LLaMA 3.1 API
Converts user goals + journal context into:
Structured stages
Actionable tasks
Step-by-step plans

👉 Focused on execution, not conversation

🗺️ Journey Map
Visual S-shaped timeline of user progress
Represents natural ups and downs in growth
Displays milestones and achievements
🏗️ System Architecture
Mobile App (React Native - Expo)
        ↓
REST API (Node.js / Express)
        ↓
Database (MongoDB)
        ↓
AI Layer (LLaMA 3.1 API)
⚙️ Tech Stack

Frontend

React Native (Expo)
Component-based architecture
Expo Router (file-based navigation)

Backend

Node.js + Express
RESTful API design
Modular architecture (routes, controllers, services)

Database

MongoDB (NoSQL)

AI Integration

LLaMA 3.1 API
Dynamic prompt engineering using user data

Deployment

Render (backend hosting)
Expo EAS (mobile builds)
🔧 Key Technical Highlights
Implemented full CRUD operations for:
Journals
Habits
Goals
Designed scalable REST API architecture
Built AI integration pipeline:
Context-aware prompt generation
Response parsing into structured goal plans
Developed custom UI logic:
S-shaped journey visualization
Chart-based habit insights
Managed asynchronous workflows for API and AI responses
🚧 Challenges & Solutions

AI Response Structuring

Problem: Unstructured outputs
Solution: Parsing and formatting into usable data

Backend Cold Start (Render)

Problem: Initial request delay
Solution: Periodic HTTP ping to keep server active

Journey Map Visualization

Problem: Representing realistic growth
Solution: Custom curve-based UI design
▶️ Setup
# Install dependencies
npm install

# Run frontend
cd client
npm start

# Run backend
cd server
npm run dev
📈 Future Improvements
Advanced AI personalization
Persistent user context (memory)
Performance optimization
Offline journaling support
💼 Project Value

MineO demonstrates:

End-to-end full-stack mobile development
Real-world AI integration (LLaMA 3.1)
Strong system design and architecture
Focus on user-centered product thinking
⚡ One-Line Pitch

MineO is a full-stack mobile app that combines journaling, habit tracking, and AI-driven goal planning to turn user reflection into actionable growth.
