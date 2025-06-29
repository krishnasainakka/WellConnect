import React, { useRef, useState, useEffect } from 'react';
import { GrowthStoriesHeader } from '../components/growth-stories/GrowthStoriesHeader';
import { StoryInput } from '../components/growth-stories/StoryInput';
import { StoryConfiguration } from '../components/growth-stories/StoryConfiguration';
import { AudioControls } from '../components/growth-stories/AudioControls';
import { StoryDisplay } from '../components/growth-stories/StoryDisplay';
import { LoadingState } from '../components/growth-stories/LoadingState';
import { BenefitsSection } from '../components/growth-stories/BenefitsSection';

interface Voice {
  id: string;
  name: string;
  gender: string;
  mood: string;
}

const GrowthStories: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [storyText, setStoryText] = useState('');
  const [genre, setGenre] = useState('Inspirational');
  const [selectedGender, setSelectedGender] = useState('female');
  const [voiceId, setVoiceId] = useState('en-US-julia');
  const [style, setStyle] = useState('Inspirational');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [generatedStory, setGeneratedStory] = useState('');
  const [storyMeta, setStoryMeta] = useState<any>(null);
  const [, setPendingStory] = useState(''); // temporarily store story text

  // Load voices when gender changes
  useEffect(() => {
    loadVoicesForGender(selectedGender);
  }, [selectedGender]);

  const loadVoicesForGender = async (gender: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/tts/voices-gender?gender=${gender}`
      );
      const data = await response.json();
      setAvailableVoices(data.voices || []);

      if (data.voices && data.voices.length > 0) {
        setVoiceId(data.voices[0].id);
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const playAudio = async () => {
    if (!storyText.trim()) return;
    setIsLoading(true);
    setGeneratedStory('');
    setStoryMeta(null);

    try {
      // Step 1: Generate story
      const genRes = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/story/generate-story`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: storyText, genre })
        }
      );

      if (!genRes.ok) throw new Error('Story generation failed');

      const storyData = await genRes.json();
      const { story } = storyData;
      setPendingStory(story); // don't display yet

      // Step 2: Stream TTS audio
      const ttsRes = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/tts/stream-story`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: story,
            voiceId,
            style,
            speed: 1.0,
            gender: selectedGender,
            mood: storyData.mood
          })
        }
      );

      if (!ttsRes.ok) throw new Error('TTS generation failed');

      const blob = await ttsRes.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        setGeneratedStory(story); // display now with voice
        setStoryMeta(storyData);

        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);

        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };

        audioRef.current.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };
      }
    } catch (err) {
      console.error('Error generating or playing story:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setPendingStory('');
      setIsLoading(false);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSpeechToText = async () => {
    try {
      setIsRecording(true);
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setStoryText(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed:', err);
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        <GrowthStoriesHeader />

        <StoryInput
          storyText={storyText}
          isRecording={isRecording}
          onStoryTextChange={setStoryText}
          onSpeechToText={handleSpeechToText}
        />

        <StoryConfiguration
          genre={genre}
          selectedGender={selectedGender}
          voiceId={voiceId}
          style={style}
          availableVoices={availableVoices}
          onGenreChange={setGenre}
          onGenderChange={setSelectedGender}
          onVoiceChange={setVoiceId}
          onStyleChange={setStyle}
        />

        <AudioControls
          isLoading={isLoading}
          isPlaying={isPlaying}
          storyText={storyText}
          audioRef={audioRef}
          onPlayAudio={playAudio}
          onPauseAudio={pauseAudio}
          onResumeAudio={resumeAudio}
          onStopAudio={stopAudio}
        />

        {/* Show story only when TTS is ready */}
        {generatedStory && (
          <StoryDisplay
            generatedStory={generatedStory}
            storyMeta={storyMeta}
          />
        )}

        <LoadingState isLoading={isLoading} />

        <BenefitsSection />
      </div>

      <audio ref={audioRef} hidden />
    </div>
  );
};

export default GrowthStories;
