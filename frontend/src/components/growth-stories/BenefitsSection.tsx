import React from 'react';
import { motion } from 'framer-motion';
import { Star, Brain, Heart, Sparkles } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <Star className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        Why Growth Stories Work
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-300/50 dark:hover:border-emerald-700/50 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Perspective Shift</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Reframe challenges as growth opportunities</p>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Emotional Healing</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Process emotions through narrative</p>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300/50 dark:hover:border-purple-700/50 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Hope & Inspiration</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Find meaning in difficult experiences</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};