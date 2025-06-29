import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, Settings, MessageCircle } from 'lucide-react';
import type { Coach } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAudio } from '../hooks/useAudio';
import VoiceChat from '../components/layout/VoiceChat';
import ChatHistory from '../components/layout/ChatHistory';

const VoiceAssistant = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    messages,
    liveText,
    isConnected,
    coachSetup,
    initialMessageReceived,
    sessionStarted,
    sendAudioData,
    startSession,
    endSession
  } = useWebSocket(coach, setError);

  const {
    isRecording,
    isSpeaking,
    audioRef,
    toggleRecording,
    stopAudio
  } = useAudio(sendAudioData, setError);

  // Fetch Coach Data
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        console.log('🔍 Fetching coach with ID:', id);

        let endpoint = '';
        if (type === 'communication-coach') {
          endpoint = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/communication-coaches/${id}`;
        } else if (type === 'therapy') {
          endpoint = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/therapy/${id}`;
        } else {
          throw new Error('Unknown coach type');
        }

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const responseData = await res.json();
        console.log('📦 API Response:', responseData);

        if (responseData.success && responseData.data) {
          setCoach(prevCoach => {
            if (prevCoach && prevCoach._id === responseData.data._id) {
              return prevCoach;
            }
            return responseData.data;
          });
          console.log('✅ Coach data set:', responseData.data);
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (err) {
        console.error('❌ Error fetching coach:', err);
        setError(`Failed to load coach: ${(err as Error).message}`);
      }
    };

    if (id && type) {
      fetchCoach();
    }
  }, [id, type]);

  const handleStartSession = () => {
    startSession(undefined, type);
  };

  const handleEndSession = () => {
    if (isRecording) toggleRecording();
    stopAudio();
    endSession();
  };

  const clearError = () => setError(null);

  const isReadyForInteraction = coachSetup && isConnected && sessionStarted;

  console.log('🎭 Rendering component - Coach:', coach?.name, 'Setup:', coachSetup, 'Session Started:', sessionStarted, 'Initial:', initialMessageReceived, 'Ready:', isReadyForInteraction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/conversation')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Coaches</span>
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Voice Assistant</h1>
              <p className="text-gray-600 dark:text-gray-400">Practice your communication skills with AI-powered coaching</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">Fixed Voice Coach</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">Real-time Chat</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Chatbot Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2"
          >
            <VoiceChat
              coach={coach}
              isConnected={isConnected}
              sessionStarted={sessionStarted}
              liveText={liveText}
              isRecording={isRecording}
              isSpeaking={isSpeaking}
              coachSetup={coachSetup}
              initialMessageReceived={initialMessageReceived}
              error={error}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onToggleMicrophone={toggleRecording}
              onClearError={clearError}
            />
          </motion.div>

          {/* Chat History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-1"
          >
            <ChatHistory
              coach={coach}
              messages={messages}
              sessionStarted={sessionStarted}
            />
          </motion.div>
        </div>
      </div>

      <audio ref={audioRef} hidden />
    </div>
  );
};

export default VoiceAssistant;
