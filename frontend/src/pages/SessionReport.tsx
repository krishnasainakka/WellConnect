import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Calendar, User, Award, TrendingUp, Target,
  CheckCircle2, AlertCircle, ArrowRight, BarChart3,
  ArrowLeft, MessageCircle, Heart, Brain, Zap,
  Trophy, Activity, Shield, FileText,
  Lightbulb, TrendingDown, Download,
  RefreshCw, Loader2, ChevronRight,
  ThumbsUp, BookOpen, Compass
} from 'lucide-react';

// Interfaces
interface ConversationHistory {
  _id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface CommunicationReport {
  conversationSummary: string;
  conversationLength?: string;
  engagementLevel?: string;
  score: number;
  scoreJustification?: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendedNextSteps: string[];
  outcomeAchieved: string;
  keyInsights?: string[];
  learningObjectiveProgress?: {
    objectivesAddressed: string[];
    progressLevel: string;
    specificEvidence: string;
  };
  communicationPatterns?: {
    positivePatterns: string[];
    challengingPatterns: string[];
  };
  coachingReadiness?: string;
}

interface TherapyReport {
  conversationSummary: string;
  sessionLength?: string;
  engagementLevel?: string;
  score: number;
  scoreJustification?: string;
  concernsExpressed?: string[];
  emotionalState?: {
    initial: string;
    final: string;
    progressNoted: boolean;
  };
  copingStrategiesDiscussed?: string[];
  therapeuticTechniquesUsed?: string[];
  selfAwarenessIndicators?: string[];
  recommendedNextSteps: string[];
  outcomeAchieved: string;
  keyBreakthroughs?: string[];
  therapeuticGoalProgress?: {
    goalsAddressed: string[];
    progressLevel: string;
    specificEvidence: string;
  };
  therapeuticPatterns?: {
    positivePatterns: string[];
    challengingPatterns: string[];
  };
  therapyReadiness?: string;
  riskAssessment?: {
    level: string;
    indicators: string[];
    recommendedActions: string[];
  };
}

interface SessionData {
  sessionId: string;
  sessionType: 'communication' | 'therapy';
  coach: {
    name: string;
    shortDescription?: string;
    category: string;
    avatarUrl: string;
  };
  sessionInfo: {
    startTime: string;
    endTime: string;
    durationInSeconds: number;
    durationFormatted: string;
  };
  conversationHistory: ConversationHistory[];
  report: CommunicationReport | TherapyReport;
}

const SessionReport: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'conversation' | 'analysis' | 'insights'>('overview');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/reports/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session report');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setSessionData(data.data);
        } else {
          throw new Error(data.error || 'Report not found');
        }
      } catch (err: any) {
        console.error('Error fetching report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchReport();
    }
  }, [sessionId]);


  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-600';
    if (score >= 60) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'Exceptional': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'High': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'Moderate': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'Limited': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'Minimal': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'Significant': return 'text-emerald-600 dark:text-emerald-400';
      case 'Good': return 'text-blue-600 dark:text-blue-400';
      case 'Some': return 'text-amber-600 dark:text-amber-400';
      case 'Minimal': return 'text-orange-600 dark:text-orange-400';
      case 'None': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'Moderate': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'Low': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'None': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const isTherapySession = sessionData?.sessionType === 'therapy';
  const isCommunicationSession = sessionData?.sessionType === 'communication';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Your Report</h3>
          <p className="text-gray-600 dark:text-gray-400">Analyzing your session data...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-3xl mx-auto flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Report Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Session report could not be loaded.'}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/history')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to History</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Award },
    { key: 'conversation', label: 'Conversation', icon: MessageCircle },
    { key: 'analysis', label: 'Analysis', icon: TrendingUp },
    ...(isTherapySession ? [{ key: 'insights', label: 'Insights', icon: Brain }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/history')}
            className="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Session History</span>
          </motion.button>
        </motion.div>

        {/* Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex flex-col xl:flex-row items-start justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-6 flex-1 w-full">
                <div className="relative flex-shrink-0">
                  <img 
                    src={sessionData.coach.avatarUrl} 
                    alt={sessionData.coach.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/50 dark:ring-gray-700/50 border-2 border-gray-200/50 dark:border-gray-700/50"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${isTherapySession ? 'bg-red-500' : 'bg-blue-500'} rounded-xl flex items-center justify-center border-2 border-white dark:border-gray-800`}>
                    {isTherapySession ? <Heart className="w-4 h-4 text-white" /> : <MessageCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {sessionData.coach.name}
                    </h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${
                      isTherapySession 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    }`}>
                      {isTherapySession ? 'Therapy Session' : 'Communication Session'}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">
                    {sessionData.coach.category}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    {formatDate(sessionData.sessionInfo.startTime)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                <div className={`text-center p-6 rounded-2xl bg-gradient-to-r ${getScoreGradient(sessionData.report.score)} text-white border-2 border-white/20`}>
                  <div className="text-3xl sm:text-4xl font-bold mb-1">{sessionData.report.score}</div>
                  <div className="text-sm opacity-90">Overall Score</div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry</span>
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Session Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Calendar, label: 'Date', value: new Date(sessionData.sessionInfo.startTime).toLocaleDateString(), color: 'from-blue-500 to-cyan-600' },
                { icon: Clock, label: 'Duration', value: sessionData.sessionInfo.durationFormatted, color: 'from-emerald-500 to-teal-600' },
                { icon: User, label: 'Type', value: sessionData.sessionType === 'therapy' ? 'Therapy' : 'Communication', color: 'from-purple-500 to-indigo-600' },
                { icon: BarChart3, label: 'Exchanges', value: sessionData.conversationHistory.length.toString(), color: 'from-amber-500 to-orange-600' }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                        <div className="font-semibold text-gray-900 dark:text-white truncate">{item.value}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-2 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex flex-wrap gap-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center px-4 sm:px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === key
                      ? `bg-gradient-to-r ${isTherapySession ? 'from-red-500 to-pink-600' : 'from-blue-500 to-purple-600'} text-white`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Session Summary */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FileText className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-blue-500" />
                    Session Summary
                  </h3>
                  <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                      {sessionData.report.conversationSummary}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sessionData.report.engagementLevel && (
                        <div className={`p-4 rounded-xl border-2 ${getEngagementColor(sessionData.report.engagementLevel)}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4" />
                            <span className="font-medium text-sm">Engagement</span>
                          </div>
                          <span className="font-bold">{sessionData.report.engagementLevel}</span>
                        </div>
                      )}
                      
                      {(sessionData.report as any).conversationLength && (
                        <div className="p-4 rounded-xl border-2 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium text-sm">Length</span>
                          </div>
                          <span className="font-bold">{(sessionData.report as any).conversationLength}</span>
                        </div>
                      )}
                      
                      {(sessionData.report as any).sessionLength && (
                        <div className="p-4 rounded-xl border-2 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium text-sm">Session Length</span>
                          </div>
                          <span className="font-bold">{(sessionData.report as any).sessionLength}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border-2 border-blue-200/30 dark:border-blue-800/30">
                      <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Outcome Achieved
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200">{sessionData.report.outcomeAchieved}</p>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-6">
                  {/* Strengths or Positive Aspects */}
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <ThumbsUp className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-emerald-500" />
                      {isTherapySession ? 'Positive Indicators' : 'Key Strengths'}
                    </h3>
                    <div className="space-y-4">
                      {(isCommunicationSession ? (sessionData.report as CommunicationReport).strengths : 
                        (sessionData.report as TherapyReport).selfAwarenessIndicators || [])?.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mt-0.5 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  {sessionData.report.scoreJustification && (
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Trophy className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-amber-500" />
                        Score Analysis
                      </h3>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(sessionData.report.score)}`}>
                            {sessionData.report.score}/100
                          </div>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-full">
                            <div 
                              className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(sessionData.report.score)}`}
                              style={{ width: `${sessionData.report.score}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {sessionData.report.scoreJustification}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'conversation' && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                  <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-blue-500" />
                  Conversation History
                </h3>
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 sm:pr-4">
                  {sessionData.conversationHistory.map((message, index) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[80%] ${
                        message.speaker === 'user'
                          ? `bg-gradient-to-r ${isTherapySession ? 'from-red-500 to-pink-600' : 'from-blue-500 to-purple-600'} text-white`
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-200/50 dark:border-gray-600/50'
                      } rounded-2xl p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            message.speaker === 'user' 
                              ? 'bg-white/20' 
                              : `bg-gradient-to-r ${isTherapySession ? 'from-red-500 to-pink-600' : 'from-blue-500 to-purple-600'}`
                          }`}>
                            {message.speaker === 'user' ? (
                              <User className="w-3 h-3" />
                            ) : isTherapySession ? (
                              <Heart className="w-3 h-3 text-white" />
                            ) : (
                              <MessageCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium opacity-75">
                            {message.speaker === 'user' ? 'You' : sessionData.coach.name}
                          </span>
                        </div>
                        <p className="leading-relaxed text-sm sm:text-base">{message.text}</p>
                        <div className="text-xs opacity-60 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Areas for Improvement */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <TrendingDown className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-amber-500" />
                    {isTherapySession ? 'Areas to Explore' : 'Areas for Improvement'}
                  </h3>
                  <div className="space-y-4">
                    {(isCommunicationSession ? (sessionData.report as CommunicationReport).areasForImprovement :
                      (sessionData.report as TherapyReport).concernsExpressed || [])?.map((area, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mt-0.5 border border-amber-200 dark:border-amber-800">
                          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{area}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recommended Next Steps */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-blue-500" />
                    Recommended Next Steps
                  </h3>
                  <div className="space-y-4">
                    {sessionData.report.recommendedNextSteps?.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mt-0.5 border border-blue-200 dark:border-blue-800">
                          <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Progress Tracking */}
                {((sessionData.report as CommunicationReport).learningObjectiveProgress || 
                  (sessionData.report as TherapyReport).therapeuticGoalProgress) && (
                  <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Compass className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-purple-500" />
                      {isTherapySession ? 'Therapeutic Progress' : 'Learning Progress'}
                    </h3>
                    {(() => {
                      const progress = isCommunicationSession 
                        ? (sessionData.report as CommunicationReport).learningObjectiveProgress
                        : (sessionData.report as TherapyReport).therapeuticGoalProgress;
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                              {isTherapySession ? 'Goals Addressed' : 'Objectives Addressed'}
                            </h4>
                            { progress && 'goalsAddressed' in progress && (
                              <div className="space-y-2">
                                {progress.goalsAddressed.map((goal: string, index: number) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{goal}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            { progress && 'objectivesAddressed' in progress && (
                              <div className="space-y-2">
                                {progress.objectivesAddressed.map((obj: string, index: number) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{obj}</span>
                                  </div>
                                ))}
                              </div>
                            )}


                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Progress Level</h4>
                            <div className={`inline-flex items-center px-4 py-2 rounded-xl font-medium border-2 ${
                              progress?.progressLevel ? getProgressColor(progress.progressLevel) : 'text-gray-600 dark:text-gray-400'
                            } bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700`}>
                              <Activity className="w-4 h-4 mr-2" />
                              {progress?.progressLevel || 'Not assessed'}
                            </div>
                            {progress?.specificEvidence && (
                              <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                                {progress.specificEvidence}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insights' && isTherapySession && (
              <div className="space-y-6 lg:space-y-8">
                {/* Emotional State */}
                {(sessionData.report as TherapyReport).emotionalState && (
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Heart className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-red-500" />
                      Emotional Journey
                    </h3>
                    {(() => {
                      const emotionalState = (sessionData.report as TherapyReport).emotionalState!;
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Initial State</h4>
                            <p className="text-red-700 dark:text-red-300">{emotionalState.initial}</p>
                          </div>
                          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Progress Made</h4>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${
                              emotionalState.progressNoted 
                                ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                            }`}>
                              {emotionalState.progressNoted ? 'Yes' : 'Minimal'}
                            </div>
                          </div>
                          <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                            <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Final State</h4>
                            <p className="text-emerald-700 dark:text-emerald-300">{emotionalState.final}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Therapeutic Techniques and Coping Strategies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {(sessionData.report as TherapyReport).therapeuticTechniquesUsed && (
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <BookOpen className="w-5 h-5 mr-3 text-purple-500" />
                        Therapeutic Techniques
                      </h3>
                      <div className="space-y-3">
                        {(sessionData.report as TherapyReport).therapeuticTechniquesUsed!.map((technique, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-gray-700 dark:text-gray-300">{technique}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(sessionData.report as TherapyReport).copingStrategiesDiscussed && (
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-blue-500" />
                        Coping Strategies
                      </h3>
                      <div className="space-y-3">
                        {(sessionData.report as TherapyReport).copingStrategiesDiscussed!.map((strategy, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-700 dark:text-gray-300">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Breakthroughs */}
                {(sessionData.report as TherapyReport).keyBreakthroughs && (
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Lightbulb className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-amber-500" />
                      Key Breakthroughs
                    </h3>
                    <div className="space-y-4">
                      {(sessionData.report as TherapyReport).keyBreakthroughs!.map((breakthrough, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800"
                        >
                          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{breakthrough}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {(sessionData.report as TherapyReport).riskAssessment && (
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Shield className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-red-500" />
                      Risk Assessment
                    </h3>
                    {(() => {
                      const riskAssessment = (sessionData.report as TherapyReport).riskAssessment!;
                      return (
                        <div className="space-y-6">
                          <div className={`inline-flex items-center px-4 py-2 rounded-xl font-medium border-2 ${getRiskColor(riskAssessment.level)}`}>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Risk Level: {riskAssessment.level}
                          </div>
                          
                          {riskAssessment.indicators && riskAssessment.indicators.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Indicators</h4>
                              <div className="space-y-2">
                                {riskAssessment.indicators.map((indicator, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300">{indicator}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {riskAssessment.recommendedActions && riskAssessment.recommendedActions.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommended Actions</h4>
                              <div className="space-y-2">
                                {riskAssessment.recommendedActions.map((action, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300">{action}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SessionReport;