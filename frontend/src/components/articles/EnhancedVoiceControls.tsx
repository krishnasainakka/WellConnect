import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Volume2, Settings, Download } from 'lucide-react';

interface EnhancedVoiceControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean; 
  progress: number;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowSettings: () => void;
}

export const EnhancedVoiceControls: React.FC<EnhancedVoiceControlsProps> = ({
  isPlaying,
  isPaused,
  isLoading,
  progress,
  currentTime,
  duration,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onShowSettings
}) => {
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audio Player</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowSettings}
          className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Voice Settings</span>
        </motion.button>
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={onSeek}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg pointer-events-none"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          {/* Play / Loading */}
          {isLoading ? (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 animate-pulse">
              <svg className="w-5 h-5 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Preparing audio...</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlay}
              disabled={isPlaying && !isPaused}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isPlaying && !isPaused
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg'
              }`}
            >
              <Play className="w-5 h-5" />
              <span>Play Article</span>
            </motion.button>
          )}

          {/* Pause / Stop */}
          {isPlaying && !isLoading && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPause}
                className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
                className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                <Square className="w-4 h-4" />
                <span className="hidden sm:inline">Stop</span>
              </motion.button>
            </>
          )}
        </div>

        {/* Download Button (you can wire this up later) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-xl font-medium transition-all"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
