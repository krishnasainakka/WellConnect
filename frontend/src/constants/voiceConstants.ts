import type { VoiceOption } from '../types';

export const voiceOptions: Record<'female' | 'male', VoiceOption[]> = {
  female: [
    { id: 'en-US-amara', name: 'Amara', language: 'English (US)' },
    { id: 'en-US-alice', name: 'Alice', language: 'English (US)' },
    { id: 'en-US-ashley', name: 'Ashley', language: 'English (US)' },
    { id: 'en-AU-natalie', name: 'Natalie', language: 'English (AU)' }
  ],
  male: [
    { id: 'en-US-alex', name: 'Alex', language: 'English (US)' },
    { id: 'en-US-brandon', name: 'Brandon', language: 'English (US)' },
    { id: 'en-US-brian', name: 'Brian', language: 'English (US)' },
    { id: 'en-GB-charles', name: 'Charles', language: 'English (UK)' },
    { id: 'en-GB-clint', name: 'Clint', language: 'English (UK)' },
    { id: 'en-IN-dhruv', name: 'Dhruv', language: 'English (IN)' }
  ]
};

export const styleOptions = [
  'Conversational',
  'Narrative',
  'Promotional',
  'Educational',
  'Professional'
];

export const speedOptions = [
  'Slow',
  'Normal',
  'Fast'
];