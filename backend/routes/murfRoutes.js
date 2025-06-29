import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

const router = express.Router();
dotenv.config();

const MURF_API_URL = 'https://api.murf.ai/v1/speech/stream';
const MURF_API_KEY = process.env.MURF_API_KEY;
const MAX_CHARS = 800;

// Voice data 
const voiceData = {
  'en-US': [
    {
      id: 'en-US-natalie',
      name: 'Natalie',
      gender: 'female',
      language: 'English (US)',
      styles: ['Promo', 'Narration', 'Newscast Formal', 'Meditative', 'Sad', 'Angry', 'Conversational', 'Newscast Casual', 'Furious', 'Sorrowful', 'Terrified', 'Inspirational']
    },
    {
      id: 'en-US-ken',
      name: 'Ken',
      gender: 'male',
      language: 'English (US)',
      styles: ['Conversational', 'Promo', 'Newscast', 'Storytelling', 'Calm', 'Furious', 'Angry', 'Sobbing', 'Sad', 'Wizard', 'Audiobook']
    },
    {
      id: 'en-US-charles',
      name: 'Charles',
      gender: 'male',
      language: 'English (US)',
      styles: ['Conversational', 'Promo', 'Calm', 'NewsCast', 'Inspirational', 'Sad', 'Angry']
    },
    {
      id: 'en-US-riley',
      name: 'Riley',
      gender: 'female',
      language: 'English (US)',
      styles: ['Promo', 'Narration']
    },
    {
      id: 'en-US-carter',
      name: 'Carter',
      gender: 'male',
      language: 'English (US)',
      styles: ['Conversational', 'Promo', 'Calm']
    },
    {
      id: 'en-US-phoebe',
      name: 'Phoebe',
      gender: 'female',
      language: 'English (US)',
      styles: ['Conversational', 'Promo', 'Calm', 'Inspirational']
    }
  ],
  'hi-IN': [
    {
      id: 'hi-IN-kabir',
      name: 'Kabir',
      gender: 'male',
      language: 'Hindi (India)',
      styles: ['Conversational']
    },
    {
      id: 'hi-IN-ayushi',
      name: 'Ayushi',
      gender: 'female',
      language: 'Hindi (India)',
      styles: ['Conversational']
    },
    {
      id: 'hi-IN-rahul',
      name: 'Rahul',
      gender: 'male',
      language: 'Hindi (India)',
      styles: ['Conversational']
    },
    {
      id: 'hi-IN-shweta',
      name: 'Shweta',
      gender: 'female',
      language: 'Hindi (India)',
      styles: ['Conversational']
    }
  ],
  'es-ES': [
    {
      id: 'es-ES-elvira',
      name: 'Elvira',
      gender: 'female',
      language: 'Spanish (Spain)',
      styles: ['Conversational', 'Promo']
    },
    {
      id: 'es-ES-enrique',
      name: 'Enrique',
      gender: 'male',
      language: 'Spanish (Spain)',
      styles: ['Conversational', 'Promo']
    }
  ],
  'fr-FR': [
    {
      id: 'fr-FR-adélie',
      name: 'Adélie',
      gender: 'female',
      language: 'French (France)',
      styles: ['Conversational', 'Promo', 'Calm', 'Sad']
    },
    {
      id: 'fr-FR-maxime',
      name: 'Maxime',
      gender: 'male',
      language: 'French (France)',
      styles: ['Conversational', 'Promo', 'Calm']
    }
  ],
  'de-DE': [
    {
      id: 'de-DE-matthias',
      name: 'Matthias',
      gender: 'male',
      language: 'German (Germany)',
      styles: ['Conversational', 'Promo', 'Calm', 'Angry']
    },
    {
      id: 'de-DE-lia',
      name: 'Lia',
      gender: 'female',
      language: 'German (Germany)',
      styles: ['Conversational', 'Promo', 'Calm']
    }
  ]
};

// Route to get available voices
router.get('/voices', (req, res) => {
  const { language = 'en-US', gender } = req.query;
  
  let voices = voiceData[language] || voiceData['en-US'];
  
  if (gender) {
    voices = voices.filter(voice => voice.gender === gender);
  }
  
  res.json({ voices });
});


function splitTextIntoChunks(text, maxLength = MAX_CHARS) {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + ' ' + word).trim().length > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk += ' ' + word;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

