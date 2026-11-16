import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Trophy, Flame, HelpCircle, Check, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { Difficulty, MathPuzzleQuestion } from '../types';
import { generateMathPuzzleQuestion } from './generators/mathPuzzles';
import { GameOverModal } from '../components/GameOverModal';
import { recordGameResult } from '../utils/storage';
import { triggerConfetti } from '../utils/confetti';

interface MathPuzzlesGameProps {
  onHome: () => void;
  onUpdateGlobalStats: () => void;
}

export const MathPuzzlesGame: React.FC<MathPuzzlesGameProps> = ({
  onHome,
  onUpdateGlobalStats,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [question, setQuestion] = useState<MathPuzzleQuestion>(() =>
    generateMathPuzzleQuestion('medium')
  );

  // Interaction & feedback states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Initialize or generate next question
  const loadNextQuestion = useCallback(
    (currentDiff: Difficulty) => {
      setSelectedOption(null);
      setFeedback(null);
      setShowExplanation(false);
      setQuestion(generateMathPuzzleQuestion(currentDiff));
    },
    []
  );

  const handleDifficultyChange = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    loadNextQuestion(newDiff);
  };

  const handleAnswer = (chosenNumber: number) => {
    if (feedback !== null || isGameOver) return;
    setSelectedOption(chosenNumber);

    const isCorrect = chosenNumber === question.answer;

    if (isCorrect) {
      setFeedback('correct');
      const pointBonus = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 180;
      const streakBonus = streak * 15;
      const pointsEarned = pointBonus + streakBonus;

      const newScore = score + pointsEarned;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      triggerConfetti();

      // Automatically advance after brief celebration or show next button
      setTimeout(() => {
        setLevel((prev) => prev + 1);
        loadNextQuestion(difficulty);
      }, 1100);
    } else {
      setFeedback('wrong');
      setShowExplanation(true);
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);

      if (newLives <= 0) {
        // End game
        const res = recordGameResult('math-puzzles', score, Math.max(bestStreak, streak), level);
        setIsNewHighScore(res.isNewHighScore);
        onUpdateGlobalStats();
        setTimeout(() => {
          setIsGameOver(true);
        }, 1500);
      }
    }
  };

  // Keyboard support: 1, 2, 3, 4 for options
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback !== null || isGameOver) {
        if (e.key === 'Enter' && showExplanation && lives > 0) {
          loadNextQuestion(difficulty);
        }
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (question.options[index] !== undefined) {
          handleAnswer(question.options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feedback, isGameOver, question, showExplanation, lives, difficulty, loadNextQuestion]);

  const handleRestart = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setStreak(0);
    setIsGameOver(false);
    setIsNewHighScore(false);
    loadNextQuestion(difficulty);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-6">
      {/* Top HUD Card */}
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Difficulty Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  difficulty === d
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Level & Lives */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Level</span>
              <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                {level}
              </span>
            </div>

            <div className="flex items-center gap-1 text-rose-500">
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  className={`h-4 w-4 transition-transform ${
                    heartIndex <= lives
                      ? 'fill-rose-500 text-rose-500 scale-100'
                      : 'text-slate-300 dark:text-slate-700 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Score & Streak */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <Flame className="h-4 w-4 text-orange-500" />
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

      {/* Main Puzzle Card */}
      <div
        className={`rounded-2xl border bg-white p-6 sm:p-8 shadow-sm transition-all duration-200 dark:bg-slate-900 ${
          feedback === 'correct'
            ? 'border-emerald-400 ring-2 ring-emerald-400/20 dark:border-emerald-600'
            : feedback === 'wrong'
            ? 'border-rose-400 ring-2 ring-rose-400/20 animate-shake dark:border-rose-600'
            : 'border-slate-200/80 dark:border-slate-800/80'
        }`}
      >
        {/* Puzzle Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              {question.title}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Question #{level}
            </span>
          </div>
          <h2 className="mt-1 text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100">
            {question.instruction}
          </h2>
        </div>

        {/* Puzzle Content Display Area */}
        <div className="my-6 flex flex-col items-center justify-center min-h-[160px] rounded-xl bg-slate-50/70 p-6 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
          {/* 1. Grid Display */}
          {question.type === 'grid' && question.gridData && (
            <div
              className={`grid gap-3 select-none ${
                question.gridData.size === 2 ? 'grid-cols-2 max-w-[200px]' : 'grid-cols-3 max-w-[280px]'
              } w-full`}
            >
              {question.gridData.cells.map((cell, idx) => (
                <div
                  key={idx}
                  className={`flex aspect-square items-center justify-center rounded-xl font-display text-xl sm:text-2xl font-bold shadow-xs transition-all ${
                    cell === '?'
                      ? 'border-2 border-dashed border-indigo-400 bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-500 dark:text-indigo-400 animate-pulse'
                      : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>
          )}

          {/* 2. "Find x" / Equation Display */}
          {question.type === 'find_x' && question.equationDisplay && (
            <div className="text-center">
              <div className="whitespace-pre-line font-display text-2xl sm:text-3xl font-extrabold tracking-wide text-indigo-600 dark:text-indigo-400 leading-relaxed">
                {question.equationDisplay}
              </div>
            </div>
          )}

          {/* 3. Balance Equations Display */}
          {question.type === 'balance' && question.equationDisplay && (
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                {question.equationDisplay}
              </div>
            </div>
          )}

          {/* 4. Numeric Riddle Display */}
          {question.type === 'riddle' && question.riddleText && (
            <div className="max-w-xl text-center">
              <div className="rounded-xl p-4 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                "{question.riddleText}"
              </div>
            </div>
          )}
        </div>

        {/* Options Area (4 Multiple Choice Options) */}
        <div className="mt-8">
          <div className="mb-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            Select the correct answer (or press 1-4 on your keyboard):
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === question.answer;

              let btnStyle =
                'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500';

              if (feedback !== null) {
                if (isCorrectAnswer) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle =
                    'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500';
                } else {
                  btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedback !== null}
                  className={`group relative flex h-14 sm:h-16 items-center justify-between rounded-xl border p-4 text-base sm:text-lg font-bold shadow-xs transition-all active:scale-98 focus-visible:ring-2 focus-visible:ring-indigo-500 ${btnStyle}`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {idx + 1}
                  </span>
                  <span className="tabular-nums font-display text-xl">{opt}</span>
                  <div className="w-6">
                    {feedback !== null && isCorrectAnswer && (
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {feedback !== null && isSelected && !isCorrectAnswer && (
                      <X className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Banner (on wrong answer or when user wants to learn) */}
        {showExplanation && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-950/30 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-1">
                  Explanation & Solution:
                </span>
                <p className="whitespace-pre-line leading-relaxed">{question.explanation}</p>

                {lives > 0 && (
                  <button
                    onClick={() => loadNextQuestion(difficulty)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
                  >
                    <span>Continue to Next Puzzle</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        gameTitle="Mathematical Puzzles"
        score={score}
        isNewHighScore={isNewHighScore}
        bestStreak={bestStreak}
        levelReached={level}
        onPlayAgain={handleRestart}
        onHome={onHome}
      />
    </div>
  );
};
