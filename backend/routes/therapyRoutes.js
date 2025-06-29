import express from 'express';
import TherapyCoach  from '../models/Therapy.js';

const router = express.Router();

// GET /api/therapy - Get all therapy topics
router.get('/', async (req, res) => {
  try {
    const { category, isActive } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const therapyTopics = await TherapyCoach.find(filter).select('-__v');
     
    res.json({
      success: true,
      count: therapyTopics.length,
      data: therapyTopics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching therapy topics',
      error: error.message
    });
  }
});

// GET /api/therapy/:id - Get therapy topic by ID
router.get('/:id', async (req, res) => {
  try {
    const therapyTopic = await TherapyCoach.findById(req.params.id).select('-__v');
    
    if (!therapyTopic) {
      return res.status(404).json({
        success: false,
        message: 'Therapy topic not found'
      });
    }
    
    res.json({
      success: true,
      data: therapyTopic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching therapy topic',
      error: error.message
    });
  }
});

// POST /api/therapy - Create new therapy topic
router.post('/', async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      longDescription,
      category,
      initialAIResponse,
      prompt,
      keyTechniques,
      avatarUrl,
      isActive,
      voiceSettings
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !shortDescription ||
      !longDescription ||
      !category ||
      !initialAIResponse ||
      !prompt ||
      !keyTechniques ||
      !avatarUrl ||
      !voiceSettings
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: [
          'name',
          'shortDescription',
          'longDescription',
          'category',
          'keyTechniques',
          'initialAIResponse',
          'prompt',
          'avatarUrl',
          'voiceSettings'
        ]
      });
    }

    // Validate voiceSettings internals
    const { voiceId, style, rate, pitch, variation } = voiceSettings;
    if (!voiceId || !style) {
      return res.status(400).json({
        success: false,
        message: 'Missing required voiceSettings fields',
        required: ['voiceId', 'style']
      });
    }

    const therapyTopic = new TherapyCoach({
      name,
      shortDescription,
      longDescription,
      category,
      initialAIResponse,
      prompt,
      keyTechniques: keyTechniques || [],
      avatarUrl,
      isActive: isActive !== undefined ? isActive : true,
      voiceSettings: {
        voiceId,
        style,
        rate: rate ?? 0,
        pitch: pitch ?? 0,
        variation: variation ?? 1
      }
    });

    const savedTherapyTopic = await therapyTopic.save();

    res.status(201).json({
      success: true,
      message: 'Therapy topic created successfully',
      data: savedTherapyTopic
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating therapy topic',
      error: error.message
    });
  }
});


// PUT /api/therapy/:id - Update therapy topic
router.put('/:id', async (req, res) => {
  try {
    const therapyTopic = await TherapyCoach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!therapyTopic) {
      return res.status(404).json({
        success: false,
        message: 'Therapy topic not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Therapy topic updated successfully',
      data: therapyTopic
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating therapy topic',
      error: error.message
    });
  }
});

// DELETE /api/therapy/:id - Delete therapy topic
router.delete('/:id', async (req, res) => {
  try {
    const therapyTopic = await TherapyCoach.findByIdAndDelete(req.params.id);
    
    if (!therapyTopic) {
      return res.status(404).json({
        success: false,
        message: 'Therapy topic not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Therapy topic deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting therapy topic',
      error: error.message
    });
  }
});

export default router;
