import { useState } from 'react';
import type { CardGrid } from '../../types/editor';
import { RESULT_OPTIONS, RESULT_LABELS, getCell, setCell } from '../../types/editor';

interface CardEditorProps {
  value: CardGrid;
  onChange: (grid: CardGrid) => void;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function cellLabel(result: string): string {
  return RESULT_LABELS[result] ?? result;
}

function resultColorClass(result: string): string {
  if (['SINGLE','DOUBLE','TRIPLE','HOME_RUN'].includes(result)) return 'text-green-400';
  if (result === 'WALK') return 'text-sky-400';
  if (result === 'STRIKEOUT') return 'text-red-400';
  return 'text-zinc-400';
}

// ── Desktop: full 6×6 dropdown grid ──────────────────────────────────────────

interface DesktopGridProps {
  value: CardGrid;
  onChange: (grid: CardGrid) => void;
}

function DesktopGrid({ value, onChange }: DesktopGridProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="w-8 h-8" />
            {[1,2,3,4,5,6].map(c => (
              <th key={c} className="w-24 h-8 text-xs font-mono text-zinc-500 text-center px-1">
                Col {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1,2,3,4,5,6].map(row => (
            <tr key={row}>
              <td className="text-xs font-mono text-zinc-500 text-center pr-2 w-8">
                {row}
              </td>
              {[1,2,3,4,5,6].map(col => {
                const cell = getCell(value, col, row);
                const result = cell?.result ?? 'GROUND_OUT';
                return (
                  <td key={col} className="p-1">
                    <select
                      value={result}
                      onChange={e => onChange(setCell(value, col, row, e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-xs font-mono text-zinc-200 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                    >
                      {RESULT_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{cellLabel(opt)}</option>
                      ))}
                    </select>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Mobile: chip overview + bottom sheet ─────────────────────────────────────

interface MobileGridProps {
  value: CardGrid;
  onChange: (grid: CardGrid) => void;
}

interface ActiveCell { col: number; row: number }

function MobileGrid({ value, onChange }: MobileGridProps) {
  const [active, setActive] = useState<ActiveCell | null>(null);

  const activeCell = active ? getCell(value, active.col, active.row) : undefined;
  const activeResult = activeCell?.result ?? 'GROUND_OUT';

  function handleSelect(result: string) {
    if (!active) return;
    onChange(setCell(value, active.col, active.row, result));
    setActive(null);
  }

  return (
    <>
      {/* Chip overview grid */}
      <div className="overflow-x-auto">
        <div className="inline-grid" style={{ display: 'grid', gridTemplateColumns: 'auto repeat(6, minmax(2.5rem, 1fr))', gap: '2px' }}>
          {/* Header row */}
          <div className="w-6 h-7" />
          {[1,2,3,4,5,6].map(c => (
            <div key={c} className="h-7 flex items-center justify-center text-[10px] font-mono text-zinc-500">
              {c}
            </div>
          ))}

          {/* Data rows */}
          {[1,2,3,4,5,6].map(row => (
            <>
              <div key={`lbl-${row}`} className="flex items-center justify-center text-[10px] font-mono text-zinc-500 w-6">
                {row}
              </div>
              {[1,2,3,4,5,6].map(col => {
                const cell = getCell(value, col, row);
                const result = cell?.result ?? 'GROUND_OUT';
                return (
                  <button
                    key={`${col}-${row}`}
                    onClick={() => setActive({ col, row })}
                    className={`h-9 min-w-[2.5rem] rounded text-[10px] font-mono font-semibold border transition-colors cursor-pointer ${
                      active?.col === col && active?.row === row
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : `border-zinc-700 bg-zinc-800 hover:border-zinc-500 ${resultColorClass(result)}`
                    }`}
                  >
                    {cellLabel(result)}
                  </button>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {active && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setActive(null)}
        />
      )}

      {/* Bottom sheet */}
      {active && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 rounded-t-2xl p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-zinc-100 font-bold">
                Col {active.col} · Row {active.row}
              </div>
              <div className={`text-sm font-mono mt-0.5 ${resultColorClass(activeResult)}`}>
                {activeResult}
              </div>
            </div>
            <button
              onClick={() => setActive(null)}
              className="text-zinc-500 hover:text-zinc-200 text-sm min-h-[44px] px-3"
            >
              ✕
            </button>
          </div>
          <select
            value={activeResult}
            onChange={e => handleSelect(e.target.value)}
            size={RESULT_OPTIONS.length}
            className="w-full bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-100 outline-none"
          >
            {RESULT_OPTIONS.map(opt => (
              <option key={opt} value={opt} className="py-2 px-3">
                {cellLabel(opt)} — {opt}
              </option>
            ))}
          </select>
          <button
            onClick={() => setActive(null)}
            className="mt-4 w-full min-h-[44px] py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold rounded transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </>
  );
}

// ── Exported CardEditor ───────────────────────────────────────────────────────

export function CardEditor({ value, onChange }: CardEditorProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <DesktopGrid value={value} onChange={onChange} />
      </div>
      {/* Mobile */}
      <div className="lg:hidden">
        <MobileGrid value={value} onChange={onChange} />
      </div>
    </>
  );
}
