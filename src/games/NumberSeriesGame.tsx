import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Trophy, Flame, Check, X, ArrowRight, Lightbulb } from 'lucide-react';
import { Difficulty, NumberSeriesQuestion } from '../types';
import { generateNumberSeriesQuestion } from './generators/numberSeries';
import { GameOverModal } from '../components/GameOverModal';
import { recordGameResult } from '../utils/storage';
import { triggerConfetti } from '../utils/confetti';

interface NumberSeriesGameProps {
  onHome: () => void;
  onUpdateGlobalStats: () => void;
}

export const NumberSeriesGame: React.FC<NumberSeriesGameProps> = ({
  onHome,
  onUpdateGlobalStats,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [question, setQuestion] = useState<NumberSeriesQuestion>(() =>
    generateNumberSeriesQuestion('medium')
  );

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  const loadNextQuestion = useCallback((diff: Difficulty) => {
    setSelectedOption(null);
    setFeedback(null);
    setShowExplanation(false);
    setQuestion(generateNumberSeriesQuestion(diff));
  }, []);

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
      setShowExplanation(true);
      const points = 75 + streak * 15;
      const newScore = score + points;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      triggerConfetti();

      // Automatically advance after brief reading delay, or allow user to press button/key
      setTimeout(() => {
        setLevel((prev) => prev + 1);
        loadNextQuestion(difficulty);
      }, 1600);
    } else {
      setFeedback('wrong');
      setShowExplanation(true);
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);

      if (newLives <= 0) {
        const res = recordGameResult('number-series', score, Math.max(bestStreak, streak), level);
        setIsNewHighScore(res.isNewHighScore);
        onUpdateGlobalStats();
        setTimeout(() => {
          setIsGameOver(true);
        }, 1800);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback !== null || isGameOver) {
        if ((e.key === 'Enter' || e.key === ' ') && showExplanation && lives > 0) {
          setLevel((prev) => prev + 1);
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
      {/* HUD Header */}
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Difficulty selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  difficulty === d
                    ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-300'
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
              <span className="font-display font-bold tabular-nums text-blue-600 dark:text-blue-400 text-sm">
                {score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Series Card */}
      <div
        className={`rounded-2xl border bg-white p-6 sm:p-8 shadow-sm transition-all duration-200 dark:bg-slate-900 ${
          feedback === 'correct'
            ? 'border-emerald-400 ring-2 ring-emerald-400/20 dark:border-emerald-600'
            : feedback === 'wrong'
            ? 'border-rose-400 ring-2 ring-rose-400/20 animate-shake dark:border-rose-600'
            : 'border-slate-200/80 dark:border-slate-800/80'
        }`}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              Pattern Recognition
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Series #{level}
            </span>
          </div>
          <h2 className="mt-1 text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100">
            Identify the governing rule and fill in the missing value.
          </h2>
        </div>

        {/* Series Sequence Badges Display */}
        <div className="my-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 p-6 rounded-2xl bg-slate-50/70 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
          {question.series.map((item, index) => {
            const isMissing = item === '?';
            return (
              <React.Fragment key={index}>
                <div
                  className={`flex min-w-[50px] sm:min-w-[64px] h-14 sm:h-16 px-3 items-center justify-center rounded-xl font-display text-xl sm:text-2xl font-bold transition-all shadow-xs ${
                    isMissing
                      ? feedback === 'correct'
                        ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : feedback === 'wrong'
                        ? 'border-2 border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300'
                        : 'border-2 border-dashed border-blue-400 bg-blue-50/70 text-blue-600 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 animate-pulse'
                      : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  {isMissing && feedback !== null ? question.answer : item}
                </div>
                {index < question.series.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-600 font-semibold text-base sm:text-lg">
                    ,
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="mt-8">
          <div className="mb-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            Choose the number that completes the series:
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === question.answer;

              let btnStyle =
                'border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500';

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
                  className={`group relative flex h-14 sm:h-16 items-center justify-between rounded-xl border p-4 text-base sm:text-lg font-bold shadow-xs transition-all active:scale-98 focus-visible:ring-2 focus-visible:ring-blue-500 ${btnStyle}`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
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

        {/* Detailed Explanation Banner */}
        {showExplanation && (
          <div
            className={`mt-6 rounded-xl border p-4 transition-all animate-in fade-in duration-200 ${
              feedback === 'correct'
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200'
                : 'border-blue-200 bg-blue-50/70 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <span className="font-semibold block mb-1">
                  Pattern: {question.ruleName}
                </span>
                <p className="leading-relaxed">{question.explanation}</p>

                {lives > 0 && feedback === 'wrong' && (
                  <button
                    onClick={() => {
                      setLevel((prev) => prev + 1);
                      loadNextQuestion(difficulty);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <span>Next Question</span>
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
        gameTitle="Number Series"
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
