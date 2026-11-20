import { useState, useEffect } from 'react'

// Sticks to the bottom of the screen after you complete a set.
export default function RestTimer({ end, onAdjust, onClose }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t) }, [])
  const left = Math.max(0, Math.ceil((end - now) / 1000))
  const go = left === 0
  return (
    <div role="timer" className="fixed bottom-0 inset-x-0 z-20 border-t-[3px] border-[var(--ink)]" style={{ background: go ? 'var(--o)' : 'var(--b)', color: go ? '#0d0d0d' : '#fff' }}>
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        <span className="display text-5xl tabular-nums">{go ? 'Go' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}</span>
        <span className="flex gap-2 font-bold">
          <button onClick={() => onAdjust(-15)} className="border-[3px] border-current px-3 py-1.5">-15s</button>
          <button onClick={() => onAdjust(15)} className="border-[3px] border-current px-3 py-1.5">+15s</button>
          <button onClick={onClose} className="border-[3px] border-current px-3 py-1.5 bg-[#0d0d0d] text-white">Skip</button>
        </span>
      </div>
    </div>
  )
}
