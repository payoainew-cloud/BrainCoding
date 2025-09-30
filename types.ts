export enum AppStep {
  INPUT,
  PRACTICE,
}

export enum HintLevel {
  FIRST_LETTER = 'Pierwsze Litery',
  EVERY_OTHER = 'Co Drugie Słowo',
  GAPS = 'Losowe Luki',
  SHAPE = 'Tylko Kształt',
  ZEN = 'Tryb Zen',
}

export interface PracticeResult {
  correctCount: number;
  incorrectCount: number;
  totalWords: number;
  accuracy: number;
  points: number;
}