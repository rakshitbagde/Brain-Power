import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  Trophy,
  Flame,
  Hash,
  Grid,
  Check,
  X,
  RotateCcw,
  Star,
  Zap,
  Sun,
  Moon,
  Compass,
  Anchor,
  Crown,
  Shield,
  Key,
  Eye,
  Bell,
  Gift,
  Music,
  Rocket,
  Atom,
} from 'lucide-react';
import { MemoryMode, CardItem } from '../types';
import { generateNumberMemorySequence, generateCardMatchDeck } from './generators/memoryChallenges';
import { NumericKeypad } from '../components/NumericKeypad';
import { GameOverModal } from '../components/GameOverModal';
import { recordGameResult } from '../utils/storage';
import { triggerConfetti, triggerVictoryConfetti } from '../utils/confetti';

interface MemoryChallengesGameProps {
  onHome: () => void;
  onUpdateGlobalStats: () => void;
}

// Icon mapper for Card Match
const IconRenderer: React.FC<{ name: string; className?: string }> = ({ name, className = 'h-7 w-7' }) => {
  switch (name) {
    case 'Star':
      return <Star className={`${className} text-amber-500 fill-amber-500`} />;
    case 'Heart':
      return <Heart className={`${className} text-rose-500 fill-rose-500`} />;
    case 'Zap':
      return <Zap className={`${className} text-yellow-500 fill-yellow-500`} />;
    case 'Flame':
      return <Flame className={`${className} text-orange-500 fill-orange-500`} />;
    case 'Sun':
      return <Sun className={`${className} text-amber-500 fill-amber-500`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-400 fill-indigo-400`} />;
    case 'Compass':
      return <Compass className={`${className} text-cyan-500`} />;
    case 'Anchor':
      return <Anchor className={`${className} text-blue-500`} />;
    case 'Crown':
      return <Crown className={`${className} text-amber-400 fill-amber-400`} />;
    case 'Shield':
      return <Shield className={`${className} text-emerald-500 fill-emerald-500`} />;
    case 'Key':
      return <Key className={`${className} text-yellow-600`} />;
    case 'Eye':
      return <Eye className={`${className} text-teal-500`} />;
    case 'Bell':
      return <Bell className={`${className} text-purple-500 fill-purple-500`} />;
    case 'Gift':
      return <Gift className={`${className} text-pink-500`} />;
    case 'Music':
      return <Music className={`${className} text-violet-500`} />;
    case 'Rocket':
      return <Rocket className={`${className} text-rose-500`} />;
    case 'Atom':
      return <Atom className={`${className} text-sky-500`} />;
    default:
      return <Star className={`${className} text-indigo-500`} />;
  }
};

export const MemoryChallengesGame: React.FC<MemoryChallengesGameProps> = ({
  onHome,
  onUpdateGlobalStats,
}) => {
  const [mode, setMode] = useState<MemoryMode>('numbers');

  // Shared state
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // --- MODE A: NUMBER MEMORY STATE ---
  const [numLevel, setNumLevel] = useState<number>(1);
  const [numLives, setNumLives] = useState<number>(3);
  const [currentSequence, setCurrentSequence] = useState<string>('');
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(true);
  const [memoryProgress, setMemoryProgress] = useState<number>(100);
  const [userInput, setUserInput] = useState<string>('');
  const [numFeedback, setNumFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [revealedTarget, setRevealedTarget] = useState<string | null>(null);

  // --- MODE B: CARD MATCH STATE ---
  const [cardLevel, setCardLevel] = useState<number>(1);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [gridCols, setGridCols] = useState<number>(3);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(3);
  const [moves, setMoves] = useState<number>(0);
  const [cardTimerSec, setCardTimerSec] = useState<number>(0);
  const [isCardProcessing, setIsCardProcessing] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ----------------------------------------------------
  // INITIALIZE NUMBER MEMORY
  // ----------------------------------------------------
  const startNumberLevel = useCallback((lvl: number) => {
    setUserInput('');
    setNumFeedback(null);
    setRevealedTarget(null);
    setIsShowingSequence(true);
    setMemoryProgress(100);

    const { sequence, displayDurationMs } = generateNumberMemorySequence(lvl);
    setCurrentSequence(sequence);

    // Progress bar animation
    const startTime = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / displayDurationMs) * 100);
      setMemoryProgress(remainingPct);

      if (elapsed >= displayDurationMs) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsShowingSequence(false);
      }
    }, 30);
  }, []);

  // ----------------------------------------------------
  // INITIALIZE CARD MATCH
  // ----------------------------------------------------
  const startCardLevel = useCallback((lvl: number) => {
    const { cards: newCards, cols, totalPairs: pairs } = generateCardMatchDeck(lvl);
    setCards(newCards);
    setGridCols(cols);
    setTotalPairs(pairs);
    setMatchedPairsCount(0);
    setFlippedCards([]);
    setMoves(0);
    setCardTimerSec(0);
    setIsCardProcessing(false);
  }, []);

  // Switch modes or start initial mode
  useEffect(() => {
    if (mode === 'numbers') {
      startNumberLevel(numLevel);
    } else {
      startCardLevel(cardLevel);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, startNumberLevel, numLevel, startCardLevel, cardLevel]);

  // Card match timer
  useEffect(() => {
    if (mode !== 'cards' || isGameOver) return;
    const interval = setInterval(() => {
      setCardTimerSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, isGameOver]);

  // ----------------------------------------------------
  // NUMBER MEMORY ACTIONS
  // ----------------------------------------------------
  const handleNumberInput = (digit: string) => {
    if (isShowingSequence || numFeedback !== null || userInput.length >= 16) return;
    setUserInput((prev) => prev + digit);
  };

  const handleNumberDelete = () => {
    if (isShowingSequence || numFeedback !== null) return;
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleNumberSubmit = () => {
    if (isShowingSequence || numFeedback !== null || !userInput.trim()) return;

    const isMatch = userInput.trim() === currentSequence;
    setRevealedTarget(currentSequence);

    if (isMatch) {
      setNumFeedback('correct');
      const points = currentSequence.length * 50 + streak * 20;
      const newScore = score + points;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      triggerConfetti();

      setTimeout(() => {
        const nextLvl = numLevel + 1;
        setNumLevel(nextLvl);
        startNumberLevel(nextLvl);
      }, 1400);
    } else {
      setNumFeedback('wrong');
      const newLives = numLives - 1;
      setNumLives(newLives);
      setStreak(0);

      if (newLives <= 0) {
        const res = recordGameResult(
          'memory-challenge',
          score,
          Math.max(bestStreak, streak),
          numLevel,
          'memory-challenge-numbers'
        );
        setIsNewHighScore(res.isNewHighScore);
        onUpdateGlobalStats();
        setTimeout(() => {
          setIsGameOver(true);
        }, 1800);
      } else {
        setTimeout(() => {
          startNumberLevel(numLevel);
        }, 2200);
      }
    }
  };

  // Keyboard support for Number Memory
  useEffect(() => {
    if (mode !== 'numbers' || isShowingSequence) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberInput(e.key);
      } else if (e.key === 'Backspace') {
        handleNumberDelete();
      } else if (e.key === 'Enter') {
        handleNumberSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isShowingSequence, userInput, currentSequence, numFeedback]);

  // ----------------------------------------------------
  // CARD MATCH ACTIONS
  // ----------------------------------------------------
  const handleCardClick = (cardIndex: number) => {
    if (isCardProcessing || cards[cardIndex].isFlipped || cards[cardIndex].isMatched) {
      return;
    }

    // Flip this card
    const newCards = [...cards];
    newCards[cardIndex] = { ...newCards[cardIndex], isFlipped: true };
    setCards(newCards);

    const newFlipped = [...flippedCards, cardIndex];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsCardProcessing(true);
      setMoves((prev) => prev + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const isMatch = cards[firstIdx].pairId === cards[secondIdx].pairId;

      if (isMatch) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setIsCardProcessing(false);

          const newMatched = matchedPairsCount + 1;
          setMatchedPairsCount(newMatched);

          // Add points
          const matchPoints = 60 + streak * 10;
          setScore((s) => s + matchPoints);
          setStreak((st) => st + 1);

          // Check level complete
          if (newMatched >= totalPairs) {
            triggerVictoryConfetti();
            const levelBonus = 200 + cardLevel * 100;
            const timeBonus = Math.max(0, 300 - cardTimerSec * 5);
            setScore((s) => s + levelBonus + timeBonus);

            setTimeout(() => {
              const nextLvl = cardLevel + 1;
              setCardLevel(nextLvl);
              startCardLevel(nextLvl);
            }, 1200);
          }
        }, 500);
      } else {
        // Mismatch: flip back after short delay
        setStreak(0);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsCardProcessing(false);
        }, 900);
      }
    }
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setIsNewHighScore(false);
    if (mode === 'numbers') {
      setNumLives(3);
      setNumLevel(1);
      startNumberLevel(1);
    } else {
      setCardLevel(1);
      startCardLevel(1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-6">
      {/* HUD Header */}
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => {
                setMode('numbers');
                setNumLives(3);
                setNumLevel(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                mode === 'numbers'
                  ? 'bg-white text-purple-600 shadow-xs dark:bg-slate-700 dark:text-purple-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Hash className="h-3.5 w-3.5" />
              <span>Number Recall</span>
            </button>
            <button
              onClick={() => {
                setMode('cards');
                setCardLevel(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                mode === 'cards'
                  ? 'bg-white text-purple-600 shadow-xs dark:bg-slate-700 dark:text-purple-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Card Pairs</span>
            </button>
          </div>

          {/* Level / Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Level</span>
              <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                {mode === 'numbers' ? numLevel : cardLevel}
              </span>
            </div>

            {mode === 'numbers' ? (
              <div className="flex items-center gap-1 text-rose-500">
                {[1, 2, 3].map((heartIndex) => (
                  <Heart
                    key={heartIndex}
                    className={`h-4 w-4 transition-transform ${
                      heartIndex <= numLives
                        ? 'fill-rose-500 text-rose-500 scale-100'
                        : 'text-slate-300 dark:text-slate-700 scale-90'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span>Pairs: </span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {matchedPairsCount}/{totalPairs}
                </span>
                <span className="ml-2 font-mono text-[11px]">
                  {Math.floor(cardTimerSec / 60)}:
                  {(cardTimerSec % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
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
              <span className="font-display font-bold tabular-nums text-purple-600 dark:text-purple-400 text-sm">
                {score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODE A: NUMBER MEMORY VIEW */}
      {/* ---------------------------------------------------- */}
      {mode === 'numbers' && (
        <div
          className={`rounded-2xl border bg-white p-6 sm:p-8 shadow-sm transition-all duration-200 dark:bg-slate-900 ${
            numFeedback === 'correct'
              ? 'border-emerald-400 ring-2 ring-emerald-400/20 dark:border-emerald-600'
              : numFeedback === 'wrong'
              ? 'border-rose-400 ring-2 ring-rose-400/20 animate-shake dark:border-rose-600'
              : 'border-slate-200/80 dark:border-slate-800/80'
          }`}
        >
          <div className="mb-4 text-center">
            <span className="text-xs font-semibold tracking-wider uppercase text-purple-600 dark:text-purple-400">
              {isShowingSequence ? 'Memorize the Sequence' : 'Recall & Enter Digits'}
            </span>
            <h2 className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {isShowingSequence
                ? `Remember these ${currentSequence.length} digits before they disappear:`
                : 'Type the exact sequence you just saw and press Enter:'}
            </h2>
          </div>

          {/* Sequence Memory Container */}
          <div className="my-6 flex flex-col items-center justify-center min-h-[140px] rounded-2xl bg-slate-50/70 p-6 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
            {isShowingSequence ? (
              <div className="w-full flex flex-col items-center">
                <div className="font-display text-4xl sm:text-5xl font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 select-none py-2">
                  {currentSequence}
                </div>
                {/* Visual duration progress bar */}
                <div className="mt-5 h-2 w-full max-w-xs rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-75"
                    style={{ width: `${memoryProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {/* Input preview */}
                <div className="flex min-h-[56px] w-full max-w-xs items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-2xl sm:text-3xl font-display font-bold tracking-widest text-slate-900 shadow-inner dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  {userInput ? (
                    userInput
                  ) : (
                    <span className="text-slate-300 dark:text-slate-700 text-lg font-normal tracking-normal">
                      Tap keypad or type...
                    </span>
                  )}
                </div>

                {/* Side-by-side comparison on feedback */}
                {revealedTarget && (
                  <div className="mt-4 flex flex-col items-center text-xs sm:text-sm">
                    <span className="text-slate-500 mb-1">Target Sequence:</span>
                    <span className="font-display font-bold tracking-widest text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl">
                      {revealedTarget}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Keypad controls for touch/mobile */}
          {!isShowingSequence && (
            <div className="mt-4">
              <NumericKeypad
                onDigit={handleNumberInput}
                onDelete={handleNumberDelete}
                onSubmit={handleNumberSubmit}
                disabled={numFeedback !== null}
                submitLabel="Submit"
              />
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODE B: CARD MATCH VIEW */}
      {/* ---------------------------------------------------- */}
      {mode === 'cards' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div>
              Moves: <span className="font-bold text-slate-800 dark:text-slate-200">{moves}</span>
            </div>
            <div className="font-medium">Find all matching symbol pairs</div>
            <button
              onClick={() => startCardLevel(cardLevel)}
              className="flex items-center gap-1 hover:text-purple-600 transition-colors"
              title="Reset current board"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Shuffle</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div
            className="grid gap-2.5 sm:gap-3.5 mx-auto max-w-xl perspective-1000 select-none py-2"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {cards.map((card, idx) => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  disabled={isRevealed || isCardProcessing}
                  className="aspect-square relative rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <div
                    className={`w-full h-full rounded-xl transition-transform duration-300 transform-style-3d ${
                      isRevealed ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Card Front (Unflipped / Hidden) */}
                    <div className="absolute inset-0 backface-hidden flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm border border-indigo-400 hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer">
                      <div className="h-5 w-5 rounded-full border border-white/40 flex items-center justify-center text-[10px] font-bold text-white/80">
                        ?
                      </div>
                    </div>

                    {/* Card Back (Flipped / Symbol visible) */}
                    <div
                      className={`absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center rounded-xl border shadow-xs transition-colors ${
                        card.isMatched
                          ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                          : 'bg-white border-purple-300 dark:bg-slate-800 dark:border-purple-600'
                      }`}
                    >
                      <IconRenderer name={card.iconName} className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        gameTitle="Memory Challenges"
        score={score}
        isNewHighScore={isNewHighScore}
        bestStreak={bestStreak}
        levelReached={mode === 'numbers' ? numLevel : cardLevel}
        onPlayAgain={handleRestart}
        onHome={onHome}
      />
    </div>
  );
};
