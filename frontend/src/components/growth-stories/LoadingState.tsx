import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  isLoading: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Crafting Your Story
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Our AI is creating a personalized growth story just for you...
        </p>
      </div>
    </motion.div>
  );
};