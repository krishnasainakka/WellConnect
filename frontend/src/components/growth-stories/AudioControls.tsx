import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Pause, Play, Square, Loader2 } from 'lucide-react';

interface AudioControlsProps {
  isLoading: boolean;
  isPlaying: boolean;
  storyText: string;
  audioRef: React.RefObject<HTMLAudioElement| null>;
  onPlayAudio: () => void;
  onPauseAudio: () => void;
  onResumeAudio: () => void;
  onStopAudio: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isLoading,
  isPlaying,
  storyText,
  audioRef,
  onPlayAudio,
  onPauseAudio,
  onResumeAudio,
  onStopAudio
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlayAudio}
          disabled={isLoading || !storyText.trim()}
          className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
          {isLoading ? 'Creating Story...' : 'Generate & Play Story'}
        </motion.button>

        {isPlaying && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPauseAudio}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg"
          >
            <Pause className="w-5 h-5" />
            Pause
          </motion.button>
        )}

        {audioRef.current?.paused === true && audioRef.current?.src && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResumeAudio}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg"
          >
            <Play className="w-5 h-5" />
            Resume
          </motion.button>
        )}

        {audioRef.current?.src && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStopAudio}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg"
          >
            <Square className="w-5 h-5" />
            Stop
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};