ai Module — MineO Backend
Overview

The ai module in MineO is responsible for handling all AI-related functionality, specifically the AI Goal Planner feature. It provides a conversational endpoint for users to interact with an AI assistant that helps them clarify long-term goals, ask practical questions, and eventually generate structured goal stages.

Currently, the module supports:

AI chat endpoint (/api/v1/ai/chat)

System prompt-guided AI responses

Conversation history handling

Error handling and type safety

Free-tier Groq API integration

Folder Structure
ai/
├─ ai.controller.ts # Handles HTTP requests/responses for AI endpoints
├─ ai.service.ts # Communicates with Groq AI API (LLaMA model)
├─ ai.routes.ts # Registers AI endpoints to Fastify
├─ ai.prompts.ts # Contains the system prompt guiding AI behavior
├─ ai.types.ts # TypeScript types for messages, requests, and future goal stages
└─ README.md # Documentation for the AI module

Files Description

1. ai.types.ts

Purpose: Defines TypeScript types for all AI-related data.

Main Types:

AIMessage — represents a single message in a conversation.

ChatRequestBody — shape of the POST request body to /chat.

AIStage — type for future goal stage objects.

Example:

{
role: 'user' | 'system' | 'assistant',
content: 'Message text'
}

2. ai.prompts.ts

Purpose: Holds the system prompt that instructs the AI on how to behave.

Ensures consistent AI behavior.

Keeps AI responses concise, actionable, and relevant to goal planning.

Current system prompt:

You are an AI Goal Planner for the MineO app.

Your role:

- Help users clarify long-term goals through conversation
- Ask clear, practical questions
- Do NOT generate stages unless explicitly requested
- Keep responses concise and actionable

3. ai.service.ts

Purpose: Core AI service that interacts with Groq API.

Sends a structured conversation to the AI model and returns the AI’s text reply.

Uses llama-3.1-8b-instant free-tier model.

Handles errors like empty AI responses or API failures.

Key function:

export async function callAI(messages: AIMessage[]): Promise<string>

Accepts conversation messages.

Returns AI-generated text.

Throws an AppError if the AI fails.

4. ai.controller.ts

Purpose: Handles HTTP requests for AI-related endpoints.

Validates incoming requests.

Adds the system prompt to conversation.

Calls callAI() and returns AI’s response.

Handles errors consistently with AppError.

Endpoint: /api/v1/ai/chat (POST)

Request body example:

{
"conversation": [
{ "role": "user", "content": "I want to set a fitness goal" }
],
"message": "Help me make a plan"
}

Response example:

{
"message": "Sure! Let’s start by defining your fitness goals clearly..."
}

5. ai.routes.ts

Purpose: Registers AI endpoints with Fastify.

Validates request/response using Fastify’s schema validation.

Uses a plugin pattern for modular, versioned API.

Current registered route:

Method Path Description
POST /chat Chat with AI assistant

Full endpoint including API version: /api/v1/ai/chat

Current Flow

Frontend sends a POST request to /api/v1/ai/chat with:

Conversation history

New user message

Controller (ai.controller.ts) validates and structures the messages.

AI service (ai.service.ts) sends messages to Groq API.

AI responds with a text reply.

Controller sends the reply back to the frontend.

Features Implemented So Far

✅ AI conversation endpoint

✅ Free-tier Groq API integration (llama-3.1-8b-instant)

✅ System prompt to guide AI behavior

✅ TypeScript types for safety

✅ Request/response validation

✅ Error handling with AppError

✅ Modular Fastify route setup

✅ API versioning support (/api/v1)
