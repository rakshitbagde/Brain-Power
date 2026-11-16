import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Trophy, Flame, Zap, Check, X, Play } from 'lucide-react';
import { SpeedCalcQuestion } from '../types';
import { generateSpeedCalcQuestion, getComboMultiplier } from './generators/speedCalc';
import { NumericKeypad } from '../components/NumericKeypad';
import { GameOverModal } from '../components/GameOverModal';
import { recordGameResult } from '../utils/storage';
import { triggerConfetti } from '../utils/confetti';

interface SpeedCalcGameProps {
  onHome: () => void;
  onUpdateGlobalStats: () => void;
}

export const SpeedCalcGame: React.FC<SpeedCalcGameProps> = ({
  onHome,
  onUpdateGlobalStats,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Statistics
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);

  // Question & input
  const [currentQuestion, setCurrentQuestion] = useState<SpeedCalcQuestion>(() =>
    generateSpeedCalcQuestion(0)
  );
  const [inputVal, setInputVal] = useState<string>('');
  const [feedbackEffect, setFeedbackEffect] = useState<'correct' | 'wrong' | null>(null);

  // End state
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start game countdown
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setInputVal('');
    setFeedbackEffect(null);
    setIsGameOver(false);
    setIsNewHighScore(false);
    setCurrentQuestion(generateSpeedCalcQuestion(0));
  }, []);

  // 60-second countdown timer
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isGameOver]);

  const handleTimeUp = useCallback(() => {
    setIsPlaying(false);

    // Calculate final metrics
    const qpm = totalAnswered; // 60 seconds total, so total answered = QPM
    const res = recordGameResult('speed-calc', score, bestStreak, undefined, undefined, qpm);
    setIsNewHighScore(res.isNewHighScore);
    onUpdateGlobalStats();
    setIsGameOver(true);
  }, [totalAnswered, score, bestStreak, onUpdateGlobalStats]);

  const handleSubmitAnswer = () => {
    if (!isPlaying || !inputVal.trim()) return;

    const parsed = parseInt(inputVal.trim(), 10);
    const isCorrect = parsed === currentQuestion.answer;

    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      const multiplier = getComboMultiplier(streak);
      const basePoints = 20;
      const points = Math.round(basePoints * multiplier);

      const newStreak = streak + 1;
      setScore((s) => s + points);
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setTotalCorrect((c) => c + 1);

      setFeedbackEffect('correct');
      if (newStreak % 5 === 0) {
        triggerConfetti(0.4);
      }
    } else {
      setStreak(0);
      setFeedbackEffect('wrong');
    }

    // Reset feedback effect quickly for fluid fast typing
    setTimeout(() => {
      setFeedbackEffect(null);
    }, 250);

    // Advance to next question immediately
    setInputVal('');
    setCurrentQuestion(generateSpeedCalcQuestion(isCorrect ? streak + 1 : 0));
  };

  // Keyboard support: Numbers, Backspace, Enter
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setInputVal((prev) => (prev.length < 5 ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        setInputVal((prev) => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        handleSubmitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, inputVal, currentQuestion, streak]);

  // Handle keypad inputs
  const handleDigit = (digit: string) => {
    if (inputVal.length < 5) {
      setInputVal((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setInputVal((prev) => prev.slice(0, -1));
  };

  const comboMultiplier = getComboMultiplier(streak);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const qpm = totalAnswered;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-6">
      {/* Top HUD Card */}
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 60s Timer */}
          <div className="flex items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold font-mono text-sm shadow-xs ${
                timeLeft <= 10
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
              }`}
            >
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Time Remaining
              </div>
              <div
                className={`font-mono text-xl font-bold tabular-nums ${
                  timeLeft <= 10 ? 'text-rose-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Combo Multiplier badge */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs ${
                comboMultiplier > 1
                  ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-300 text-orange-600 dark:border-orange-500/30 dark:text-orange-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <Flame
                className={`h-4 w-4 ${
                  comboMultiplier > 1 ? 'text-orange-500 fill-orange-500 animate-bounce' : 'text-slate-400'
                }`}
              />
              <span>{comboMultiplier}x Multiplier</span>
            </div>
          </div>

          {/* Score & Streak */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                {streak}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="font-display font-bold tabular-nums text-indigo-600 dark:text-indigo-400 text-sm">
                {score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculation Arena */}
      {!isPlaying && !isGameOver ? (
        /* Pre-game Ready Card */
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-4 shadow-inner">
            <Zap className="h-8 w-8" />
          </div>

          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            60-Second Speed Calculation
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Solve as many arithmetic questions as you can in 60 seconds! Build streaks to activate
            up to a 3.0x combo multiplier.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={startGame}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Play className="h-5 w-5 fill-white" />
              <span>Start 60s Challenge</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Game Arena */
        <div
          className={`rounded-2xl border bg-white p-6 sm:p-8 shadow-sm transition-all duration-150 dark:bg-slate-900 ${
            feedbackEffect === 'correct'
              ? 'border-emerald-500 ring-4 ring-emerald-500/20'
              : feedbackEffect === 'wrong'
              ? 'border-rose-500 ring-4 ring-rose-500/20 animate-shake'
              : 'border-slate-200/80 dark:border-slate-800/80'
          }`}
        >
          {/* Question Equation Display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="flex items-center gap-3 sm:gap-4 font-display text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              <span>{currentQuestion.num1}</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {currentQuestion.operator}
              </span>
              <span>{currentQuestion.num2}</span>
              <span className="text-slate-400">=</span>
              <span className="text-indigo-600 dark:text-indigo-400">?</span>
            </div>

            {/* Answer Display Field */}
            <div className="mt-6 flex h-14 sm:h-16 w-full max-w-xs items-center justify-center rounded-xl border-2 border-indigo-500/80 bg-slate-50 px-4 font-display text-3xl sm:text-4xl font-extrabold tracking-wider text-slate-900 shadow-inner dark:bg-slate-950 dark:text-white">
              {inputVal ? (
                inputVal
              ) : (
                <span className="text-slate-300 dark:text-slate-700 text-lg font-normal tracking-normal">
                  Type & Enter
                </span>
              )}
            </div>
          </div>

          {/* On-screen touch keypad */}
          <div className="mt-6">
            <NumericKeypad
              onDigit={handleDigit}
              onDelete={handleDelete}
              onSubmit={handleSubmitAnswer}
              submitLabel="Enter"
            />
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        gameTitle="Speed Calculation"
        score={score}
        isNewHighScore={isNewHighScore}
        bestStreak={bestStreak}
        accuracy={accuracy}
        qpm={qpm}
        onPlayAgain={startGame}
        onHome={onHome}
      />
    </div>
  );
};
