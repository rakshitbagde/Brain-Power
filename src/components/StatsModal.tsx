import React from 'react';
import { X, Trophy, Flame, Brain, Award, Zap, BookOpen, Clock, Trash2 } from 'lucide-react';
import { UserStats } from '../types';
import { getRankTitle, INITIAL_STATS, saveUserStats } from '../utils/storage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onStatsReset: (newStats: UserStats) => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onStatsReset,
}) => {
  if (!isOpen) return null;

  const rank = getRankTitle(stats.totalBrainScore);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your Brain Power scores and records?')) {
      saveUserStats(INITIAL_STATS);
      onStatsReset(INITIAL_STATS);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Player Profile & Stats
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cognitive performance tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Brain Rank Badge & Progress */}
        <div className="my-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Current Brain Rank
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {rank.title}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
              <Brain className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Next Rank Progress</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {stats.totalBrainScore.toLocaleString()} / {rank.nextScore.toLocaleString()} pts
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                style={{ width: `${rank.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Total Score</span>
            </div>
            <div className="mt-1 font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
              {stats.totalBrainScore.toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>Best Streak</span>
            </div>
            <div className="mt-1 font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
              {stats.bestStreak}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Zap className="h-3.5 w-3.5 text-indigo-500" />
              <span>Games</span>
            </div>
            <div className="mt-1 font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
              {stats.gamesPlayed}
            </div>
          </div>
        </div>

        {/* High Scores By Game */}
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Game Records & High Scores
        </h4>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Mathematical Puzzles
                </span>
                <div className="text-[11px] text-slate-500">
                  Best: Level {stats.bestLevels['math-puzzles']}
                </div>
              </div>
            </div>
            <div className="font-display font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {stats.highScores['math-puzzles'].toLocaleString()} pts
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Number Series
                </span>
                <div className="text-[11px] text-slate-500">
                  Best: Level {stats.bestLevels['number-series']}
                </div>
              </div>
            </div>
            <div className="font-display font-bold tabular-nums text-blue-600 dark:text-blue-400">
              {stats.highScores['number-series'].toLocaleString()} pts
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Memory Challenges
                </span>
                <div className="text-[11px] text-slate-500">
                  Numbers: Lvl {stats.bestLevels['memory-challenge-numbers']} · Cards: Lvl {stats.bestLevels['memory-challenge-cards']}
                </div>
              </div>
            </div>
            <div className="font-display font-bold tabular-nums text-purple-600 dark:text-purple-400">
              {stats.highScores['memory-challenge'].toLocaleString()} pts
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Speed Calculation
                </span>
                <div className="text-[11px] text-slate-500">
                  Top Speed: {stats.speedCalcBestQpm || 0} QPM
                </div>
              </div>
            </div>
            <div className="font-display font-bold tabular-nums text-rose-600 dark:text-rose-400">
              {stats.highScores['speed-calc'].toLocaleString()} pts
            </div>
          </div>
        </div>

        {/* Footer with Reset option */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Reset Stats</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
