// src/modules/ai/ai.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { callAI } from './ai.service';
import { SYSTEM_PROMPT } from './ai.prompt';
import { AppError } from '../../shared/errors/app-error';
import { ChatRequestBody, AIMessage, DraftGoal, ChatResponse } from './ai.types';

/**
 * Safely detects and parses JSON from AI response
 * Returns { message, draftGoal } where draftGoal is null if no valid JSON found
 */
function parseAIResponse(aiReply: string): ChatResponse {
  let trimmed = aiReply.trim();

  console.log('=== AI Response Debug ===');
  console.log('Raw response length:', aiReply.length);
  console.log('First 150 chars:', trimmed.substring(0, 150));
  console.log('Last 50 chars:', trimmed.substring(trimmed.length - 50));

  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    trimmed = codeBlockMatch[1].trim();
    console.log('Extracted from markdown code block');
    console.log('Extracted JSON:', trimmed.substring(0, 100));
  }

  // Try to find JSON object anywhere in the response
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    trimmed = jsonMatch[0];
    console.log('Extracted JSON object from response');
  }

  console.log('After extraction - Starts with {:', trimmed.startsWith('{'));
  console.log('After extraction - Ends with }:', trimmed.endsWith('}'));

  // Try to detect if response is JSON
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);

      console.log('JSON parsed successfully!');
      console.log('Parsed keys:', Object.keys(parsed));

      // Validate structure matches DraftGoal
      const hasValidStructure =
        parsed.title &&
        typeof parsed.title === 'string' &&
        parsed.description &&
        typeof parsed.description === 'string' &&
        Array.isArray(parsed.stages) &&
        parsed.stages.length > 0;

      console.log('Has title:', !!parsed.title, typeof parsed.title);
      console.log('Has description:', !!parsed.description, typeof parsed.description);
      console.log('Has stages array:', Array.isArray(parsed.stages));
      console.log('Stages count:', parsed.stages?.length);

      if (hasValidStructure) {
        const allStagesValid = parsed.stages.every(
          (stage: any) =>
            stage.title &&
            typeof stage.title === 'string' &&
            stage.description &&
            typeof stage.description === 'string' &&
            typeof stage.order === 'number'
        );

        console.log('All stages valid:', allStagesValid);

        if (allStagesValid) {
          const draftGoal: DraftGoal = {
            title: parsed.title,
            description: parsed.description,
            stages: parsed.stages,
          };

          console.log('✅ Valid DraftGoal detected!');
          console.log('DraftGoal:', JSON.stringify(draftGoal, null, 2));

          return {
            message: `Great! I've created a personalized plan for you: "${draftGoal.title}". Review the roadmap and save it when ready!`,
            draftGoal,
          };
        }
      }

      console.log('❌ JSON structure validation failed');
    } catch (error) {
      // JSON parsing failed, treat as regular message
      console.log('❌ Failed to parse AI response as JSON:', error);
    }
  }

  // Not JSON or invalid structure - return as conversational message
  console.log('Returning as regular message');
  return {
    message: aiReply,
    draftGoal: null,
  };
}

export async function chatWithAI(
  req: FastifyRequest<{ Body: ChatRequestBody }>,
  reply: FastifyReply
) {
  try {
    const { conversation, message } = req.body;

    if (!message || message.trim().length === 0) {
      throw new AppError('Message cannot be empty', 400);
    }

    const safeConversation: AIMessage[] = Array.isArray(conversation) ? conversation : [];

    const messages: AIMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...safeConversation,
      { role: 'user', content: message.trim() },
    ];

    const aiReply: string = await callAI(messages);

    // Parse AI response to detect structured goal plan
    const response = parseAIResponse(aiReply);

    console.log('=== Response being sent to client ===');
    console.log('Message:', response.message);
    console.log('DraftGoal:', response.draftGoal ? 'PRESENT' : 'NULL');
    if (response.draftGoal) {
      console.log('DraftGoal content:', JSON.stringify(response.draftGoal, null, 2));
    }

    return reply.send(response);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    req.log.error(error, 'AI chat error');
    throw new AppError('Failed to process AI request', 500);
  }
}
