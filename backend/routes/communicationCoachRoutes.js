import express from 'express';
import CommunicationCoach  from '../models/CommunicationCoach.js';

const router = express.Router();

// GET /api/communication-coaches - Get all communication coaches
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, isActive } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const coaches = await CommunicationCoach.find(filter).select('-__v');
    
    res.json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    console.error('❌ Error fetching communication coaches:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching communication coaches',
      error: error.message
    });
  }
});

// GET /api/communication-coaches/:id - Get communication coach by ID
router.get('/:id', async (req, res) => {
  try {
    const coach = await CommunicationCoach.findById(req.params.id).select('-__v');
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Communication coach not found'
      });
    }
    
    res.json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('❌ Error fetching communication coach:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching communication coach',
      error: error.message
    });
  }
});

// POST /api/communication-coaches - Create new communication coach
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new communication coach with data:', req.body);

    const {
      name,
      shortDescription,
      topic,
      longDescription,
      category,
      difficulty,
      initialAIResponse,
      prompt,
      learningObjectives,
      avatarUrl,
      isActive,
      voiceSettings
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !shortDescription ||
      !longDescription ||
      !topic ||
      !category ||
      !difficulty ||
      !initialAIResponse ||
      !prompt ||
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
          'topic',
          'category',
          'difficulty',
          'initialAIResponse',
          'prompt',
          'avatarUrl',
          'voiceSettings'
        ]
      });
    }

    // Validate inner fields of voiceSettings
    const { voiceId, style, rate, pitch, variation } = voiceSettings;
    if (!voiceId || !style) {
      return res.status(400).json({
        success: false,
        message: 'Missing required voiceSettings fields',
        required: ['voiceId', 'style']
      });
    }

    const coach = new CommunicationCoach({
      name,
      shortDescription,
      longDescription,
      topic,
      category,
      difficulty,
      initialAIResponse,
      prompt,
      learningObjectives: learningObjectives || [],
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

    const savedCoach = await coach.save();
    console.log('✅ Communication coach created successfully:', savedCoach._id);

    res.status(201).json({
      success: true,
      message: 'Communication coach created successfully',
      data: savedCoach
    });
  } catch (error) {
    console.error('❌ Error creating communication coach:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating communication coach',
      error: error.message
    });
  }
});


// PUT /api/communication-coaches/:id - Update communication coach
router.put('/:id', async (req, res) => {
  try {
    const coach = await CommunicationCoach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Communication coach not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Communication coach updated successfully',
      data: coach
    });
  } catch (error) {
    console.error('❌ Error updating communication coach:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating communication coach',
      error: error.message
    });
  }
});

// DELETE /api/communication-coaches/:id - Delete communication coach
router.delete('/:id', async (req, res) => {
  try {
    const coach = await CommunicationCoach.findByIdAndDelete(req.params.id);
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Communication coach not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Communication coach deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting communication coach:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting communication coach',
      error: error.message
    });
  }
});

export default router;
