import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, BookOpen, Users, Heart, TrendingUp } from 'lucide-react';

export const GrowthStoriesHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Growth Stories
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
                Transform your challenges into meaningful stories that offer perspective and hope
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>AI-Powered Stories</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { icon: BookOpen, label: 'Stories', value: '1000+', color: 'from-emerald-500 to-teal-600' },
            { icon: Users, label: 'Users Helped', value: '5K+', color: 'from-blue-500 to-cyan-600' },
            { icon: Heart, label: 'Positive Impact', value: '95%', color: 'from-red-500 to-pink-600' },
            { icon: TrendingUp, label: 'Growth Rate', value: '85%', color: 'from-purple-500 to-indigo-600' }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{stat.value}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};