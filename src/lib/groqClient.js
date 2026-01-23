
import Groq from 'groq-sdk';

// Initialize Groq with the user's provided key
// In a production app, this should come from process.env or a secure backend proxy
export const groq = new Groq({
    // Priority: Env Var -> LocalStorage -> Empty
    apiKey: import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || '',
    dangerouslyAllowBrowser: true // Required for client-side usage
});

export const SYSTEM_PROMPT = `
You are an expert VEX V5 Robotics Scout Assistant. 
You have access to a database of team analysis ("RAG Context").
Your goal is to help the user pick the best alliance partners, understand enemy strategies, and find weaknesses.
Always reference specific team numbers (e.g., "1234A") and their data when answering.
If data is missing for a team, say so.
Be concise, strategic, and professional.
`;
