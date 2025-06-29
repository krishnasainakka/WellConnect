import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'; 
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function initializeChat(coach = null) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  // Default prompt if no coach is provided
  let systemPrompt = 'You are a helpful assistant. You know everything and can answer user queries very easily. Be calm, empathetic, and concise. Answer in not more than 2 lines';
  
  if (coach && coach.prompt) {
    systemPrompt = coach.prompt;
    // console.log("Assistant prompt: " + systemPrompt)
  }
  
  return await model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      }
    ]
  });
}

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1')  // italic
    .replace(/`(.*?)`/g, '$1')  // inline code
    .replace(/^#+\s+/gm, '')  // headers
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[.*?\]\(.*?\)/g, '') // links
    .trim();
}

export async function* streamGeminiResponse(chat, text) {
  const stream = await chat.sendMessageStream(text);
  for await (const chunk of stream.stream) {
    const t = chunk.text();
    if (t) yield stripMarkdown(t);
  }
}

export async function generateGeminiQuote() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an AI wellness mentor for working professionals. Generate a short, inspiring daily quote (1–2 sentences) related to employee wellness, mental clarity, stress management, communication, productivity, or growth mindset.

The tone should be motivational, empathetic, and encouraging — suitable for displaying on a workplace wellness dashboard.

Respond only in strict JSON format like this: 
{
  "text": "Your quote here"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Remove markdown code fences if present
    if (text.startsWith('```')) {
      text = text.replace(/```json|```/g, '').trim();
    }

    const json = JSON.parse(text);
    if (!json.text) throw new Error('Quote missing');

    return json;
  } catch (err) {
    console.error('Gemini quote generation error:', err);
    return {
      text: 'Take a deep breath. Progress starts with presence.',
    };
  }
}