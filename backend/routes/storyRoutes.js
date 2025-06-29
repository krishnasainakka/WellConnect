import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'; 
dotenv.config();

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generateStoryPrompt = (userInput, genre) => {
  const basePrompt = `You are a caring and thoughtful storytelling coach. Your job is to turn real-life struggles into simple, heartwarming fictional stories that inspire and heal.

USER'S SITUATION: "${userInput}"
GENRE: ${genre}

YOUR TASK:
1. Write a short fictional story (about 2–3 minutes long) that reflects the user’s problem in a gentle, indirect way.
2. Use relatable characters with everyday emotions and situations.
3. Show how the main character learns, grows, or finds a new way forward.
4. Add small life lessons or helpful thoughts, but in a natural, story-like way.
5. End the story with hope, kindness, or a fresh perspective.
6. Make sure the story feels calming and is easy to read aloud.

STYLE:
- Just write the story — no instructions, labels, or sound effects.
- Use simple, clear language that anyone can understand.
- Use natural conversations and a friendly tone.
- Make it feel like someone is telling a warm story around a campfire.
- Focus on feelings, small details, and real human experiences.
- Avoid technical or dramatic writing — just pure, emotional storytelling.

TONE: ${getGenreTone(genre)}

Now, write the full story in a simple, heartfelt way. It should feel like you're gently guiding the listener through someone else's meaningful journey.`;

  return basePrompt;
};


const getGenreTone = (genre) => {
  const tones = {
    'Inspirational': 'Uplifting and motivational, with moments of quiet reflection and triumph',
    'Therapy Tale': 'Gentle and introspective, like a wise counselor sharing wisdom through narrative',
    'Workplace Drama': 'Professional yet human, showing realistic workplace dynamics with positive resolution',
    'Fable': 'Timeless and wise, using simple characters to convey profound life lessons',
    'Realistic': 'Authentic and relatable, grounded in everyday experiences with meaningful insights'
  };
  
  return tones[genre] || 'Warm, empathetic, and encouraging with natural conversational flow';
};

// Universal function to clean ANY AI-generated story text for TTS
const cleanStoryForTTS = (story) => {
  let cleanedStory = story;
  
  // 1. Remove ALL types of stage directions and scene markers
  cleanedStory = cleanedStory.replace(/\[.*?\]/g, ''); // Remove anything in square brackets
  cleanedStory = cleanedStory.replace(/\{.*?\}/g, ''); // Remove anything in curly brackets
  cleanedStory = cleanedStory.replace(/\(.*?(?:Sound|SFX|Music|Audio|Effect).*?\)/gi, ''); // Remove sound effects
  
  // 2. Remove titles and headers
  cleanedStory = cleanedStory.replace(/\*\*.*?TITLE.*?\*\*/gi, ''); 
  cleanedStory = cleanedStory.replace(/^#.*$/gm, ''); // Remove markdown headers
  cleanedStory = cleanedStory.replace(/^TITLE:.*$/gm, ''); // Remove title lines
  
  // 3. Convert ALL character dialogue patterns to narrative
  // Handles: "CHARACTER_NAME:", "CHARACTER (emotion):", "CHARACTER_NAME (action):"
  cleanedStory = cleanedStory.replace(/^([A-Z][A-Z\s_]+)(\s*\([^)]*\))?\s*:/gm, (match, character, direction) => {
    const name = character.toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
    
    // Handle special cases
    if (name === 'Narrator' || name === 'Voice Over') return '';
    
    return `${name} said, `;
  });
  
  // 4. Remove narrator labels and voice-over indicators
  cleanedStory = cleanedStory.replace(/^(NARRATOR|VOICE\s*OVER|V\.O\.|VO):?\s*/gmi, '');
  
  // 5. Remove all formatting markers
  cleanedStory = cleanedStory.replace(/\*\*\*/g, ''); // Remove triple asterisks
  cleanedStory = cleanedStory.replace(/\*\*/g, ''); // Remove double asterisks (bold)
  cleanedStory = cleanedStory.replace(/\*/g, ''); // Remove single asterisks (italic)
  cleanedStory = cleanedStory.replace(/_/g, ''); // Remove underscores
  cleanedStory = cleanedStory.replace(/~/g, ''); // Remove tildes
  
  // 6. Remove technical notes and instructions
  cleanedStory = cleanedStory.replace(/^.*?insights?.*?embedded.*?:?\s*$/gmi, ''); // Remove insight notes
  cleanedStory = cleanedStory.replace(/^.*?therapeutic.*?notes?.*?:?\s*$/gmi, ''); // Remove therapy notes
  cleanedStory = cleanedStory.replace(/^\s*[-•]\s*.*$/gm, ''); // Remove bullet points
  
  // 7. Clean up parenthetical actions and directions
  cleanedStory = cleanedStory.replace(/\([^)]*(?:whisper|shout|cry|laugh|sigh|gasp|pause|beat|moment)[^)]*\)/gi, '');
  
  // 8. Remove HTML tags if any
  cleanedStory = cleanedStory.replace(/<[^>]*>/g, '');
  
  // 9. Clean up whitespace and formatting
  cleanedStory = cleanedStory.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove excessive line breaks
  cleanedStory = cleanedStory.replace(/^\s+|\s+$/gm, ''); // Trim whitespace from lines
  cleanedStory = cleanedStory.replace(/\n{3,}/g, '\n\n'); // Limit consecutive line breaks
  cleanedStory = cleanedStory.replace(/\s+/g, ' '); // Clean up multiple spaces
  cleanedStory = cleanedStory.replace(/\n/g, ' '); // Convert all line breaks to spaces for smooth flow
  
  // 10. Final cleanup
  cleanedStory = cleanedStory.replace(/\s+/g, ' '); // Ensure single spaces
  cleanedStory = cleanedStory.replace(/([.!?])\s*([a-z])/g, '$1 $2'); // Ensure proper spacing after punctuation
  
  return cleanedStory.trim();
};

const detectMood = (story) => {
  const text = story.toLowerCase();
  
  if (text.includes('triumph') || text.includes('victory') || text.includes('achieved')) {
    return 'triumphant';
  } else if (text.includes('gentle') || text.includes('calm') || text.includes('peaceful')) {
    return 'soothing';
  } else if (text.includes('energy') || text.includes('excited') || text.includes('adventure')) {
    return 'energetic';
  } else if (text.includes('professional') || text.includes('work') || text.includes('business')) {
    return 'professional';
  } else {
    return 'warm'; 
  }
};

// Route to generate story
router.post('/generate-story', async (req, res) => {
  const { prompt, genre } = req.body;
  
  if (!prompt || !genre) {
    return res.status(400).json({ error: 'Prompt and genre are required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const enhancedPrompt = generateStoryPrompt(prompt, genre);
    
    const result = await model.generateContent([enhancedPrompt]);
    
    const rawStory = await result.response.text();
    
    // Clean the story for TTS
    const cleanedStory = cleanStoryForTTS(rawStory);
    
    const storyData = {
      story: cleanedStory, 
      rawStory: rawStory, 
      estimatedReadTime: Math.ceil(cleanedStory.split(' ').length / 200), 
      genre,
      mood: detectMood(cleanedStory),
      wordCount: cleanedStory.split(' ').length,
      timestamp: new Date().toISOString()
    };
    
    res.json(storyData);
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Story generation failed. Please try again.' });
  }
});

export default router;