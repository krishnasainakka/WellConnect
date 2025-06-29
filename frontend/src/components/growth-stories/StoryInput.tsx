import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Mic } from 'lucide-react';

interface StoryInputProps {
  storyText: string;
  isRecording: boolean;
  onStoryTextChange: (text: string) => void;
  onSpeechToText: () => void;
}

export const StoryInput: React.FC<StoryInputProps> = ({
  storyText,
  isRecording,
  onStoryTextChange,
  onSpeechToText
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Brain className="w-5 sm:w-6 h-5 sm:h-6 mr-3 text-emerald-500" />
        What's on your mind?
      </h3>
      
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 w-full">
          <textarea
            className="w-full p-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all backdrop-blur-sm resize-none"
            rows={4}
            placeholder="Describe your situation, challenge, or what you're going through..."
            value={storyText}
            onChange={(e) => onStoryTextChange(e.target.value)}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSpeechToText}
          className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 transition-all ${
            isRecording 
              ? 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-600 animate-pulse' 
              : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-600/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-600'
          }`}
          title="Speak your story"
        >
          <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
        </motion.button>
      </div>
      
      {isRecording && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 dark:text-red-400 mt-3 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Listening...
        </motion.p>
      )}
    </motion.div>
  );
};