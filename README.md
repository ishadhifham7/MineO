🚀 MineO

A full-stack mobile application for self-growth, combining journaling, habit tracking, goal management, and AI-driven personalization.

📌 Overview

MineO is designed to help users understand themselves, track their growth, and take meaningful action.

Unlike traditional productivity apps, MineO connects:

Layer	Description
📝 Reflection	Journaling
📊 Measurement	Habit tracking
🎯 Execution	Goal planning

➡️ into one unified system.

🎯 Key Features
📝 Daily Journal
	
Entries	One structured entry per day
Input Type	Thoughts, experiences, feelings
Purpose	Core data source for personalization
📊 Habit Tracker
	
Categories	Mental • Physical • Spiritual
Tracking Method	Based on user satisfaction
Output	Weekly insights via charts
🎯 Goal Management System
	
Goal Type	Long-term goals
Structure	Broken into manageable units
Enhancement	Integrated with AI
🤖 AI Goal Planning Assistant
	
Model	LLaMA 3.1 API
Input	User goals + journal context
Output	Structured stages, tasks, step-by-step plans

👉 Focused on execution, not conversation

🗺️ Journey Map
	
Visualization	S-shaped timeline
Purpose	Represent real-life growth patterns
Elements	Milestones, achievements
🏗️ System Architecture
Mobile App (React Native - Expo)
        ↓
REST API (Node.js / Express)
        ↓
Database (MongoDB)
        ↓
AI Layer (LLaMA 3.1 API)
⚙️ Tech Stack
Layer	Technology
Frontend	React Native (Expo), Expo Router
Backend	Node.js, Express
Database	MongoDB (NoSQL)
AI Integration	LLaMA 3.1 API, Prompt Engineering
Deployment	Render, Expo EAS
🔧 Key Technical Highlights
Full CRUD operations implemented for:
Journals
Habits
Goals
Scalable REST API architecture
AI integration pipeline
Context-aware prompt generation
Response parsing into structured goal plans
Custom UI logic
S-shaped journey visualization
Chart-based habit insights
Asynchronous workflows for API and AI responses
🚧 Challenges & Solutions
Challenge	Problem	Solution
AI Response Structuring	Unstructured outputs	Parsing & formatting layer
Backend Cold Start (Render)	Initial request delay	Periodic HTTP ping
Journey Map Visualization	Representing realistic growth	Custom curve-based UI
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
User-centered product thinking
⚡ One-Line Pitch

MineO is a full-stack mobile app that combines journaling, habit tracking, and AI-driven goal planning to turn user reflection into actionable growth.
