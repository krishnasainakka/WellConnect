export interface User {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  badges: Badge[];
  stats: UserStats;
}


export interface UserStats {
  totalSessions: number;
  avgCommunicationScore: number;
  timeSpentPracticing: number;
  numberOfBadges: number;
  streakDays: number;
}

export interface Badge {
  id: string;
  earnedAt: Date;
}

export interface Scenario {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  avatar: string;
  initialAIResponse: string;
  tags: string[];
}

export interface TherapyTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  avatar: string;
  initialAIResponse: string;
  tags: string[];
}

export interface Session {
  id: string;
  userId: string;
  scenarioId?: string;
  therapyTopicId?: string;
  type: 'conversation' | 'therapy';
  startTime: Date;
  endTime: Date;
  duration: number;
  conversationHistory: ConversationTurn[];
  report: SessionReport;
}

export interface ConversationTurn {
  speaker: 'user' | 'ai';
  message: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface SessionReport {
  score: number;
  strengths: string[];
  improvements: string[];
  analytics: {
    fillerWords: number;
    wordsPerMinute: number;
    toneAnalysis: string;
    keywordsUsed: string[];
  };
  recommendations: string[];
}

export interface VoiceSettings {
  voiceId: string; 
  style?: string; 
  rate?: number; 
  pitch?: number; 
  variation?: number; 
  multiNativeLocale?: string; 
}

export interface Coach {
  _id: string;
  name: string;
  longDescription: string;
  voiceSettings:VoiceSettings
}


export interface Message {
  role: 'user' | 'gemini' | 'system';
  content: string;
  id: number;
  isInitial?: boolean;
}


export interface VoiceConfig {
  gender: 'male' | 'female';
  voiceId: string;
  style: string;
  speed: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  language: string;
}

export interface WebSocketMessage {
  type?: string;
  partial?: string;
  user?: string;
  geminiChunk?: string;
  geminiDone?: boolean;
  ttsAudioChunk?: string;
  ttsDone?: boolean;
  contextId?: string;
  success?: boolean;
  sessionId?: string;
  error?: string;
  fallbackText?: string;
  coach?: Coach;
  voiceConfig?: VoiceConfig;
}
