import mongoose from 'mongoose';

const communicationCoachSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  topic: {
    type:String,
    required: true
  },
  
  shortDescription: { 
    type: String, 
    required: true 
  },
  
  longDescription: { 
    type: String, 
    required: true 
  },
  
  category: { 
    type: String, 
    enum: ['Professional', 'Personal', 'Leadership', 'Interpersonal', 'Public Speaking', 'Cross-Cultural', 'Other'], 
    required: true 
  },
  
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Beginner' 
  },
  
  initialAIResponse: { 
    type: String, 
    required: true 
  },
  
  prompt: {
    type: String, 
    required: true
  },

  learningObjectives: [String],

  avatarUrl: { 
    type: String, 
    required: true 
  },

  voiceSettings: {
    type: {
      voiceId: { type: String, required: true },
      style: { type: String, required: true },
      rate: { type: Number, default: 0 },
      pitch: { type: Number, default: 0 },
      variation: { type: Number, default: 1 }
    },
    required: true
  },
  
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('CommunicationCoach', communicationCoachSchema);