router.post('/stream', async (req, res) => {
  const { text, voiceId = 'en-US-natalie', style = 'Conversational', speed = 1.0 } = req.body;

  if (!text || !MURF_API_KEY) {
    return res.status(400).json({ error: 'Missing text or API key' });
  }

  const chunks = splitTextIntoChunks(text, MAX_CHARS);

  res.setHeader('Content-Type', 'audio/wav');

  try {
    for (const chunk of chunks) {
      const requestBody = { text: chunk, voiceId, style, speed };

      const response = await axios.post(MURF_API_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': MURF_API_KEY,
        },
        responseType: 'stream',
      });

      await new Promise((resolve, reject) => {
        response.data.on('data', (data) => res.write(data));
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    }

    res.end(); 
  } catch (error) {
    console.error('TTS streaming error:', error.response?.data || error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'TTS stream failed' });
    }
  }
});

// Route to test voice with sample text
router.post('/test-voice', async (req, res) => {
  const { voiceId, style = 'Conversational', speed = 1.0 } = req.body;
  const testText = "Hello, this is a test of the selected voice settings. How does this sound to you?";
  const apiUrl = 'https://api.murf.ai/v1/speech/stream';
  const apiKey = process.env.MURF_API_KEY;

  try {
    const requestBody = {
      text: testText,
      voiceId,
      style,
      speed
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'audio/wav');
    response.data.pipe(res);
  } catch (error) {
    console.error('Voice test error:', error.message);
    res.status(500).json({ error: 'Voice test failed' });
  }
});

router.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Missing text or target language' });
  }

  try {
    const chunks = splitTextIntoChunks(text);
    const translations = [];

    for (const chunk of chunks) {
      const response = await axios.post('https://api.murf.ai/v1/text/translate', {
        targetLanguage,
        texts: [chunk],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.MURF_API_KEY,
        },
      });

      const translatedChunk = response.data.translations?.[0]?.translated_text || '';
      translations.push(translatedChunk);
    }

    const translatedText = translations.join(' ');
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

router.post('/translated-voice', async (req, res) => {
  const { text, targetLang, voiceId, style = 'Conversational', speed = 1.0 } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing text or targetLang' });
  }

  const apiKey = process.env.MURF_API_KEY;
  const apiUrl = 'https://api.murf.ai/v1/speech/stream';

  const chunks = splitTextIntoChunks(text, 800); // reuse splitter

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    for (const chunk of chunks) {
      const requestBody = {
        text: chunk,
        voiceId: voiceId || 'en-US-natalie',
        multiNativeLocale: targetLang,
        style,
        speed
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        responseType: 'stream',
      });

      await new Promise((resolve, reject) => {
        response.data.on('data', (data) => res.write(data));
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    }

    res.end();
  } catch (error) {
    console.error('TTS translation error:', error?.response?.data || error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'TTS translation failed' });
    }
  }
});

// For Story telling
const storyVoiceOptions = {
  female: {
    'en-US-natalie': { name: 'Natalie', accent: 'American', mood: 'Inspirational & Meditative', styles: ['Inspirational', 'Meditative', 'Narration', 'Conversational'] },
    'en-US-naomi': { name: 'Naomi', accent: 'American', mood: 'Inspirational & Conversational', styles: ['Inspirational', 'Conversational'] },
    'en-US-phoebe': { name: 'Phoebe', accent: 'American', mood: 'Conversational & Friendly', styles: ['Conversational'] },
    'en-US-julia': { name: 'Julia', accent: 'American', mood: 'Calm & Soothing', styles: ['Calm'] }
  },
  male: {
    'en-US-ken': { name: 'Ken', accent: 'American', mood: 'Calm & Storytelling', styles: ['Storytelling', 'Calm', 'Conversational', 'Newscast'] },
    'en-US-terrell': { name: 'Terrell', accent: 'American', mood: 'Inspirational & Calm', styles: ['Inspirational', 'Calm', 'Narration', 'Conversational'] },
    'en-US-miles': { name: 'Miles', accent: 'American', mood: 'Inspirational & Calm', styles: ['Inspirational', 'Calm', 'Narration', 'Conversational'] },
    'en-US-wayne': { name: 'Wayne', accent: 'American', mood: 'Inspirational & Calm', styles: ['Inspirational', 'Calm', 'Narration'] },
    'en-US-daniel': {name: 'Daniel', accent: 'American', mood: 'Storytelling', styles:['Storytelling', 'Inspirational', 'Calm']}
  }
};

