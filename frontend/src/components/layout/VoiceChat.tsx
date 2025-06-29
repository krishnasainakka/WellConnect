import React, { useEffect, useRef, useState } from 'react';
import type { Coach } from '../../types';
import StatusIndicators from './StatusIndicators';

interface VoiceChatProps {
  coach: Coach | null;
  isConnected: boolean;
  sessionStarted: boolean;
  liveText: string;
  isRecording: boolean;
  isSpeaking: boolean;
  coachSetup: boolean;
  initialMessageReceived: boolean;
  error: string | null;
  onStartSession: () => void;
  onEndSession: () => void;
  onToggleMicrophone: () => void;
  onClearError: () => void;
}

const VoiceChat: React.FC<VoiceChatProps> = ({
  coach,
  isConnected,
  sessionStarted,
  liveText,
  isRecording,
  isSpeaking,
  coachSetup,
  initialMessageReceived,
  error,
  onStartSession,
  onEndSession,
  onToggleMicrophone,
  onClearError
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerInitializedRef = useRef<boolean>(false); // To avoid reinitializing timer

  useEffect(() => {
    if (sessionStarted && !timerInitializedRef.current) {
      setTimeLeft(15 * 60); // 15 minutes
      timerInitializedRef.current = true;

      sessionTimeoutRef.current = setTimeout(() => {
        onEndSession();
      }, 15 * 60 * 1000);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (!sessionStarted) {
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      sessionTimeoutRef.current = null;
      intervalRef.current = null;
      timerInitializedRef.current = false;
      setTimeLeft(0);
    }
  }, [sessionStarted, onEndSession]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (!isConnected) return 'Connecting...';
    if (!coachSetup) return 'Setting up coach...';
    if (!sessionStarted) return 'Ready to start session';
    if (coachSetup && !initialMessageReceived) return 'Coach is preparing to speak...';
    if (isSpeaking) return 'Coach is speaking...';
    if (isRecording) return 'Listening...';
    return 'Click the microphone to speak';
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full border border-gray-200 dark:border-gray-700">
      
      {/* Countdown Timer */}
      {sessionStarted && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className={`px-6 py-2 rounded-full shadow-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
            ${timeLeft <= 60 ? 'animate-pulse' : ''}`}>
            <span className="text-3xl font-bold text-red-600 tracking-widest">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          {isConnected && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {coach?.name || 'Communication Coach'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {coach?.longDescription || 'Professional communication skills trainer'}
        </p>

        <StatusIndicators isConnected={isConnected} sessionStarted={sessionStarted} />

        {/* Live Text Display */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-8 min-h-[4rem] flex items-center justify-center border border-gray-200 dark:border-gray-600">
          <div className="text-gray-700 dark:text-gray-300 text-center">
            {liveText || getStatusMessage()}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="space-y-4">
          {!sessionStarted ? (
            <button
              onClick={onStartSession}
              disabled={!coachSetup || !isConnected}
              className={`w-full px-6 py-4 rounded-xl text-white font-semibold transition-all transform hover:scale-105 shadow-lg ${
                !coachSetup || !isConnected
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
                Start Session
              </div>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onToggleMicrophone}
                className={`flex-1 px-6 py-4 rounded-xl text-white font-semibold transition-all transform hover:scale-105 shadow-lg ${
                  isRecording
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {isRecording ? 'Stop' : 'Speak'}
                </div>
              </button>
              <button
                onClick={onEndSession}
                className="px-6 py-4 rounded-xl text-white font-semibold transition-all transform hover:scale-105 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9V10z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
              <button
                onClick={onClearError}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
