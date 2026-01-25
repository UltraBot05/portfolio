import axios from 'axios';

// This function queries the AI orchestrator backend
export async function queryAIOrchestrator(input) {
  try {
    // In development, use local backend
    // In production (Vercel), use serverless function
    const apiUrl = import.meta.env.PROD 
      ? '/api/orchestrator'
      : 'http://localhost:3001/api/orchestrator';

    const response = await axios.post(apiUrl, {
      input: input
    }, {
      timeout: 10000 // 10 second timeout
    });

    return response.data;
  } catch (error) {
    console.error('AI Orchestrator API error:', error);
    
    // If AI fails, return a fallback
    return {
      command: null,
      response: `I couldn't process that request. Type "help" to see available commands.`
    };
  }
}

// Fallback local processing if backend is unavailable
export function localCommandMapping(input) {
  const lowerInput = input.toLowerCase();
  
  // Simple keyword matching as fallback
  if (lowerInput.includes('skill') || lowerInput.includes('can you') || lowerInput.includes('what do you know')) {
    return 'skills';
  }
  
  if (lowerInput.includes('about') || lowerInput.includes('who are you') || lowerInput.includes('tell me about yourself')) {
    return 'about';
  }
  
  if (lowerInput.includes('project') || lowerInput.includes('built') || lowerInput.includes('work')) {
    return 'projects';
  }
  
  if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('email') || lowerInput.includes('linkedin')) {
    return 'contact';
  }
  
  if (lowerInput.includes('help') || lowerInput.includes('command')) {
    return 'help';
  }
  
  return null;
}

export default queryAIOrchestrator;
