import axios from 'axios';

// Query the AI orchestrator backend. Always resolves to a normalized shape
// { response, command, offline } so callers never have to catch.
export async function queryAIOrchestrator(input) {
  try {
    const { data } = await axios.post('/api/orchestrator', { input }, { timeout: 10000 });
    // Backend may return only `command` (e.g. when no API key is configured);
    // synthesize a friendly response so the chat never looks empty.
    return {
      response: data.response || null,
      command: data.command || null,
      offline: false,
    };
  } catch (error) {
    // No serverless function in local dev, or the backend is down. Degrade to
    // local keyword mapping so the chat still answers portfolio questions.
    const command = localCommandMapping(input);
    return {
      response: command ? null : "I can help with my projects, skills, experience, and contact info. Try 'projects' or ask about OpenWISP.",
      command,
      offline: true,
    };
  }
}

// Local keyword → command fallback (used when the API is unreachable).
export function localCommandMapping(input) {
  const s = input.toLowerCase();
  if (/\b(skill|know|good at|stack|tech|language|python|linux|react)\b/.test(s)) return 'skills';
  if (/\b(about|who are you|yourself|background|openwisp|study)\b/.test(s)) return 'about';
  if (/\b(project|built|work|made|vegavath|semwork|automation|media)\b/.test(s)) return 'projects';
  if (/\b(contact|reach|email|linkedin|github|hire|available)\b/.test(s)) return 'contact';
  if (/\b(help|command|what can you do)\b/.test(s)) return 'help';
  return null;
}

export default queryAIOrchestrator;
