import { useState, useRef, useEffect } from 'react';
import { convertFloat32ToInt16, downsampleBuffer } from '../utils/audioUtils';

export const useAudio = (onAudioData: (data: ArrayBuffer) => void, onError: (error: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      console.log('🔇 Audio playback ended');
      setIsSpeaking(false);
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }
    };

    const handleError = (e: Event) => {
      console.error('🔇 Audio error:', e);
      setIsSpeaking(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const handleAudioReady = (event: CustomEvent) => {
      const { audioUrl } = event.detail;
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
        audioRef.current.src = audioUrl;
        setIsSpeaking(true);
        audioRef.current.play().catch(console.error);
      }
    };

    window.addEventListener('audioReady', handleAudioReady as EventListener);
    return () => window.removeEventListener('audioReady', handleAudioReady as EventListener);
  }, []);

  const startRecording = async () => {
    try {
      onError('');

      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsSpeaking(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 44100 });
      contextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(input, audioContext.sampleRate, 16000);
        if (!downsampled) return;

        const int16 = convertFloat32ToInt16(downsampled);
        onAudioData(int16.buffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      setIsRecording(true);
      console.log('🎤 Recording started');

    } catch (err) {
      console.error('🎤 Failed to start recording:', err);
      onError('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    try {
      processorRef.current?.disconnect();
      sourceRef.current?.disconnect();
      contextRef.current?.close();
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      setIsRecording(false);
      console.log('🛑 Recording stopped');
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const stopAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  };

  return {
    isRecording,
    isSpeaking,
    audioRef,
    startRecording,
    stopRecording,
    toggleRecording,
    stopAudio
  };
};