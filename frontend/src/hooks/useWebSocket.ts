import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Coach, Message, WebSocketMessage } from '../types';
import { useAuth } from '../contexts/AuthContext'; 

export const useWebSocket = (coach: Coach | null, onError: (error: string) => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveText, setLiveText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [coachSetup, setCoachSetup] = useState(false);
  const [initialMessageReceived, setInitialMessageReceived] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const currentGeminiMessageRef = useRef('');
  const audioChunksRef = useRef(new Map<string, Uint8Array[]>());
  const coachSelectionSentRef = useRef(false);
  const sessionStartSentRef = useRef(false);

  // Initialize WebSocket
  useEffect(() => {
    console.log('🔌 Initializing WebSocket connection...');
    const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
    const ws = new WebSocket(websocketUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('🔗 WebSocket connected');
      setIsConnected(true);
      onError('');
    };
 
    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      console.log('📥 WebSocket message received:', data);

      if (data.type === 'coachSetup') {
        console.log('✅ Coach setup confirmed');
        setCoachSetup(true);
        return;
      }

      if (data.type === 'initialMessage') {
        console.log('📨 Initial message received');
        setInitialMessageReceived(true);
        currentGeminiMessageRef.current = '';
        if (data.geminiChunk) {
          currentGeminiMessageRef.current += data.geminiChunk;
          setMessages(prev => {
            if (prev.length === 0 || prev[0].role !== 'gemini' || !prev[0].isInitial) {
               return [{ role: 'gemini', content: currentGeminiMessageRef.current, id: Date.now(), isInitial: true }];
            } else {
               const newMessages = [...prev];
               newMessages[0].content = currentGeminiMessageRef.current;
               return newMessages;
            }
          });
        }
        return;
      }

      if (data.partial) setLiveText(data.partial);

      if (data.user) {
        setLiveText('');
        setMessages(prev => [...prev, { role: 'user', content: data.user ?? '', id: Date.now() }]);
        currentGeminiMessageRef.current = '';
      }

      if (data.geminiChunk) {
        currentGeminiMessageRef.current += data.geminiChunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const last = newMessages.at(-1);
          if (last && last.role === 'gemini') {
            last.content = currentGeminiMessageRef.current;
          } else {
            newMessages.push({ role: 'gemini', content: currentGeminiMessageRef.current, id: Date.now() });
          }
          return newMessages;
        });
      }

      if (data.geminiDone) {
        console.log('✅ Gemini response complete');
        currentGeminiMessageRef.current = '';
      }

      if (data.ttsAudioChunk) {
        const contextId = data.contextId || 'default';
        if (!audioChunksRef.current.has(contextId)) audioChunksRef.current.set(contextId, []);
        const byteCharacters = atob(data.ttsAudioChunk);
        const audioBuffer = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
        audioChunksRef.current.get(contextId)!.push(audioBuffer);
      }

      if (data.ttsDone) {
        const contextId = data.contextId || 'default';
        const chunks = audioChunksRef.current.get(contextId);
        if (chunks?.length) {
          const fullAudio = new Blob(chunks, { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(fullAudio);
          const event = new CustomEvent('audioReady', { detail: { audioUrl } });
          window.dispatchEvent(event);
          audioChunksRef.current.delete(contextId);
        }
      }

      if (data.type === 'sessionEnded' && data.success && data.sessionId) {
        navigate(`/session-report/${data.sessionId}`);
      }

      if (data.error) {
        console.error('❌ WebSocket error:', data.error);
        onError(data.error);
        if (data.fallbackText) setMessages(prev => [...prev, { role: 'system', content: `[Error] ${data.fallbackText}`, id: Date.now() }]);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
      setCoachSetup(false);
      setInitialMessageReceived(false);
      setSessionStarted(false);
      sessionStartSentRef.current = false;
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      onError('WebSocket connection error');
      setIsConnected(false);
    };

    return () => {
      console.log('🧹 Running WebSocket cleanup');
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('🔌 Closing WebSocket due to cleanup');
        wsRef.current.close();
      }
      wsRef.current = null;
      coachSelectionSentRef.current = false;
      sessionStartSentRef.current = false;
    };
  }, []); 

  // Send coach selection when ready
  useEffect(() => {
    console.log('🧪 Checking if coach selection should be sent', {
      coach: !!coach,
      isConnected,
      wsReady: wsRef.current?.readyState === WebSocket.OPEN,
      sentBefore: coachSelectionSentRef.current,
    });
    
    if (coach && isConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !coachSelectionSentRef.current) {
      console.log('📨 Sending coach selection:', coach.name);
      const coachMessage = { 
        type: 'selectCoach', 
        coach,
        userId: user?.id,
      };
      wsRef.current.send(JSON.stringify(coachMessage));
      coachSelectionSentRef.current = true;
    }
  }, [coach, isConnected, user]); 

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const sendAudioData = (audioData: ArrayBuffer) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(audioData);
    }
  };

  const startSession = (_unused: any, coachType?: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && coachSetup) {
      console.log('🚀 Starting session');
      wsRef.current.send(JSON.stringify({ 
        type: 'startSession',
        voiceConfig: coach?.voiceSettings,
        coachType
      }));
      setSessionStarted(true);
      sessionStartSentRef.current = true;
    }
  };

  const endSession = () => {
    console.log('🛑 Ending session');
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ 
        type: 'endSession',        
      }));
    }
    
    setSessionStarted(false);
    setInitialMessageReceived(false);
    setMessages([]);
    setLiveText('');
    sessionStartSentRef.current = false;
  };

  return {
    messages,
    liveText,
    isConnected,
    coachSetup,
    initialMessageReceived,
    sessionStarted,
    sendMessage,
    sendAudioData,
    startSession,
    endSession
  };
};