import confetti from 'canvas-confetti';

export function triggerConfetti(originY = 0.6) {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: originY },
      colors: ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
    });
    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: originY },
      colors: ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
    });
  } catch {
    // Fallback if canvas-confetti has issues
  }
}

export function triggerVictoryConfetti() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#6366f1', '#ec4899', '#10b981', '#eab308'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Ignore error
  }
}