const getOptimalVoice = (gender, mood, style, userPreference) => {
  if (userPreference && (storyVoiceOptions.female[userPreference] || storyVoiceOptions.male[userPreference])) {
    const preferredVoiceInfo = storyVoiceOptions.female[userPreference] || storyVoiceOptions.male[userPreference];
    if (preferredVoiceInfo.styles.includes(style)) {
      return userPreference;
    }
  }

  const genderVoices = storyVoiceOptions[gender.toLowerCase()] || storyVoiceOptions.female;
  
  for (const voiceId in genderVoices) {
    if (Object.prototype.hasOwnProperty.call(genderVoices, voiceId)) {
      const voiceInfo = genderVoices[voiceId];
      if (voiceInfo.styles.includes(style)) {
        console.log(`Found optimal voice for style '${style}': ${voiceId}`);
        return voiceId;
      }
    }
  }

  console.warn(`No voice found for style '${style}'. Falling back to default.`);
  return gender.toLowerCase() === 'male' ? 'en-US-ken' : 'en-US-natalie';
};


router.post('/stream-story', async (req, res) => {
  const { 
    text, 
    voiceId, 
    style = 'Inspirational', 
    speed = 0.5,
    mood = 'warm',
    gender = 'female' 
  } = req.body;
  
  const MAX_MURF_CHARS = 3000; 

  if (!text) {
    return res.status(400).json({ error: 'Text is required for TTS conversion' });
  }

  const selectedVoice = voiceId || getOptimalVoice(gender, mood, style);
  
  const apiUrl = 'https://api.murf.ai/v1/speech/stream';
  const apiKey = process.env.MURF_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Murf API key not configured' });
  }

  const chunks = [];
  let currentChunk = '';
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length + 1 <= MAX_MURF_CHARS) {
      currentChunk += (currentChunk.length > 0 ? ' ' : '') + sentence;
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
      if (currentChunk.length > MAX_MURF_CHARS) {
          console.warn('A single sentence exceeds Murf\'s character limit. This might cause a failure.');
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  console.log(`Split text into ${chunks.length} chunks.`);

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Content-Disposition', 'inline; filename="growth-story.wav"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    for (const chunk of chunks) {
      const requestBody = {
        text: chunk,
        voiceId: selectedVoice,
        style,
        speed: Math.max(0.5, Math.min(2.0, speed)) 
      };

      console.log('Sending chunk request:', { textLength: chunk.length });

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        responseType: 'stream',
        timeout: 60000 
      });

      response.data.pipe(res, { end: false });
      
      await new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    }

    res.end();

  } catch (error) {
    console.error('TTS Error:', error.response?.data || error.message);
    
    if (!res.headersSent) {
      const errorMessage = error.response?.data?.message || 'TTS conversion failed';
      res.status(500).json({ error: errorMessage });
    }
  }
});


// Route to get available voices by gender
router.get('/voices-gender', async (req, res) => {
  try {
    const { gender } = req.query;
    
    if (gender && (gender === 'male' || gender === 'female')) {
      const genderVoices = Object.entries(storyVoiceOptions[gender]).map(([id, info]) => ({
        id,
        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
        ...info
      }));
      return res.json({ voices: genderVoices });
    }
    
    // Return all voices if no gender specified
    const allVoices = [];
    Object.entries(storyVoiceOptions).forEach(([genderKey, voices]) => {
      Object.entries(voices).forEach(([id, info]) => {
        allVoices.push({
          id,
          gender: genderKey.charAt(0).toUpperCase() + genderKey.slice(1),
          ...info
        });
      });
    });
    
    res.json({ voices: allVoices });
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).json({ error: 'Failed to fetch available voices' });
  }
});

// Route to get voice recommendations based on genre and style
router.post('/recommend-voice', async (req, res) => {
  try {
    const { genre, style, gender = 'female' } = req.body;
    
    const recommendedVoice = getOptimalVoice(gender, 'warm', style);
    const voiceInfo = storyVoiceOptions[gender.toLowerCase()][recommendedVoice];
    
    res.json({
      recommendedVoice,
      voiceInfo,
      reason: `Best ${gender} voice for ${style} ${genre} stories`
    });
  } catch (error) {
    console.error('Error getting voice recommendation:', error);
    res.status(500).json({ error: 'Failed to get voice recommendation' });
  }
});

export default router;