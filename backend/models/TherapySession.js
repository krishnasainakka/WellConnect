import mongoose from 'mongoose';

const therapySessionSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    ref: 'User' 
  },
  
  therapy_coach_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Therapy',
    required: true
  },
  
  type: { 
    type: String, 
    default: 'therapy',    
  },
  
  startTime: { 
    type: Date, 
    default: Date.now 
  },
  
  endTime: Date,
  
  durationInSeconds: Number,
  
  conversationHistory: [
    {
      _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
      },
      speaker: { 
        type: String, 
        enum: ['user', 'ai'], 
        required: true 
      },
      text: { 
        type: String, 
        required: true 
      },
      timestamp: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],

  report: {
    conversationSummary: String,
    
    sessionLength: {
      type: String,
      enum: ['Brief', 'Short', 'Moderate', 'Extended']
    },
    
    engagementLevel: {
      type: String,
      enum: ['Minimal', 'Limited', 'Moderate', 'High', 'Exceptional']
    },
    
    score: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
    
    scoreJustification: String,
    
    concernsExpressed: [String],
    
    emotionalState: {
      initial: String,
      final: String,
      progressNoted: Boolean
    },
    
    copingStrategiesDiscussed: [String],
    
    therapeuticTechniquesUsed: [String],
    
    selfAwarenessIndicators: [String],
    
    recommendedNextSteps: [String],
    
    outcomeAchieved: String,
    
    keyBreakthroughs: [String],
    
    therapeuticGoalProgress: {
      goalsAddressed: [String],
      progressLevel: {
        type: String,
        enum: ['None', 'Minimal', 'Some', 'Good', 'Significant']
      },
      specificEvidence: String
    },
    
    therapeuticPatterns: {
      positivePatterns: [String],
      challengingPatterns: [String]
    },
    
    therapyReadiness: String,
    
    riskAssessment: {
      level: {
        type: String,
        enum: ['None', 'Low', 'Moderate', 'High'],
        default: 'None'
      },
      indicators: [String],
      recommendedActions: [String]
    }
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const TherapySession = mongoose.models.TherapySession || mongoose.model('TherapySession', therapySessionSchema);
export default TherapySession;