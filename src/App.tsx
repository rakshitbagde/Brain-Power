import React, { useState, useEffect, useCallback } from 'react';
import { GameId, UserStats } from './types';
import { loadUserStats, getStoredTheme, setStoredTheme } from './utils/storage';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { StatsModal } from './components/StatsModal';
import { MathPuzzlesGame } from './games/MathPuzzlesGame';
import { NumberSeriesGame } from './games/NumberSeriesGame';
import { MemoryChallengesGame } from './games/MemoryChallengesGame';
import { SpeedCalcGame } from './games/SpeedCalcGame';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    setStoredTheme(savedTheme);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setStoredTheme(nextTheme);
  };

  const refreshStats = useCallback(() => {
    setStats(loadUserStats());
  }, []);

  // Keyboard shortcut: Escape returns to home if playing a game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isStatsModalOpen) {
          setIsStatsModalOpen(false);
        } else if (activeGame !== null) {
          setActiveGame(null);
          refreshStats();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, isStatsModalOpen, refreshStats]);

  const handleSelectGame = (gameId: GameId) => {
    setActiveGame(gameId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveGame(null);
    refreshStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Top Bar Contract */}
      <Header
        activeGame={activeGame}
        onGoHome={handleGoHome}
        totalBrainScore={stats.totalBrainScore}
        bestStreak={stats.bestStreak}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenStats={() => setIsStatsModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {activeGame === null && (
          <HomeScreen
            stats={stats}
            onSelectGame={handleSelectGame}
            onOpenStats={() => setIsStatsModalOpen(true)}
          />
        )}

        {activeGame === 'math-puzzles' && (
          <MathPuzzlesGame
            onHome={handleGoHome}
            onUpdateGlobalStats={refreshStats}
          />
        )}

        {activeGame === 'number-series' && (
          <NumberSeriesGame
            onHome={handleGoHome}
            onUpdateGlobalStats={refreshStats}
          />
        )}

        {activeGame === 'memory-challenge' && (
          <MemoryChallengesGame
            onHome={handleGoHome}
            onUpdateGlobalStats={refreshStats}
          />
        )}

        {activeGame === 'speed-calc' && (
          <SpeedCalcGame
            onHome={handleGoHome}
            onUpdateGlobalStats={refreshStats}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 dark:border-slate-800/80 dark:bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Brain Power Game · 100% Client-Side Procedural Cognitive Trainer</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Press Esc to return Home</span>
            <span>·</span>
            <span>Keyboard 1-4 supported</span>
          </div>
        </div>
      </footer>

      {/* Global Stats Modal */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
        onStatsReset={(newStats) => setStats(newStats)}
      />
    </div>
  );
}
