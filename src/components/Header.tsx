import React from 'react';
import { Brain, Flame, Trophy, Moon, Sun, Home, BarChart2 } from 'lucide-react';
import { GameId } from '../types';

interface HeaderProps {
  activeGame: GameId | null;
  onGoHome: () => void;
  totalBrainScore: number;
  bestStreak: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenStats: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeGame,
  onGoHome,
  totalBrainScore,
  bestStreak,
  theme,
  onToggleTheme,
  onOpenStats,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Brand Mark */}
        <button
          onClick={onGoHome}
          className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          title="Go to Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              Brain Power
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Cognitive Training
            </span>
          </div>
        </button>

        {/* Zone 2: Inline Stats (Quick Glance) */}
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Score:</span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
              {totalBrainScore.toLocaleString()}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Best Streak:</span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
              {bestStreak}
            </span>
          </div>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {activeGame && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
              title="Return to Game Menu"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Home</span>
            </button>
          )}

          <button
            onClick={onOpenStats}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="View Player Stats"
            aria-label="View Stats"
          >
            <BarChart2 className="h-4 w-4" />
          </button>

          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
