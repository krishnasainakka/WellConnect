import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ArticleContent } from '../components/articles/ArticleContent';
import { EnhancedVoiceControls } from '../components/articles/EnhancedVoiceControls';
import { VoiceSettingsPanel } from '../components/articles/VoiceSettingsPanel';
import { TranslationPanel } from '../components/articles/TranslationPanel';
import { Button } from '../components/ui/Button';

interface Article {
  _id: string;
  title: string;
  shortDescription: string;
  fullContent: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  estimatedReadTime?: string;
  author?: string;
  createdAt: string;
}

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

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState<string>('en-US');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  // Voice settings state
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceId: 'en-US-natalie',
    style: 'Conversational',
    speed: 1.0,
    gender: 'all',
    language: 'en-US'
  });
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    fetchVoices();
  }, [voiceSettings.language, voiceSettings.gender]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentAudio && isPlaying && !isPaused) {
        setCurrentTime(currentAudio.currentTime);
        setDuration(currentAudio.duration || 0);
        const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
        setProgress(percent);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentAudio, isPlaying, isPaused]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/articles/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVoices = async () => {
    try {
      const genderParam = voiceSettings.gender === 'all' ? '' : voiceSettings.gender;
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/tts/voices?language=${voiceSettings.language}${genderParam ? `&gender=${genderParam}` : ''}`
      );
      const data = await response.json();
      setAvailableVoices(data.voices);
      
      // Update voiceId if current one is not available in filtered list
      if (data.voices.length > 0 && !data.voices.find((v: Voice) => v.id === voiceSettings.voiceId)) {
        setVoiceSettings(prev => ({
          ...prev,
          voiceId: data.voices[0].id,
          style: data.voices[0].styles[0]
        }));
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (currentAudio && currentAudio.duration) {
      currentAudio.currentTime = (value / 100) * currentAudio.duration;
    }
  };

  const handlePlay = async () => {
  if (!article || isPlaying) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  setIsLoading(true);
  setIsPlaying(false);
  setIsPaused(false);

  try {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/tts/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: article.fullContent,
        voiceId: voiceSettings.voiceId,
        style: voiceSettings.style,
        speed: voiceSettings.speed
      }),
    });

    if (!response.ok) throw new Error('Failed to fetch audio');

    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);
    const newAudio = new Audio(audioURL);

    // These will trigger later when audio starts
    newAudio.onplay = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    newAudio.onloadedmetadata = () => setDuration(newAudio.duration);
    newAudio.ontimeupdate = () => setCurrentTime(newAudio.currentTime);
    newAudio.onended = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    newAudio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    setCurrentAudio(newAudio);
    newAudio.play();
  } catch (err) {
    console.error('Playback error:', err);
    setIsPlaying(false);
    setIsLoading(false);
  }
};


  const handlePlayTranslated = async () => {
    if (!translatedContent || isPlaying) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setIsPlaying(true);
    setIsPaused(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/tts/translated-voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translatedContent,
          targetLang: targetLang,
          voiceId: voiceSettings.voiceId,
          style: voiceSettings.style,
          speed: voiceSettings.speed
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch translated audio');

      const blob = await response.blob();
      const audioURL = URL.createObjectURL(blob);
      const newAudio = new Audio(audioURL);

      newAudio.onloadedmetadata = () => setDuration(newAudio.duration);
      newAudio.ontimeupdate = () => setCurrentTime(newAudio.currentTime);
      newAudio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      newAudio.onerror = () => setIsPlaying(false);

      setCurrentAudio(newAudio);
      newAudio.play();
    } catch (err) {
      console.error('Translated playback error:', err);
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    if (!currentAudio) return;

    if (isPaused) {
      currentAudio.play();
      setIsPaused(false);
    } else {
      currentAudio.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (!currentAudio) return;

    currentAudio.pause();
    currentAudio.currentTime = 0;
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleTranslate = async () => {
    if (!article) return;
    setIsTranslating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/tts/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: article.fullContent,
          targetLanguage: targetLang,
        }),
      });
      if (!response.ok) throw new Error('Translation failed');
      const data = await response.json();
      setTranslatedContent(data.translatedText || 'Translation failed');
    } catch (err) {
      console.error('Translation failed:', err);
      setTranslatedContent('Translation failed');
    }
    setIsTranslating(false);
  };

  const handleTestVoice = async () => {
    if (isTestingVoice) return;

    if (testAudio) {
      testAudio.pause();
      testAudio.currentTime = 0;
    }

    setIsTestingVoice(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/tts/test-voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId: voiceSettings.voiceId,
          style: voiceSettings.style,
          speed: voiceSettings.speed
        }),
      });

      if (!response.ok) throw new Error('Failed to test voice');

      const blob = await response.blob();
      const audioURL = URL.createObjectURL(blob);
      const newTestAudio = new Audio(audioURL);

      newTestAudio.onended = () => setIsTestingVoice(false);
      newTestAudio.onerror = () => setIsTestingVoice(false);

      setTestAudio(newTestAudio);
      newTestAudio.play();
    } catch (err) {
      console.error('Voice test error:', err);
      setIsTestingVoice(false);
    }
  };

  const handleVoiceSettingsChange = (newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Article</h3>
            <p className="text-gray-600 dark:text-gray-400">Preparing your content...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl mx-auto flex items-center justify-center mb-6 border-2 border-red-200 dark:border-red-800">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Article not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/articles')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Articles
              </Button>
              <Button 
                variant="primary" 
                onClick={fetchArticle}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/articles')}
            className="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Articles</span>
          </motion.button>
        </motion.div>

        <div className="space-y-8">
          {/* Voice Controls */}
          <EnhancedVoiceControls
            isPlaying={isPlaying}
            isPaused={isPaused}
            isLoading={isLoading}
            progress={progress}
            currentTime={currentTime}
            duration={duration}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onSeek={handleSeek}
            onShowSettings={() => setShowVoiceSettings(!showVoiceSettings)}
          />

          {/* Voice Settings Panel */}
          <VoiceSettingsPanel
            showVoiceSettings={showVoiceSettings}
            voiceSettings={voiceSettings}
            availableVoices={availableVoices}
            isTestingVoice={isTestingVoice}
            onClose={() => setShowVoiceSettings(false)}
            onVoiceSettingsChange={handleVoiceSettingsChange}
            onTestVoice={handleTestVoice}
          />

          {/* Translation Panel */}
          <TranslationPanel
            targetLang={targetLang}
            translatedContent={translatedContent}
            isTranslating={isTranslating}
            onTargetLangChange={setTargetLang}
            onTranslate={handleTranslate}
            onPlayTranslated={handlePlayTranslated}
          />

          {/* Article Content */}
          <ArticleContent article={article} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;