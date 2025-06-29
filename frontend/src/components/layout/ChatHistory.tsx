import React from 'react';
import { motion } from 'framer-motion';
import type { Coach, Message } from '../../types';

interface ChatHistoryProps {
  coach: Coach | null;
  messages: Message[];
  sessionStarted: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ coach, messages, sessionStarted }) => {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl h-full flex flex-col border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="p-6 border-b-2 border-gray-100/50 dark:border-gray-700/50 flex-shrink-0">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat History
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Conversation with your coach</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto min-h-0 max-h-[calc(100vh-250px)]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            {!sessionStarted ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p>Start a session to begin chatting with your coach</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="animate-pulse"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p>Coach is preparing to speak...</p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-4 h-full">
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm border-2 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md border-blue-300/50'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md border-gray-200/50 dark:border-gray-600/50'
                }`}>
                  <div className="text-xs opacity-75 mb-1">
                    {msg.role === 'user' ? 'You' : coach?.name || 'Coach'}
                  </div>
                  <div className="text-sm leading-relaxed">{msg.content}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;