export type GameId = 'math-puzzles' | 'number-series' | 'memory-challenge' | 'speed-calc';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface UserStats {
  totalBrainScore: number;
  gamesPlayed: number;
  bestStreak: number;
  highScores: {
    'math-puzzles': number;
    'number-series': number;
    'memory-challenge': number;
    'speed-calc': number;
  };
  bestLevels: {
    'math-puzzles': number;
    'number-series': number;
    'memory-challenge-numbers': number;
    'memory-challenge-cards': number;
  };
  speedCalcBestQpm: number;
}

export type MathPuzzleType = 'grid' | 'find_x' | 'balance' | 'riddle';

export interface MathPuzzleQuestion {
  id: string;
  type: MathPuzzleType;
  difficulty: Difficulty;
  title: string;
  instruction: string;
  gridData?: {
    size: 2 | 3;
    cells: (number | string)[]; // '?' is the missing one
    missingIndex: number;
  };
  equationDisplay?: string; // e.g. "3x + 12 = 39" or "🍎 + 🍎 = 10"
  riddleText?: string;
  answer: number;
  options: number[]; // 4 multiple choice options
  explanation: string;
}

export interface NumberSeriesQuestion {
  id: string;
  series: (number | string)[]; // e.g. [2, 4, 8, '?', 32]
  missingIndex: number;
  answer: number;
  options: number[];
  ruleName: string;
  explanation: string;
  difficulty: Difficulty;
}

export type MemoryMode = 'numbers' | 'cards';

export interface CardItem {
  id: string;
  pairId: number;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface SpeedCalcQuestion {
  id: string;
  num1: number;
  operator: '+' | '-' | '×' | '÷';
  num2: number;
  answer: number;
}
