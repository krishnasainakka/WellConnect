import express from 'express';
import { generateGeminiQuote } from '../services/geminiService.js';

const router = express.Router();

let cachedQuote = null;
let cachedDate = null;

router.get('/daily', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    if (cachedDate !== today) {
      const quote = await generateGeminiQuote();
      cachedQuote = {
        text: quote.text,
        author: 'AI Generated',
      };
      cachedDate = today;
    }

    res.json(cachedQuote);
  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({ error: 'Failed to generate daily quote' });
  }
});

export default router;
