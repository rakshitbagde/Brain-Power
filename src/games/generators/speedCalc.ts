import { SpeedCalcQuestion } from '../../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSpeedCalcQuestion(streak = 0): SpeedCalcQuestion {
  const operators: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  // Adapt difficulty slightly based on current streak
  const isHighStreak = streak >= 5;

  switch (operator) {
    case '+': {
      if (isHighStreak) {
        num1 = getRandomInt(12, 85);
        num2 = getRandomInt(11, 85);
      } else {
        num1 = getRandomInt(3, 30);
        num2 = getRandomInt(3, 30);
      }
      answer = num1 + num2;
      break;
    }

    case '-': {
      if (isHighStreak) {
        num1 = getRandomInt(30, 99);
        num2 = getRandomInt(5, num1 - 2);
      } else {
        num1 = getRandomInt(10, 40);
        num2 = getRandomInt(2, num1 - 1);
      }
      answer = num1 - num2;
      break;
    }

    case '×': {
      if (isHighStreak) {
        // Tables up to 12
        num1 = getRandomInt(3, 12);
        num2 = getRandomInt(3, 12);
      } else {
        num1 = getRandomInt(2, 9);
        num2 = getRandomInt(2, 9);
      }
      answer = num1 * num2;
      break;
    }

    case '÷': {
      // Ensure clean integer division: divisor * quotient = dividend
      const quotient = isHighStreak ? getRandomInt(2, 12) : getRandomInt(2, 9);
      const divisor = getRandomInt(2, 9);
      num1 = quotient * divisor;
      num2 = divisor;
      answer = quotient;
      break;
    }
  }

  return {
    id: `calc-${Date.now()}-${Math.random()}`,
    num1,
    operator,
    num2,
    answer,
  };
}

export function getComboMultiplier(streak: number): number {
  if (streak >= 15) return 3.0;
  if (streak >= 10) return 2.5;
  if (streak >= 6) return 2.0;
  if (streak >= 3) return 1.5;
  return 1.0;
}
