import { CardItem } from '../../types';

export const CARD_ICONS = [
  'Star',
  'Heart',
  'Zap',
  'Flame',
  'Sun',
  'Moon',
  'Compass',
  'Anchor',
  'Crown',
  'Shield',
  'Key',
  'Eye',
  'Bell',
  'Gift',
  'Music',
  'Rocket',
  'Atom',
  'Trophy',
];

export function generateNumberMemorySequence(level: number): { sequence: string; displayDurationMs: number } {
  // Level 1 starts with 3 digits, Level 2 has 4, etc.
  const numDigits = Math.min(15, 2 + level);
  let sequence = '';
  // Generate random digits (ensure first digit is not 0 for clearer visual recall)
  sequence += Math.floor(Math.random() * 9) + 1;
  for (let i = 1; i < numDigits; i++) {
    sequence += Math.floor(Math.random() * 10);
  }

  // Duration scales gently: base 1000ms + 400ms per digit
  const displayDurationMs = 1000 + numDigits * 450;
  return { sequence, displayDurationMs };
}

export function generateCardMatchDeck(level: number): {
  cards: CardItem[];
  cols: number;
  totalPairs: number;
} {
  // Level 1: 3 pairs (6 cards, 3 cols x 2 rows)
  // Level 2: 4 pairs (8 cards, 4 cols x 2 rows)
  // Level 3: 6 pairs (12 cards, 4 cols x 3 rows)
  // Level 4: 8 pairs (16 cards, 4 cols x 4 rows)
  // Level 5+: 10 pairs (20 cards, 5 cols x 4 rows)
  let totalPairs = 3;
  let cols = 3;

  if (level === 2) {
    totalPairs = 4;
    cols = 4;
  } else if (level === 3) {
    totalPairs = 6;
    cols = 4;
  } else if (level === 4) {
    totalPairs = 8;
    cols = 4;
  } else if (level >= 5) {
    totalPairs = 10;
    cols = 5;
  }

  const selectedIcons = [...CARD_ICONS].sort(() => Math.random() - 0.5).slice(0, totalPairs);

  const rawDeck: { pairId: number; iconName: string }[] = [];
  selectedIcons.forEach((iconName, index) => {
    rawDeck.push({ pairId: index, iconName });
    rawDeck.push({ pairId: index, iconName });
  });

  // Shuffle deck
  const shuffled = rawDeck.sort(() => Math.random() - 0.5);

  const cards: CardItem[] = shuffled.map((item, index) => ({
    id: `card-${item.pairId}-${index}-${Math.random()}`,
    pairId: item.pairId,
    iconName: item.iconName,
    isFlipped: false,
    isMatched: false,
  }));

  return { cards, cols, totalPairs };
}
