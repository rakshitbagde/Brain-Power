import React, { useEffect } from 'react';
import { Trophy, Flame, RotateCcw, Home, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { triggerVictoryConfetti } from '../utils/confetti';

interface GameOverModalProps {
  isOpen: boolean;
  gameTitle: string;
  score: number;
  isNewHighScore: boolean;
  bestStreak: number;
  levelReached?: number;
  accuracy?: number; // percentage
  qpm?: number; // questions per minute
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  gameTitle,
  score,
  isNewHighScore,
  bestStreak,
  levelReached,
  accuracy,
  qpm,
  onPlayAgain,
  onHome,
}) => {
  useEffect(() => {
    if (isOpen && (isNewHighScore || score > 500)) {
      triggerVictoryConfetti();
    }
  }, [isOpen, isNewHighScore, score]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all transform scale-100">
        {/* Top badge / icon */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
              isNewHighScore
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
            } mb-3 shadow-inner`}
          >
            {isNewHighScore ? (
              <Sparkles className="h-8 w-8 animate-pulse" />
            ) : (
              <Trophy className="h-8 w-8" />
            )}
          </div>

          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {isNewHighScore ? 'New Personal Record!' : 'Game Over'}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {gameTitle} Complete
          </p>
        </div>

        {/* Score display */}
        <div className="my-5 rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 text-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            Final Score
          </span>
          <div className="mt-1 font-display text-4xl font-extrabold tabular-nums text-indigo-600 dark:text-indigo-400">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>Best Streak</span>
            </div>
            <div className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">
              {bestStreak}
            </div>
          </div>

          {levelReached !== undefined && (
            <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Level Reached</span>
              </div>
              <div className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                Level {levelReached}
              </div>
            </div>
          )}

          {accuracy !== undefined && (
            <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Accuracy</span>
              </div>
              <div className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                {accuracy}%
              </div>
            </div>
          )}

          {qpm !== undefined && (
            <div className="rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>Speed</span>
              </div>
              <div className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                {qpm} QPM
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 active:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Play Again</span>
          </button>
          <button
            onClick={onHome}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
