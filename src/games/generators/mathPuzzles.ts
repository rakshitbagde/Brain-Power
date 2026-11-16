import { Difficulty, MathPuzzleQuestion, MathPuzzleType } from '../../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOptions(correctAnswer: number): number[] {
  const options = new Set<number>([correctAnswer]);
  const deltas = [-3, -2, -1, 1, 2, 3, 5, -5, 10, -10];
  
  // Shuffle deltas
  const shuffledDeltas = [...deltas].sort(() => Math.random() - 0.5);
  
  for (const delta of shuffledDeltas) {
    const candidate = correctAnswer + delta;
    if (candidate > 0 || (candidate === 0 && correctAnswer === 0)) {
      options.add(candidate);
      if (options.size === 4) break;
    }
  }

  // If still not 4 options
  let fallbackDelta = 4;
  while (options.size < 4) {
    const candidate = correctAnswer + fallbackDelta;
    if (candidate >= 0 && !options.has(candidate)) {
      options.add(candidate);
    }
    fallbackDelta = fallbackDelta > 0 ? -fallbackDelta : -fallbackDelta + 1;
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

// 1. Missing number in a grid
function generateGridPuzzle(difficulty: Difficulty): MathPuzzleQuestion {
  if (difficulty === 'easy') {
    // 2x2 grid or simple 3x3 row sum
    const targetSum = getRandomInt(12, 30);
    const a = getRandomInt(1, Math.floor(targetSum / 2));
    const b = targetSum - a;
    const c = getRandomInt(1, Math.floor(targetSum / 2));
    const d = targetSum - c; // Answer

    const cells = [a, b, c, '?'];
    const explanation = `In this 2x2 grid, each row sums to ${targetSum}: Row 1 is ${a} + ${b} = ${targetSum}, Row 2 is ${c} + ? = ${targetSum}. Therefore, ? = ${targetSum} - ${c} = ${d}.`;

    return {
      id: `grid-${Date.now()}-${Math.random()}`,
      type: 'grid',
      difficulty,
      title: 'Grid Logic',
      instruction: 'Find the missing number in the grid so that each row satisfies the pattern.',
      gridData: {
        size: 2,
        cells,
        missingIndex: 3,
      },
      answer: d,
      options: generateOptions(d),
      explanation,
    };
  }

  if (difficulty === 'medium') {
    // 3x3 grid with row pattern: C = A + B or column sum
    const isSumPattern = Math.random() > 0.4;
    if (isSumPattern) {
      // Row sum pattern: 3rd column = 1st + 2nd
      const r1_1 = getRandomInt(2, 9);
      const r1_2 = getRandomInt(2, 9);
      const r1_3 = r1_1 + r1_2;

      const r2_1 = getRandomInt(2, 9);
      const r2_2 = getRandomInt(2, 9);
      const r2_3 = r2_1 + r2_2;

      const r3_1 = getRandomInt(2, 9);
      const r3_2 = getRandomInt(2, 9);
      const r3_3 = r3_1 + r3_2;

      const cells = [r1_1, r1_2, r1_3, r2_1, r2_2, r2_3, r3_1, r3_2, '?'];
      const explanation = `Row Rule: The 3rd column equals Column 1 + Column 2. (${r1_1} + ${r1_2} = ${r1_3}, ${r2_1} + ${r2_2} = ${r2_3}). For row 3: ${r3_1} + ${r3_2} = ${r3_3}.`;

      return {
        id: `grid-${Date.now()}-${Math.random()}`,
        type: 'grid',
        difficulty,
        title: '3x3 Grid Pattern',
        instruction: 'Identify the pattern across rows or columns and find the missing value.',
        gridData: {
          size: 3,
          cells,
          missingIndex: 8,
        },
        answer: r3_3,
        options: generateOptions(r3_3),
        explanation,
      };
    } else {
      // Multiplication pattern: C = A * B
      const r1_1 = getRandomInt(2, 6);
      const r1_2 = getRandomInt(2, 6);
      const r1_3 = r1_1 * r1_2;

      const r2_1 = getRandomInt(2, 6);
      const r2_2 = getRandomInt(2, 6);
      const r2_3 = r2_1 * r2_2;

      const r3_1 = getRandomInt(2, 6);
      const r3_2 = getRandomInt(2, 6);
      const r3_3 = r3_1 * r3_2;

      const cells = [r1_1, r1_2, r1_3, r2_1, r2_2, r2_3, r3_1, r3_2, '?'];
      const explanation = `Row Rule: The 3rd column is the product of Column 1 and Column 2 (${r1_1} × ${r1_2} = ${r1_3}, ${r2_1} × ${r2_2} = ${r2_3}). For row 3: ${r3_1} × ${r3_2} = ${r3_3}.`;

      return {
        id: `grid-${Date.now()}-${Math.random()}`,
        type: 'grid',
        difficulty,
        title: '3x3 Product Grid',
        instruction: 'Spot the mathematical operation linking the cells in each row.',
        gridData: {
          size: 3,
          cells,
          missingIndex: 8,
        },
        answer: r3_3,
        options: generateOptions(r3_3),
        explanation,
      };
    }
  }

  // Hard: 3x3 grid with formula C = (A + B) * K or center cell is average/sum of cross
  const k = getRandomInt(2, 3);
  const r1_1 = getRandomInt(2, 7);
  const r1_2 = getRandomInt(2, 7);
  const r1_3 = (r1_1 + r1_2) * k;

  const r2_1 = getRandomInt(2, 7);
  const r2_2 = getRandomInt(2, 7);
  const r2_3 = (r2_1 + r2_2) * k;

  const r3_1 = getRandomInt(2, 7);
  const r3_2 = getRandomInt(2, 7);
  const r3_3 = (r3_1 + r3_2) * k;

  const cells = [r1_1, r1_2, r1_3, r2_1, r2_2, r2_3, r3_1, r3_2, '?'];
  const explanation = `Compound Row Rule: Column 3 = (Column 1 + Column 2) × ${k}. Row 1: (${r1_1} + ${r1_2}) × ${k} = ${r1_3}. Row 3: (${r3_1} + ${r3_2}) × ${k} = ${r3_3}.`;

  return {
    id: `grid-${Date.now()}-${Math.random()}`,
    type: 'grid',
    difficulty,
    title: 'Advanced Matrix Puzzle',
    instruction: 'Determine the multi-step formula governing each row.',
    gridData: {
      size: 3,
      cells,
      missingIndex: 8,
    },
    answer: r3_3,
    options: generateOptions(r3_3),
    explanation,
  };
}

// 2. "Find X" Puzzle
function generateFindXPuzzle(difficulty: Difficulty): MathPuzzleQuestion {
  if (difficulty === 'easy') {
    const a = getRandomInt(2, 6);
    const x = getRandomInt(3, 15);
    const b = getRandomInt(2, 20);
    const c = a * x + b;
    const equation = `${a}x + ${b} = ${c}`;
    const explanation = `Subtract ${b} from both sides: ${a}x = ${c - b}. Then divide by ${a}: x = ${c - b} ÷ ${a} = ${x}.`;

    return {
      id: `findx-${Date.now()}-${Math.random()}`,
      type: 'find_x',
      difficulty,
      title: 'Solve for x',
      instruction: 'Find the integer value of x that balances the equation.',
      equationDisplay: equation,
      answer: x,
      options: generateOptions(x),
      explanation,
    };
  }

  if (difficulty === 'medium') {
    const a = getRandomInt(2, 5);
    const x = getRandomInt(4, 18);
    const b = getRandomInt(3, 15);
    const c = getRandomInt(1, a - 1);
    // (a * x) - b = c * x + d
    const diffCoeff = a - c;
    const d = diffCoeff * x - b;
    const equation = `${a}x - ${b} = ${c}x + ${d}`;
    const explanation = `Group x terms: (${a}x - ${c}x) = ${d} + ${b} ➔ ${diffCoeff}x = ${d + b} ➔ x = ${x}.`;

    return {
      id: `findx-${Date.now()}-${Math.random()}`,
      type: 'find_x',
      difficulty,
      title: 'Algebraic Balance',
      instruction: 'Combine terms to solve for the unknown variable x.',
      equationDisplay: equation,
      answer: x,
      options: generateOptions(x),
      explanation,
    };
  }

  // Hard: System of Visual Symbols (Apples, Bananas, Cherries)
  const sym1Val = getRandomInt(5, 12);
  const sym2Val = getRandomInt(3, 9);
  const sym3Val = getRandomInt(2, 6);

  const eq1 = `🍎 + 🍎 + 🍎 = ${sym1Val * 3}`;
  const eq2 = `🍎 + 🍌 + 🍌 = ${sym1Val + sym2Val * 2}`;
  const eq3 = `🍌 + 🍒 = ${sym2Val + sym3Val}`;
  const finalEq = `🍎 + 🍌 × 🍒 = ?`;

  const finalAnswer = sym1Val + sym2Val * sym3Val;
  const fullDisplay = `${eq1}\n${eq2}\n${eq3}\n${finalEq}`;
  const explanation = `Step 1: 3 🍎 = ${sym1Val * 3} ➔ 🍎 = ${sym1Val}.\nStep 2: ${sym1Val} + 2 🍌 = ${sym1Val + sym2Val * 2} ➔ 🍌 = ${sym2Val}.\nStep 3: ${sym2Val} + 🍒 = ${sym2Val + sym3Val} ➔ 🍒 = ${sym3Val}.\nStep 4 (Order of Ops): 🍎 + (🍌 × 🍒) = ${sym1Val} + (${sym2Val} × ${sym3Val}) = ${sym1Val} + ${sym2Val * sym3Val} = ${finalAnswer}.`;

  return {
    id: `findx-${Date.now()}-${Math.random()}`,
    type: 'find_x',
    difficulty,
    title: 'Symbolic Logic System',
    instruction: 'Deduce the value of each symbol, then calculate the final expression (remember order of operations!).',
    equationDisplay: fullDisplay,
    answer: finalAnswer,
    options: generateOptions(finalAnswer),
    explanation,
  };
}

// 3. Balance Equations Puzzle
function generateBalancePuzzle(difficulty: Difficulty): MathPuzzleQuestion {
  if (difficulty === 'easy') {
    const a = getRandomInt(10, 30);
    const b = getRandomInt(5, 20);
    const c = getRandomInt(3, 9);
    const d = getRandomInt(2, 6);
    const rightSide = c * d;
    // a - ? = rightSide or ? + b = rightSide
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const answer = rightSide - b;
      const equation = `? + ${b} = ${c} × ${d}`;
      const explanation = `Right side evaluates to ${c} × ${d} = ${rightSide}. Left side is ? + ${b} = ${rightSide}. So ? = ${rightSide} - ${b} = ${answer}.`;
      return {
        id: `bal-${Date.now()}-${Math.random()}`,
        type: 'balance',
        difficulty,
        title: 'Balance the Equation',
        instruction: 'Find the number that makes both sides of the equal sign equal.',
        equationDisplay: equation,
        answer,
        options: generateOptions(answer),
        explanation,
      };
    } else {
      const answer = a;
      const equation = `${a + rightSide} - ? = ${c} × ${d}`;
      const explanation = `Right side is ${c} × ${d} = ${rightSide}. ${a + rightSide} - ? = ${rightSide} ➔ ? = ${answer}.`;
      return {
        id: `bal-${Date.now()}-${Math.random()}`,
        type: 'balance',
        difficulty,
        title: 'Balance the Equation',
        instruction: 'Find the number that makes both sides of the equal sign equal.',
        equationDisplay: equation,
        answer,
        options: generateOptions(answer),
        explanation,
      };
    }
  }

  if (difficulty === 'medium') {
    // Left: a * b - c, Right: ? * d
    const d = getRandomInt(3, 7);
    const answer = getRandomInt(4, 15);
    const total = answer * d;
    const b = getRandomInt(4, 8);
    const a = Math.floor(total / b) + 2;
    const c = a * b - total;

    const equation = `${a} × ${b} - ${c} = ? × ${d}`;
    const explanation = `Left side calculation: (${a} × ${b}) - ${c} = ${a * b} - ${c} = ${total}. Right side: ? × ${d} = ${total} ➔ ? = ${total} ÷ ${d} = ${answer}.`;

    return {
      id: `bal-${Date.now()}-${Math.random()}`,
      type: 'balance',
      difficulty,
      title: 'Equate Both Sides',
      instruction: 'Evaluate the expressions on both sides to find the missing factor.',
      equationDisplay: equation,
      answer,
      options: generateOptions(answer),
      explanation,
    };
  }

  // Hard: Powers / Two-sided composite balance
  const answer = getRandomInt(5, 14);
  const sq = answer * answer;
  const p = getRandomInt(2, 5);
  const q = getRandomInt(10, 30);
  const rightSide = sq - p * q;

  const equation = `?² - (${p} × ${q}) = ${rightSide}`;
  const explanation = `First simplify (${p} × ${q}) = ${p * q}. Then ?² - ${p * q} = ${rightSide} ➔ ?² = ${rightSide} + ${p * q} = ${sq} ➔ ? = √${sq} = ${answer}.`;

  return {
    id: `bal-${Date.now()}-${Math.random()}`,
    type: 'balance',
    difficulty,
    title: 'Exponential Balance',
    instruction: 'Solve for the missing squared term that satisfies the balance.',
    equationDisplay: equation,
    answer,
    options: generateOptions(answer),
    explanation,
  };
}

