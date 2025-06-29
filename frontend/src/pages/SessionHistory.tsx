import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {   
  Clock,    
  Download, 
  Filter,
  BarChart3,
  MessageCircle,
  Heart,
  Trophy,
  Star,
  Loader2,
  AlertCircle,
  Eye,
  FileText,
  RefreshCw,
  Brain,  
  ChevronDown,
  Search,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

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
  reportSummary: {
    score: number;
    conversationSummary: string;
    engagementLevel?: string;
    sessionLength?: string;
  };
}

interface UserStats {
  totalSessions: number;
  communicationSessions: number;
  therapySessions: number;
  averageScore: number;
  totalPracticeTime: number;
  totalPracticeTimeFormatted: string;
  coachDistribution: Array<{ name: string; count: number }>;
  scoreProgression: Array<{ sessionNumber: number; score: number; date: string; type: string }>;
  recentActivity: Array<{
    sessionId: string;
    coachName: string;
    score: number;
    date: string;
    duration: string;
    type: string;
  }>;
  sessionTypeDistribution: {
    communication: number;
    therapy: number;
  };
}

export const SessionHistory: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('All Time');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();

  const filters = [
    { value: 'all', label: 'All Sessions', icon: BarChart3, color: 'bg-gradient-to-r from-purple-500 to-indigo-600' },
    { value: 'communication', label: 'Communication', icon: MessageCircle, color: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
    { value: 'therapy', label: 'Therapy', icon: Heart, color: 'bg-gradient-to-r from-red-500 to-pink-600' }
  ];
  const periods = ['All Time', 'This Week', 'This Month', 'Last 3 Months'];

  const userId = user?.id;

  // Fetch user sessions
  const fetchSessions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/reports/user/${userId}?page=${page}&limit=10&type=${selectedFilter}`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.data.sessions);
        setCurrentPage(data.data.pagination.currentPage);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        setError('Failed to fetch sessions');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/reports/stats/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchStats();
  }, [selectedFilter]);

  const handleViewReport = (sessionId: string) => {
    navigate(`/session-report/${sessionId}`);
  };

  const handlePageChange = (page: number) => {
    fetchSessions(page);
  };

  const handleRefresh = () => {
    fetchSessions(currentPage);
    fetchStats();
  };  

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-800';
    return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800';
  };

  const getSessionTypeIcon = (type: string) => {
    return type === 'communication' ? MessageCircle : Heart;
  };

  const getSessionTypeColor = (type: string) => {
    return type === 'communication' 
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800'
      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800';
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'Exceptional': return 'text-purple-600 dark:text-purple-400';
      case 'High': return 'text-green-600 dark:text-green-400';
      case 'Moderate': return 'text-blue-600 dark:text-blue-400';
      case 'Limited': return 'text-yellow-600 dark:text-yellow-400';
      case 'Minimal': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.coach.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Your Journey</h3>
            <p className="text-gray-600 dark:text-gray-400">Gathering your session history...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl mx-auto flex items-center justify-center mb-6 border-2 border-red-200 dark:border-red-800">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button 
              variant="primary" 
              onClick={handleRefresh}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Session History
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
                    Track your growth across communication and therapy sessions
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh} 
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  variant="primary"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {[
              { 
                label: 'Total Sessions', 
                value: stats.totalSessions, 
                icon: Activity, 
                color: 'from-purple-500 to-indigo-600',
                change: '+12%'
              },
              { 
                label: 'Communication', 
                value: stats.communicationSessions, 
                icon: MessageCircle, 
                color: 'from-blue-500 to-cyan-600',
                change: '+8%'
              },
              { 
                label: 'Therapy', 
                value: stats.therapySessions, 
                icon: Heart, 
                color: 'from-red-500 to-pink-600',
                change: '+15%'
              },
              { 
                label: 'Avg Score', 
                value: `${stats.averageScore}/100`, 
                icon: Trophy, 
                color: 'from-emerald-500 to-teal-600',
                change: '+5%'
              },
              { 
                label: 'Practice Time', 
                value: stats.totalPracticeTimeFormatted, 
                icon: Clock, 
                color: 'from-amber-500 to-orange-600',
                change: '+22%'
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="group"
                >
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-300 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" style={{backgroundImage: `linear-gradient(to right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`}}></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                        </div>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Modern Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions, coaches, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {filters.map(filter => {
                const IconComponent = filter.icon;
                return (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedFilter === filter.value
                        ? `${filter.color} text-white`
                        : 'bg-gray-100/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                    <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Period Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-all backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{selectedPeriod}</span>
                <span className="sm:hidden">Filter</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden z-10 min-w-[200px] shadow-lg"
                  >
                    {periods.map(period => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedPeriod === period ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/*  Sessions List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredSessions.map((session, index) => {
              const SessionIcon = getSessionTypeIcon(session.sessionType);
              return (
                <motion.div
                  key={session.sessionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-300 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex flex-col xl:flex-row gap-6">
                      {/* Session Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative flex-shrink-0">
                              <Avatar src={session.coach.avatarUrl} alt={session.coach.name} size="lg" className="ring-2 ring-white/50 dark:ring-gray-700/50 border-2 border-gray-200/50 dark:border-gray-700/50" />
                              <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${session.sessionType === 'communication' ? 'bg-blue-500' : 'bg-red-500'} rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800`}>
                                <SessionIcon className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                  {session.coach.name}
                                </h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSessionTypeColor(session.sessionType)}`}>
                                  <SessionIcon className="w-3 h-3 mr-1" />
                                  {session.sessionType === 'communication' ? 'Communication' : 'Therapy'}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                                {session.coach.category}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(session.sessionInfo.startTime), 'EEEE, MMMM d, yyyy • h:mm a')}
                              </p>
                            </div>
                          </div>
                          
                          {session.reportSummary.score && (
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium ${getScoreBadgeColor(session.reportSummary.score)} flex-shrink-0`}
                            >
                              <Star className="w-4 h-4" />
                              <span className="text-lg font-bold">{session.reportSummary.score}</span>
                              <span className="text-sm opacity-75">/100</span>
                            </motion.div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Session Metrics */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                              <Target className="w-4 h-4 mr-2 text-blue-500" />
                              Session Metrics
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Duration</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {session.sessionInfo.durationFormatted}
                                </span>
                              </div>
                              {session.reportSummary.engagementLevel && (
                                <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Zap className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Engagement</span>
                                  </div>
                                  <span className={`text-sm font-medium ${getEngagementColor(session.reportSummary.engagementLevel)}`}>
                                    {session.reportSummary.engagementLevel}
                                  </span>
                                </div>
                              )}
                              {session.reportSummary.sessionLength && (
                                <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 col-span-2">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Brain className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Length</span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {session.reportSummary.sessionLength}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Session Summary */}
                          {session.reportSummary.conversationSummary && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-purple-500" />
                                Session Summary
                              </h4>
                              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-4 backdrop-blur-sm border-2 border-blue-200/20 dark:border-blue-800/20">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {session.reportSummary.conversationSummary.length > 150 
                                    ? session.reportSummary.conversationSummary.substring(0, 150) + '...'
                                    : session.reportSummary.conversationSummary
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Actions */}
                      <div className="xl:w-56 flex xl:flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleViewReport(session.sessionId)}
                          className="flex-1 xl:flex-none flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Report</span>
                        </motion.button>
                        <Button variant="outline" size="sm" className="flex-1 xl:flex-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 xl:flex-none hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                          <SessionIcon className="w-4 h-4 mr-2" />
                          Practice Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 w-full sm:w-auto"
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1 overflow-x-auto">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className={`w-10 h-10 rounded-lg font-medium transition-all border-2 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent'
                        : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    {page}
                  </motion.button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-gray-500 px-2">...</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={loading}
                    className={`w-10 h-10 rounded-lg font-medium transition-all border-2 ${
                      currentPage === totalPages
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent'
                        : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    {totalPages}
                  </motion.button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 w-full sm:w-auto"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredSessions.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center mb-8">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {searchTerm ? 'No matching sessions found' : 'Your journey starts here'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or filters to find more sessions.'
                : 'Start practicing with our AI coaches to see your session history here.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/conversation')}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-700 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Communication Session</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/therapy')}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all"
              >
                <Heart className="w-5 h-5" />
                <span>Start Therapy Session</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Loading overlay for pagination */}
        <AnimatePresence>
          {loading && sessions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 flex items-center space-x-4 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl"
              >
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-900 dark:text-white font-medium">Loading sessions...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};