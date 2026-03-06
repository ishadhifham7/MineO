// src/modules/ai/ai.service.ts

import Groq from 'groq-sdk';
import { AIMessage } from './ai.types';
import { AppError } from '../../shared/errors/app-error';
import { env } from '../../config/env';

// Check if we have a real GROQ API key
const hasRealGroqKey = 
  env.GROQ_API_KEY && 
  !env.GROQ_API_KEY.includes('mock') && 
  env.GROQ_API_KEY.length > 20;

const groq = hasRealGroqKey ? new Groq({
  apiKey: env.GROQ_API_KEY!,
}) : null;

/**
 * Mock AI response for development without GROQ API key
 */
function getMockAIResponse(messages: AIMessage[]): string {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  const userInput = lastUserMessage?.content?.toLowerCase() || '';

  console.log('🤖 Mock AI: Processing user input:', userInput.substring(0, 100));

  // Detect if user is asking to create a goal
  const isCreatingGoal = 
    userInput.includes('create') || 
    userInput.includes('goal') || 
    userInput.includes('want to') ||
    userInput.includes('help me') ||
    userInput.includes('build') ||
    userInput.includes('achieve') ||
    userInput.includes('learn');

  if (isCreatingGoal) {
    // Extract potential goal keywords
    let goalTopic = 'your goal';
    if (userInput.includes('fitness') || userInput.includes('exercise') || userInput.includes('workout')) {
      goalTopic = 'fitness journey';
    } else if (userInput.includes('learn') || userInput.includes('study') || userInput.includes('course')) {
      goalTopic = 'learning path';
    } else if (userInput.includes('career') || userInput.includes('job') || userInput.includes('work')) {
      goalTopic = 'career development';
    } else if (userInput.includes('habit') || userInput.includes('routine')) {
      goalTopic = 'habit building';
    }

    // Return a structured JSON goal
    return JSON.stringify({
      title: `Achieve ${goalTopic}`,
      description: `A personalized roadmap to help you succeed in ${goalTopic}. This plan breaks down your goal into manageable stages.`,
      stages: [
        {
          title: 'Getting Started',
          description: 'Set up the foundation and understand the basics',
          order: 1
        },
        {
          title: 'Build Momentum',
          description: 'Develop consistent habits and track progress',
          order: 2
        },
        {
          title: 'Level Up',
          description: 'Tackle intermediate challenges and expand skills',
          order: 3
        },
        {
          title: 'Master the Craft',
          description: 'Achieve proficiency and maintain long-term success',
          order: 4
        }
      ]
    }, null, 2);
  }

  // Conversational response
  const responses = [
    `I'm here to help you create and achieve your goals! What would you like to work on? For example, you could say "I want to improve my fitness" or "Help me learn programming".`,
    `Great question! To create a goal roadmap for you, tell me more about what you'd like to achieve. What's on your mind?`,
    `I can help you break down big goals into achievable steps. What specific goal would you like to work towards?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function callAI(messages: AIMessage[]): Promise<string> {
  // Use mock AI in development without real API key
  if (!hasRealGroqKey) {
    console.log('⚠️  Using Mock AI (no GROQ API key configured)');
    console.log('⚠️  To use real AI, add GROQ_API_KEY to server/.env');
    console.log('⚠️  Get free key at: https://console.groq.com/keys');
    return getMockAIResponse(messages);
  }

  // Real GROQ API call
  try {
    console.log('🤖 Calling GROQ AI with', messages.length, 'messages');
    const response = await groq!.chat.completions.create({
      model: 'llama-3.1-8b-instant', // Free-tier model
      messages,
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new AppError('AI returned empty response', 500);
    }

    console.log('✅ GROQ AI response received');
    return response.choices[0].message.content;
  } catch (error: any) {
    console.error('❌ GROQ AI error:', error.message);
    
    // Fall back to mock if API fails
    console.log('⚠️  Falling back to Mock AI due to API error');
    return getMockAIResponse(messages);
  }
}
