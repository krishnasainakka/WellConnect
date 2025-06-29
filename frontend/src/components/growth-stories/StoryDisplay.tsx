import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Tag, Clock } from 'lucide-react';

interface StoryDisplayProps {
  generatedStory: string;
  storyMeta: any;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
  generatedStory,
  storyMeta
}) => {
  if (!generatedStory) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BookOpen className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-emerald-500" />
          Your Growth Story
        </h3>
        {storyMeta && (
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800">
              <Tag className="w-3 h-3 mr-1" />
              {storyMeta.genre}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800">
              <Clock className="w-3 h-3 mr-1" />
              ~{storyMeta.estimatedReadTime} min
            </span>
          </div>
        )}
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-6 border-2 border-emerald-200/30 dark:border-emerald-800/30">
          {generatedStory}
        </div>
      </div>
    </motion.div>
  );
};