import React from 'react';
import {
  Brain,
  Trophy,
  Flame,
  Grid,
  TrendingUp,
  Layers,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { GameId, UserStats } from '../types';
import { getRankTitle } from '../utils/storage';

interface HomeScreenProps {
  stats: UserStats;
  onSelectGame: (gameId: GameId) => void;
  onOpenStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onSelectGame,
  onOpenStats,
}) => {
  const rank = getRankTitle(stats.totalBrainScore);

  const gameCards = [
    {
      id: 'math-puzzles' as GameId,
      title: 'Mathematical Puzzles',
      category: 'Logic & Equations',
      description:
        'Solve missing-grid numbers, "find x", balance multi-term equations, and tricky numeric riddles across 3 difficulty tiers.',
      gradient: 'from-emerald-500 to-teal-600',
      borderGlow: 'hover:border-emerald-400 dark:hover:border-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: Grid,
      highScore: stats.highScores['math-puzzles'],
      levelReached: stats.bestLevels['math-puzzles'],
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      features: ['Grid Logic', 'Symbolic Algebra', 'Balance Scales', '3 Difficulties'],
    },
    {
      id: 'number-series' as GameId,
      title: 'Number Series',
      category: 'Pattern Recognition',
      description:
        'Deduce the missing number in arithmetic, geometric, squares, Fibonacci, and alternating sequences, with instant step-by-step explanations.',
      gradient: 'from-blue-500 to-indigo-600',
      borderGlow: 'hover:border-blue-400 dark:hover:border-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      icon: TrendingUp,
      highScore: stats.highScores['number-series'],
      levelReached: stats.bestLevels['number-series'],
      accentColor: 'text-blue-600 dark:text-blue-400',
      features: ['Fibonacci Sequences', 'Squares & Geometric', 'Detailed Explanations', '4 Choices'],
    },
    {
      id: 'memory-challenge' as GameId,
      title: 'Memory Challenges',
      category: 'Working Memory',
      description:
        'Two distinct cognitive modes: flash-number sequence recall that expands every level, and progressive 3D card pair matching.',
      gradient: 'from-purple-500 to-violet-600',
      borderGlow: 'hover:border-purple-400 dark:hover:border-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      icon: Layers,
      highScore: stats.highScores['memory-challenge'],
      levelReached: Math.max(
        stats.bestLevels['memory-challenge-numbers'] || 1,
        stats.bestLevels['memory-challenge-cards'] || 1
      ),
      accentColor: 'text-purple-600 dark:text-purple-400',
      features: ['Digit Recall Flash', '3D Card Pairs', 'Adaptive Scaling', '2 Game Modes'],
    },
    {
      id: 'speed-calc' as GameId,
      title: 'Speed Calculation',
      category: 'Arithmetic Blitz',
      description:
        '60-second rapid-fire mental math with +, -, ×, ÷ questions. Chain consecutive correct answers to unlock 3x combo multipliers.',
      gradient: 'from-amber-500 to-rose-600',
      borderGlow: 'hover:border-rose-400 dark:hover:border-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      icon: Zap,
      highScore: stats.highScores['speed-calc'],
      levelReached: undefined,
      accentColor: 'text-rose-600 dark:text-rose-400',
      features: ['60s Countdown', 'Combo Multipliers', 'Accuracy & QPM', 'Instant Feedback'],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      {/* Hero Banner with Player Summary */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-6 sm:p-10 shadow-sm dark:border-slate-800/80 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-indigo-950/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Brain Power Gym</span>
              <span aria-hidden="true">·</span>
              <span>Procedurally Generated</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
              Train Your Mind with Logic, Math & Memory
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Sharpen your cognitive reflexes across four interactive brain games.
              Track your scores, sustain streaks, and reach Cognitive Grandmaster status.
            </p>
          </div>

          {/* Player Quick Stats Box */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 rounded-2xl bg-white/90 p-4 shadow-sm border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700/80 min-w-[240px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Brain Rank
                </span>
                <div className="font-display font-bold text-slate-900 dark:text-white">
                  {rank.title}
                </div>
              </div>
              <button
                onClick={onOpenStats}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Stats</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  <span>Total Score</span>
                </span>
                <div className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                  {stats.totalBrainScore.toLocaleString()}
                </div>
              </div>

              <div>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span>Best Streak</span>
                </span>
                <div className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                  {stats.bestStreak}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Game Cards Grid */}
      <div className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Choose a Training Discipline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Infinite non-repeating procedural puzzles generated on the fly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {gameCards.map((game) => {
            const Icon = game.icon;

            return (
              <div
                key={game.id}
                className={`group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-900 ${game.borderGlow} hover:shadow-md hover:-translate-y-0.5`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${game.gradient} text-white shadow-md`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {game.category}
                        </span>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {game.title}
                        </h3>
                      </div>
                    </div>

                    {/* High Score Badge */}
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Record
                      </span>
                      <div className="font-display font-bold tabular-nums text-sm text-slate-900 dark:text-white">
                        {game.highScore > 0 ? `${game.highScore.toLocaleString()} pts` : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {game.description}
                  </p>

                  {/* Feature bullet list */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {game.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => onSelectGame(game.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-xs group-hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span>Play {game.title}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights Footer Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-100/50 p-6 dark:border-slate-800/80 dark:bg-slate-900/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Infinite Procedural Puzzles
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Random generators mean no repeats.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-xs dark:bg-slate-800 dark:text-emerald-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Full Mobile & Keyboard Support
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Number pad + 1-4 shortcut keys.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-xs dark:bg-slate-800 dark:text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                100% Client-Side
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instant speed, runs offline & on Vercel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
