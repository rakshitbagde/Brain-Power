import { Difficulty, NumberSeriesQuestion } from '../../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOptions(correctAnswer: number, stepDiff = 1): number[] {
  const options = new Set<number>([correctAnswer]);
  const offsets = [
    stepDiff,
    -stepDiff,
    stepDiff * 2,
    -stepDiff * 2,
    1,
    -1,
    2,
    -2,
    3,
    -3,
  ];

  // Shuffle offsets
  const shuffled = offsets.sort(() => Math.random() - 0.5);
  for (const off of shuffled) {
    const val = correctAnswer + off;
    if (val !== correctAnswer) {
      options.add(val);
      if (options.size === 4) break;
    }
  }

  let counter = 5;
  while (options.size < 4) {
    options.add(correctAnswer + counter);
    counter++;
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

export function generateNumberSeriesQuestion(difficulty: Difficulty): NumberSeriesQuestion {
  const patternTypes = [
    'arithmetic',
    'geometric',
    'squares',
    'fibonacci',
    'alternating',
    'triangular',
    'mult_add',
  ];

  // Pick a pattern type weighted slightly by difficulty
  let patternType: string;
  if (difficulty === 'easy') {
    patternType = ['arithmetic', 'alternating', 'squares', 'triangular'][getRandomInt(0, 3)];
  } else if (difficulty === 'medium') {
    patternType = ['geometric', 'fibonacci', 'squares', 'alternating', 'mult_add'][getRandomInt(0, 4)];
  } else {
    patternType = ['fibonacci', 'alternating', 'mult_add', 'squares', 'geometric'][getRandomInt(0, 4)];
  }

  let fullSeries: number[] = [];
  let ruleName = '';
  let explanation = '';
  let stepDiff = 2;

  switch (patternType) {
    case 'arithmetic': {
      const step = getRandomInt(2, difficulty === 'easy' ? 6 : 14);
      const isPositive = Math.random() > 0.3;
      const effectiveStep = isPositive ? step : -step;
      const start = isPositive ? getRandomInt(1, 20) : getRandomInt(60, 100);
      const len = 6;
      for (let i = 0; i < len; i++) {
        fullSeries.push(start + i * effectiveStep);
      }
      ruleName = isPositive ? `Add ${step} each step` : `Subtract ${step} each step`;
      explanation = `Rule: Each successive number changes by ${isPositive ? '+' : ''}${effectiveStep} (${fullSeries[0]} ${isPositive ? '+' : '-'} ${step} = ${fullSeries[1]}, etc.).`;
      stepDiff = step;
      break;
    }

    case 'geometric': {
      const ratio = difficulty === 'hard' ? 3 : 2;
      const start = getRandomInt(2, 6);
      const len = 5;
      for (let i = 0; i < len; i++) {
        fullSeries.push(start * Math.pow(ratio, i));
      }
      ruleName = `Multiply by ${ratio}`;
      explanation = `Rule: Geometric progression where each term is multiplied by ${ratio} (${fullSeries[0]} × ${ratio} = ${fullSeries[1]}, ${fullSeries[1]} × ${ratio} = ${fullSeries[2]}, etc.).`;
      stepDiff = fullSeries[1] - fullSeries[0];
      break;
    }

    case 'squares': {
      const offset = getRandomInt(1, 4);
      const addConstant = difficulty === 'hard' ? getRandomInt(1, 3) : 0;
      const len = 5;
      for (let i = 0; i < len; i++) {
        const n = offset + i;
        fullSeries.push(n * n + addConstant);
      }
      if (addConstant === 0) {
        ruleName = 'Consecutive Squares';
        explanation = `Rule: Consecutive squares (n²). Terms are ${offset}² = ${fullSeries[0]}, ${offset + 1}² = ${fullSeries[1]}, ${offset + 2}² = ${fullSeries[2]}...`;
      } else {
        ruleName = `Square plus ${addConstant}`;
        explanation = `Rule: Each term is n² + ${addConstant} for n starting from ${offset}. For example: ${offset}² + ${addConstant} = ${fullSeries[0]}, ${offset + 1}² + ${addConstant} = ${fullSeries[1]}.`;
      }
      stepDiff = 4;
      break;
    }

    case 'fibonacci': {
      const a = getRandomInt(1, 5);
      const b = getRandomInt(2, 6);
      fullSeries = [a, b];
      for (let i = 2; i < 6; i++) {
        fullSeries.push(fullSeries[i - 1] + fullSeries[i - 2]);
      }
      ruleName = 'Fibonacci Sum of Prior Two';
      explanation = `Rule: Each number is the sum of the preceding two numbers (${fullSeries[0]} + ${fullSeries[1]} = ${fullSeries[2]}, ${fullSeries[1]} + ${fullSeries[2]} = ${fullSeries[3]}, etc.).`;
      stepDiff = fullSeries[1];
      break;
    }

    case 'alternating': {
      const addStep = getRandomInt(3, 7);
      const subStep = getRandomInt(1, 4);
      let curr = getRandomInt(10, 30);
      fullSeries = [curr];
      for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) {
          curr += addStep;
        } else {
          curr -= subStep;
        }
        fullSeries.push(curr);
      }
      ruleName = `Alternating (+${addStep}, -${subStep})`;
      explanation = `Rule: Alternating sequence adding ${addStep} then subtracting ${subStep} continuously.`;
      stepDiff = addStep;
      break;
    }

    case 'triangular': {
      let curr = getRandomInt(1, 10);
      fullSeries = [curr];
      const stepInc = getRandomInt(1, 2);
      let stepVal = getRandomInt(2, 4);
      for (let i = 0; i < 5; i++) {
        curr += stepVal;
        fullSeries.push(curr);
        stepVal += stepInc;
      }
      ruleName = 'Increasing Difference';
      explanation = `Rule: The difference between consecutive terms increases by +${stepInc} each step.`;
      stepDiff = 3;
      break;
    }

    case 'mult_add':
    default: {
      const multiplier = 2;
      const addVal = getRandomInt(1, 3);
      let curr = getRandomInt(2, 5);
      fullSeries = [curr];
      for (let i = 0; i < 4; i++) {
        curr = curr * multiplier + addVal;
        fullSeries.push(curr);
      }
      ruleName = `Multiply by ${multiplier} and add ${addVal}`;
      explanation = `Rule: Each term is obtained by multiplying the previous term by ${multiplier} and adding ${addVal} (e.g. ${fullSeries[0]} × ${multiplier} + ${addVal} = ${fullSeries[1]}).`;
      stepDiff = fullSeries[1] - fullSeries[0];
      break;
    }
  }

  // Choose which position to blank out: usually index 3, 4, or last
  const candidates = [fullSeries.length - 1, fullSeries.length - 2, 3].filter(
    (idx) => idx >= 2 && idx < fullSeries.length
  );
  const missingIndex = candidates[Math.floor(Math.random() * candidates.length)];
  const answer = fullSeries[missingIndex];

  const seriesDisplay: (number | string)[] = fullSeries.map((val, idx) =>
    idx === missingIndex ? '?' : val
  );

  return {
    id: `series-${Date.now()}-${Math.random()}`,
    series: seriesDisplay,
    missingIndex,
    answer,
    options: generateOptions(answer, stepDiff),
    ruleName,
    explanation,
    difficulty,
  };
}
