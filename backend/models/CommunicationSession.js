import mongoose from 'mongoose';

const communicationSessionSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    ref: 'User' 
  },
  
  communication_coach_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CommunicationCoach',
    required: true
  },
  
  type: { 
    type: String, 
    default: 'communication'
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
    
    conversationLength: {
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
    
    strengths: [String],
    
    areasForImprovement: [String],
    
    recommendedNextSteps: [String],
    
    outcomeAchieved: String,
    
    keyInsights: [String],
    
    learningObjectiveProgress: {
      objectivesAddressed: [String],
      progressLevel: {
        type: String,
        enum: ['None', 'Minimal', 'Some', 'Good', 'Significant']
      },
      specificEvidence: String
    },
    
    communicationPatterns: {
      positivePatterns: [String],
      challengingPatterns: [String]
    },
    
    coachingReadiness: String
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const CommunicationSession = mongoose.models.CommunicationSession || mongoose.model('CommunicationSession', communicationSessionSchema);

export default CommunicationSession;