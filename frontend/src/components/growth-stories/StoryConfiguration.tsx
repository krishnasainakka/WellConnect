import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  gender: string;
  mood: string;
}

interface StoryConfigurationProps {
  genre: string;
  selectedGender: string;
  voiceId: string;
  style: string;
  availableVoices: Voice[];
  onGenreChange: (genre: string) => void;
  onGenderChange: (gender: string) => void;
  onVoiceChange: (voiceId: string) => void;
  onStyleChange: (style: string) => void;
}

const genres = [
  'Inspirational',
  'Therapy Tale',
  'Workplace Drama',
  'Fable',
  'Realistic'
];

const voiceGenders = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' }
];

const styles = [
  'Storytelling',
  'Inspirational',
  'Professional',
  'Calm'
];

export const StoryConfiguration: React.FC<StoryConfigurationProps> = ({
  genre,
  selectedGender,
  voiceId,
  style,
  availableVoices,
  onGenreChange,
  onGenderChange,
  onVoiceChange,
  onStyleChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Zap className="w-5 h-5 mr-3 text-purple-500" />
        Story Configuration
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Genre
          </label>
          <select
            className="w-full p-3 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all backdrop-blur-sm"
            value={genre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Voice Gender
          </label>
          <select
            className="w-full p-3 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all backdrop-blur-sm"
            value={selectedGender}
            onChange={(e) => onGenderChange(e.target.value)}
          >
            {voiceGenders.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Voice
          </label>
          <select
            className="w-full p-3 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all backdrop-blur-sm"
            value={voiceId}
            onChange={(e) => onVoiceChange(e.target.value)}
          >
            {availableVoices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} - {voice.mood}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Style
          </label>
          <select
            className="w-full p-3 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all backdrop-blur-sm"
            value={style}
            onChange={(e) => onStyleChange(e.target.value)}
          >
            {styles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};