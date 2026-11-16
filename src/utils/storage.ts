import { GameId, UserStats } from '../types';

const STATS_STORAGE_KEY = 'brain_power_user_stats_v1';
const THEME_STORAGE_KEY = 'brain_power_theme_v1';

export const INITIAL_STATS: UserStats = {
  totalBrainScore: 0,
  gamesPlayed: 0,
  bestStreak: 0,
  highScores: {
    'math-puzzles': 0,
    'number-series': 0,
    'memory-challenge': 0,
    'speed-calc': 0,
  },
  bestLevels: {
    'math-puzzles': 1,
    'number-series': 1,
    'memory-challenge-numbers': 1,
    'memory-challenge-cards': 1,
  },
  speedCalcBestQpm: 0,
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return INITIAL_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATS,
      ...parsed,
      highScores: {
        ...INITIAL_STATS.highScores,
        ...(parsed.highScores || {}),
      },
      bestLevels: {
        ...INITIAL_STATS.bestLevels,
        ...(parsed.bestLevels || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load stats', e);
    return INITIAL_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function recordGameResult(
  gameId: GameId,
  scoreEarned: number,
  streakAchieved: number,
  levelReached?: number,
  modeKey?: 'memory-challenge-numbers' | 'memory-challenge-cards',
  qpm?: number
): { isNewHighScore: boolean; isNewBestStreak: boolean; updatedStats: UserStats } {
  const current = loadUserStats();

  const currentHigh = current.highScores[gameId] || 0;
  const isNewHighScore = scoreEarned > currentHigh;
  const newHighScore = Math.max(currentHigh, scoreEarned);

  const isNewBestStreak = streakAchieved > current.bestStreak;
  const newBestStreak = Math.max(current.bestStreak, streakAchieved);

  const newBestLevels = { ...current.bestLevels };
  if (levelReached) {
    if (gameId === 'math-puzzles') {
      newBestLevels['math-puzzles'] = Math.max(newBestLevels['math-puzzles'], levelReached);
    } else if (gameId === 'number-series') {
      newBestLevels['number-series'] = Math.max(newBestLevels['number-series'], levelReached);
    } else if (modeKey) {
      newBestLevels[modeKey] = Math.max(newBestLevels[modeKey] || 1, levelReached);
    }
  }

  const updatedStats: UserStats = {
    ...current,
    totalBrainScore: current.totalBrainScore + scoreEarned,
    gamesPlayed: current.gamesPlayed + 1,
    bestStreak: newBestStreak,
    highScores: {
      ...current.highScores,
      [gameId]: newHighScore,
    },
    bestLevels: newBestLevels,
    speedCalcBestQpm: qpm ? Math.max(current.speedCalcBestQpm || 0, qpm) : current.speedCalcBestQpm,
  };

  saveUserStats(updatedStats);

  return {
    isNewHighScore,
    isNewBestStreak,
    updatedStats,
  };
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Failed to set theme', e);
  }
}

export function getRankTitle(totalScore: number): { title: string; nextScore: number; progress: number } {
  const ranks = [
    { title: 'Novice Thinker', min: 0, next: 500 },
    { title: 'Curious Mind', min: 500, next: 1500 },
    { title: 'Logic Apprentice', min: 1500, next: 3000 },
    { title: 'Brain Gymnast', min: 3000, next: 6000 },
    { title: 'Master Strategist', min: 6000, next: 10000 },
    { title: 'Cognitive Grandmaster', min: 10000, next: 20000 },
  ];

  for (let i = 0; i < ranks.length; i++) {
    const r = ranks[i];
    if (totalScore < r.next || i === ranks.length - 1) {
      const span = r.next - r.min;
      const progress = Math.min(100, Math.max(0, Math.round(((totalScore - r.min) / span) * 100)));
      return { title: r.title, nextScore: r.next, progress };
    }
  }
  return { title: 'Cognitive Grandmaster', nextScore: 20000, progress: 100 };
}
