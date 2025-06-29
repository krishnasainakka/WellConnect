import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

const router = express.Router();
dotenv.config();

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

// Route to stream TTS from Murf and send back audio file
router.post('/stream', async (req, res) => {
  const { text, voiceId = 'en-US-natalie', style = 'Conversational', speed = 1.0 } = req.body;
  const apiUrl = 'https://api.murf.ai/v1/speech/stream';
  const apiKey = process.env.MURF_API_KEY;

  try {
    const requestBody = {
      text,
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
    console.error('TTS Error:', error.message);
    res.status(500).json({ error: 'TTS failed' });
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
  try {
    const response = await axios.post('https://api.murf.ai/v1/text/translate', {
      targetLanguage,
      texts: [text],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MURF_API_KEY,
      },
    });

    const translatedText = response.data.translations?.[0]?.translated_text;
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation API error:', error.message);
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

  const requestBody = {
    text,
    voiceId: voiceId || 'en-US-natalie',
    multiNativeLocale: targetLang,
    style,
    speed
  };

  try {
    console.log('Sending to Murf:', requestBody);

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Transfer-Encoding', 'chunked');
    response.data.pipe(res);
  } catch (error) {
    console.error('TTS translation error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'TTS translation failed' });
  }
});

export default router;