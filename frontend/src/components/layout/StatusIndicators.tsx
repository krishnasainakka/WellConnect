import React from 'react';
import { motion } from 'framer-motion';

interface StatusIndicatorsProps {
  isConnected: boolean;
  sessionStarted: boolean;
}

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({ isConnected, sessionStarted }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm shadow-sm ${
          isConnected 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        {isConnected ? 'Connected' : 'Disconnected'}
      </motion.div>
      {sessionStarted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          Session Active
        </motion.div>
      )}
    </div>
  );
};

export default StatusIndicators;