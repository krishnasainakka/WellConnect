import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, MessageCircle, Target, Loader2, Users, BookOpen, TrendingUp, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useNavigate } from 'react-router-dom';

interface CommunicationCoach {
  _id: string;
  name: string;
  topic: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  difficulty: string;
  avatarUrl: string;
  learningObjectives: string[];
  isActive: boolean;
}

const categories = ['All', 'Professional', 'Personal', 'Leadership', 'Interpersonal', 'Public Speaking', 'Cross-Cultural', 'Other'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const CommunicationCoach: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [coaches, setCoaches] = useState<CommunicationCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch coaches from API
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/communication-coaches`);
        const data = await response.json();
        
        if (data.success) {
          setCoaches(data.data);
        } else {
          setError('Failed to fetch communication coaches');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching coaches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || coach.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || coach.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty && coach.isActive;
  });

  const handleStartPractice = (coachId: string) => {
    navigate(`/voice-assistant/communication-coach/${coachId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Communication Coaches</h3>
            <p className="text-gray-600 dark:text-gray-400">Finding the perfect coaches for you...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl mx-auto flex items-center justify-center mb-6 border-2 border-red-200 dark:border-red-800">
              <MessageCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Unable to load coaches
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Communication Coach
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
                    Practice workplace scenarios with AI-powered role-playing partners
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{filteredCoaches.length} coaches available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coaches, scenarios, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="lg:w-44">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Coaches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach, index) => (
            <motion.div
              key={coach._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden h-full flex flex-col border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Header */}
                <div className="relative p-6 pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      <Avatar src={coach.avatarUrl} alt={coach.name} size="lg" className="ring-2 ring-white/50 dark:ring-gray-700/50 border-2 border-gray-200/50 dark:border-gray-700/50" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <MessageCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
                        {coach.name}
                      </h3>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {coach.category}
                        </span>

                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {coach.topic}
                        </span>

                      </p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${getDifficultyColor(coach.difficulty)}`}>
                        {coach.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="relative px-6 pb-4 flex-1">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {coach.shortDescription}
                  </p>
                  
                  {/* Learning Objectives as Labels */}
                  {coach.learningObjectives && coach.learningObjectives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Learning Objectives
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {coach.learningObjectives.slice(0, 4).map((objective, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          >
                            {objective.length > 25 ? objective.substring(0, 25) + '...' : objective}
                          </span>
                        ))}
                        {coach.learningObjectives.length > 4 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                            +{coach.learningObjectives.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="relative px-6 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartPractice(coach._id)}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Practice</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Communication Resources
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div onClick={()=>{navigate('/articles')}}>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Communication Guides</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expert tips and best practices</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={()=>{navigate('/history')}}
              className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-300/50 dark:hover:border-emerald-700/50 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Progress Tracking</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your improvement</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300/50 dark:hover:border-purple-700/50 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Community Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect with other learners</p>
              </div>
            </motion.div>
          </div>
          
          {/* Quick Tips */}
          <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/50">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Tips for Effective Practice
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-800 dark:text-amber-200">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Practice regularly for 10-15 minutes daily</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Focus on one skill at a time</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Review your session reports for insights</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Apply learnings in real conversations</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Empty State */}
        {filteredCoaches.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-8">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No coaches found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Try adjusting your search terms or filters to find more coaches that match your learning goals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};