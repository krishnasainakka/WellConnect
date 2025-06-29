import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  fullContent: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Communication', 'Therapy'],
    required: true,
  },
  tags: [String], 
  thumbnailUrl: {
    type: String,
  },
  estimatedReadTime: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  author: {
    type: String,
    default: "AI Assistant",
  },  
});

export default mongoose.model('Article', articleSchema);