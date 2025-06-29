import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Play, Loader2 } from 'lucide-react';

interface TranslationPanelProps {
  targetLang: string;
  translatedContent: string | null;
  isTranslating: boolean;
  onTargetLangChange: (lang: string) => void;
  onTranslate: () => void;
  onPlayTranslated: () => void;
}

const languages = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' }
];

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  targetLang,
  translatedContent,
  isTranslating,
  onTargetLangChange,
  onTranslate,
  onPlayTranslated
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Translation</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 min-w-0 flex-shrink-0">
            Translate to:
          </label>
          <select
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={targetLang}
            onChange={(e) => onTargetLangChange(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTranslate}
            disabled={isTranslating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isTranslating
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                Translate
              </>
            )}
          </motion.button>
        </div>

        {isTranslating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Translating content...</p>
            </div>
          </motion.div>
        )}

        {translatedContent && !isTranslating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-2 border-indigo-200/50 dark:border-indigo-800/50">
              <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Translated Content</h4>
              <div className="max-h-64 overflow-y-auto">
                <p className="text-indigo-800 dark:text-indigo-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {translatedContent}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlayTranslated}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
            >
              <Play className="w-4 h-4" />
              Play Translated Audio
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};