// 4. Numeric Riddles
function generateRiddlePuzzle(difficulty: Difficulty): MathPuzzleQuestion {
  const riddleKind = getRandomInt(1, 4);

  if (riddleKind === 1) {
    // "A bat and ball" style riddle
    const diff = getRandomInt(6, 18) * 2; // ensure even
    const bookmarkCost = getRandomInt(2, 10);
    const bookCost = bookmarkCost + diff;
    const total = bookCost + bookmarkCost;

    const riddleText = `A premium hardbound book and a silk bookmark cost $${total} in total. The book costs $${diff} more than the bookmark. How many dollars does the bookmark cost?`;
    const explanation = `Let bookmark = B. Book = B + ${diff}. Together: B + (B + ${diff}) = ${total} ➔ 2B + ${diff} = ${total} ➔ 2B = ${total - diff} ➔ B = ${bookmarkCost}.`;

    return {
      id: `rid-${Date.now()}-${Math.random()}`,
      type: 'riddle',
      difficulty,
      title: 'Classic Cost Riddle',
      instruction: 'Carefully deduce the answer without falling into the intuitive trap!',
      riddleText,
      answer: bookmarkCost,
      options: generateOptions(bookmarkCost),
      explanation,
    };
  }

  if (riddleKind === 2) {
    // "Double me and add X"
    const ans = getRandomInt(12, 35);
    const addVal = getRandomInt(8, 25);
    const target = ans * 2 + addVal;

    const riddleText = `When you double me and then add ${addVal}, the resulting total is ${target}. What number am I?`;
    const explanation = `Working backwards: Subtract ${addVal} from ${target} to get ${target - addVal}. Then divide by 2: ${target - addVal} ÷ 2 = ${ans}.`;

    return {
      id: `rid-${Date.now()}-${Math.random()}`,
      type: 'riddle',
      difficulty,
      title: 'Number Reversal Riddle',
      instruction: 'Work the arithmetic backwards to uncover the original number.',
      riddleText,
      answer: ans,
      options: generateOptions(ans),
      explanation,
    };
  }

  if (riddleKind === 3) {
    // Digit sum riddle
    const tens = getRandomInt(4, 9);
    const units = getRandomInt(1, 4);
    const sum = tens + units;
    const diff = tens - units;
    const number = tens * 10 + units;

    const riddleText = `I am a two-digit number. The sum of my two digits is ${sum}, and my tens digit is ${diff} greater than my units digit. What number am I?`;
    const explanation = `Let tens = T, units = U. We know T + U = ${sum} and T - U = ${diff}. Adding both equations gives 2T = ${sum + diff} ➔ T = ${tens}, which means U = ${units}. The number is ${number}.`;

    return {
      id: `rid-${Date.now()}-${Math.random()}`,
      type: 'riddle',
      difficulty,
      title: 'Two-Digit Mystery',
      instruction: 'Use the system of digit constraints to discover the number.',
      riddleText,
      answer: number,
      options: generateOptions(number),
      explanation,
    };
  }

  // RiddleKind 4: Age puzzle
  const currentYearsAgo = getRandomInt(3, 6);
  const childAgeNow = getRandomInt(8, 16);
  const parentAgeNow = childAgeNow * 3;
  const combinedNow = parentAgeNow + childAgeNow;

  const riddleText = `A father is currently three times as old as his daughter. Together, the sum of their current ages is ${combinedNow} years. How old is the daughter?`;
  const explanation = `Let daughter's age = D. Father's age = 3D. Total = D + 3D = 4D = ${combinedNow}. Therefore, D = ${combinedNow} ÷ 4 = ${childAgeNow} years.`;

  return {
    id: `rid-${Date.now()}-${Math.random()}`,
    type: 'riddle',
    difficulty,
    title: 'Age Riddle',
    instruction: 'Set up the age ratio to find the daughter’s age.',
    riddleText,
    answer: childAgeNow,
    options: generateOptions(childAgeNow),
    explanation,
  };
}

export function generateMathPuzzleQuestion(difficulty: Difficulty): MathPuzzleQuestion {
  const types: MathPuzzleType[] = ['grid', 'find_x', 'balance', 'riddle'];
  const chosenType = types[Math.floor(Math.random() * types.length)];

  switch (chosenType) {
    case 'grid':
      return generateGridPuzzle(difficulty);
    case 'find_x':
      return generateFindXPuzzle(difficulty);
    case 'balance':
      return generateBalancePuzzle(difficulty);
    case 'riddle':
      return generateRiddlePuzzle(difficulty);
  }
}
