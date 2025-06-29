import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, TestTube, X, Volume2 } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: string;
  styles: string[];
}

interface VoiceSettings {
  voiceId: string;
  style: string;
  speed: number;
  gender: 'all' | 'male' | 'female';
  language: string;
}

interface VoiceSettingsPanelProps {
  showVoiceSettings: boolean;
  voiceSettings: VoiceSettings;
  availableVoices: Voice[];
  isTestingVoice: boolean;
  onClose: () => void;
  onVoiceSettingsChange: (settings: Partial<VoiceSettings>) => void;
  onTestVoice: () => void;
}

export const VoiceSettingsPanel: React.FC<VoiceSettingsPanelProps> = ({
  showVoiceSettings,
  voiceSettings,
  availableVoices,
  isTestingVoice,
  onClose,
  onVoiceSettingsChange,
  onTestVoice
}) => {
  const selectedVoice = availableVoices.find(v => v.id === voiceSettings.voiceId);

  const handleVoiceChange = (voiceId: string) => {
    const selectedVoice = availableVoices.find(v => v.id === voiceId);
    if (selectedVoice) {
      onVoiceSettingsChange({
        voiceId,
        style: selectedVoice.styles[0] // Reset to first available style
      });
    }
  };

  return (
    <AnimatePresence>
      {showVoiceSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voice Settings</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={voiceSettings.language}
                onChange={(e) => onVoiceSettingsChange({ language: e.target.value })}
              >
                <option value="en-US">English (US)</option>
                <option value="hi-IN">Hindi (India)</option>
                <option value="es-ES">Spanish (Spain)</option>
                <option value="fr-FR">French (France)</option>
                <option value="de-DE">German (Germany)</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={voiceSettings.gender}
                onChange={(e) => onVoiceSettingsChange({ gender: e.target.value as 'all' | 'male' | 'female' })}
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={voiceSettings.voiceId}
                onChange={(e) => handleVoiceChange(e.target.value)}
              >
                {availableVoices.map(voice => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} ({voice.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Style
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={voiceSettings.style}
                onChange={(e) => onVoiceSettingsChange({ style: e.target.value })}
                disabled={!selectedVoice}
              >
                {selectedVoice?.styles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Speed Control */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Speed: {voiceSettings.speed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={voiceSettings.speed}
              onChange={(e) => onVoiceSettingsChange({ speed: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>2.0x</span>
            </div>
          </div>

          {/* Test and Apply Buttons */}
          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTestVoice}
              disabled={isTestingVoice}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isTestingVoice 
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <TestTube className="w-4 h-4" />
              {isTestingVoice ? 'Testing...' : 'Test Voice'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
            >
              <Volume2 className="w-4 h-4" />
              Apply Settings
            </motion.button>
          </div>

          {/* Current Settings Display */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Current Configuration</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><span className="font-medium">Gender:</span> {voiceSettings.gender}</p>
              <p><span className="font-medium">Voice:</span> {selectedVoice?.name}</p>
              <p><span className="font-medium">Style:</span> {voiceSettings.style}</p>
              <p><span className="font-medium">Speed:</span> {voiceSettings.speed}x</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};