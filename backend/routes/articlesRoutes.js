import express from 'express';
import Article from '../models/Article.js';

const router = express.Router();

// GET /api/articles
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'All' ? { category } : {};
    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET /api/articles/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// POST /api/articles
router.post('/', async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      fullContent,
      category,
      tags,
      thumbnailUrl,
      estimatedReadTime,
      author,
    } = req.body;

    const newArticle = new Article({
      title,
      shortDescription,
      fullContent,
      category,
      tags,
      thumbnailUrl,
      estimatedReadTime,
      author,
      updatedAt: new Date(),
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ error: 'Failed to save article' });
  }
});

export default router;