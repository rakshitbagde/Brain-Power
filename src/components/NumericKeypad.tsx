import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onClear?: () => void;
  disabled?: boolean;
  submitLabel?: string;
  hasNegative?: boolean;
  onToggleNegative?: () => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onDigit,
  onDelete,
  onSubmit,
  disabled = false,
  submitLabel = 'Enter',
}) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="mx-auto w-full max-w-xs select-none">
      <div className="grid grid-cols-3 gap-2">
        {digits.map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => onDigit(digit)}
            className="flex h-12 sm:h-14 items-center justify-center rounded-xl bg-white text-lg font-semibold text-slate-800 shadow-xs border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100 dark:bg-slate-800/90 dark:text-slate-100 dark:border-slate-700/80 dark:hover:bg-slate-700/80 dark:active:bg-slate-600 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {digit}
          </button>
        ))}

        {/* Bottom row: Delete, 0, Submit */}
        <button
          type="button"
          disabled={disabled}
          onClick={onDelete}
          className="flex h-12 sm:h-14 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 active:bg-slate-300 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500"
          title="Delete"
          aria-label="Delete last digit"
        >
          <Delete className="h-5 w-5" />
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onDigit('0')}
          className="flex h-12 sm:h-14 items-center justify-center rounded-xl bg-white text-lg font-semibold text-slate-800 shadow-xs border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100 dark:bg-slate-800/90 dark:text-slate-100 dark:border-slate-700/80 dark:hover:bg-slate-700/80 dark:active:bg-slate-600 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className="flex h-12 sm:h-14 items-center justify-center rounded-xl bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20 hover:bg-indigo-500 active:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 gap-1 text-sm sm:text-base"
          title="Submit answer"
        >
          <span>{submitLabel}</span>
          <CornerDownLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
