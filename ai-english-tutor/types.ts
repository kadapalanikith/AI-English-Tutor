export interface Story {
  id: string;
  title: string;
  text: string;
  translations: {
    [key: string]: string;
  };
}

export interface Dictionary {
  [key: string]: {
    [key: string]: string;
  };
}

export interface Goal {
  id: string;
  label: string;
  target: number;
  progress: number;
  done: boolean;
}

export interface TypingRecord {
  type: 'typing';
  wpm: number;
  accuracy: number;
  ts: number;
  typedChars: number;
}

export interface PronounceRecord {
  type: 'pronounce';
  score: number;
  ts: number;
  wordScores: { word: string; score: number }[];
}

export type PracticeRecord = TypingRecord | PronounceRecord;


export interface Streak {
  count: number;
  last: number;
}

export type Language = 'hi' | 'te';

export type Section = 'home' | 'learn' | 'type' | 'pronounce' | 'help';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}