import { useId, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// Hand-drawn stick figures that loop through two poses of a movement. Side view, facing right.
// Joints: h head, s shoulder, p hip, k knee, a ankle, e elbow, w wrist.
const P = (h, s, p, k, a, e, w) => ({ h, s, p, k, a, e, w })
const STAND = [[60, 16], [60, 32], [60, 62], [60, 86], [60, 108]]
const POSES = {
  squat: [P(STAND[0], STAND[1], STAND[2], STAND[3], STAND[4], [68, 40], [66, 30]), P([78, 34], [72, 48], [46, 78], [78, 82], [58, 108], [82, 54], [76, 42])],
  hinge: [P(STAND[0], STAND[1], STAND[2], STAND[3], STAND[4], [62, 52], [62, 72]), P([88, 46], [78, 56], [44, 66], [56, 88], [58, 108], [80, 76], [70, 92])],
  pushup: [P([100, 40], [88, 50], [51, 74], [32, 87], [14, 98], [88, 76], [88, 100]), P([98, 76], [88, 82], [51, 88], [32, 94], [14, 100], [72, 92], [88, 100])],
  press: [P(STAND[0], STAND[1], STAND[2], STAND[3], STAND[4], [66, 46], [64, 32]), P(STAND[0], STAND[1], STAND[2], STAND[3], STAND[4], [62, 22], [62, 8])],
  row: [P([84, 46], [74, 56], [44, 66], [50, 88], [56, 108], [74, 76], [74, 94]), P([84, 46], [74, 56], [44, 66], [50, 88], [56, 108], [58, 64], [72, 74])],
  curl: [P(STAND[0], STAND[1], STAND[2], STAND[3], STAND[4], [62, 50], [62, 70]), P(STAND[0], STAND[1], STAND[2], STAND[3], STAND[4], [62, 50], [76, 36])],
  plank: [P([100, 62], [88, 68], [50, 76], [32, 82], [14, 88], [88, 92], [100, 92]), P([100, 60], [88, 66], [50, 72], [32, 80], [14, 88], [88, 92], [100, 92])],
}
const MOVES = [[/squat|leg press|lunge/i, 'squat'], [/dead|hip thrust|bridge/i, 'hinge'], [/bench|push-up|dip|pike/i, 'pushup'], [/press/i, 'press'], [/row|pull|chin/i, 'row'], [/curl|pushdown/i, 'curl'], [/plank/i, 'plank']]
export const moveFor = (name = '') => MOVES.find(([re]) => re.test(name))?.[1] || 'curl'
const HELD = new Set(['squat', 'hinge', 'press', 'row', 'curl'])
const SEG = [['s', 'p'], ['p', 'k'], ['k', 'a'], ['s', 'e'], ['e', 'w']]

export default function Doodle({ move = 'curl', speed = 2.8, className = '' }) {
  const id = useId().replace(/:/g, '')
  const still = useReducedMotion()
  const [a, b] = POSES[move] || POSES.curl
  const A = (attr, j, i) => still ? null : <animate attributeName={attr} values={`${a[j][i]};${b[j][i]};${a[j][i]}`} keyTimes="0;0.5;1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" dur={`${speed}s`} repeatCount="indefinite" />
  return (
    <svg viewBox="0 0 120 120" className={`w-full ${className}`} role="img" aria-label={`Animated sketch of the ${move} movement`} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <defs><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="3.2" /></filter></defs>
      <g filter={`url(#${id})`}>
        <path d="M6 111H114" strokeDasharray="1 9" opacity=".6" />
        {SEG.map(([p, q]) => <line key={p + q} x1={a[p][0]} y1={a[p][1]} x2={a[q][0]} y2={a[q][1]}>{A('x1', p, 0)}{A('y1', p, 1)}{A('x2', q, 0)}{A('y2', q, 1)}</line>)}
        <circle cx={a.h[0]} cy={a.h[1]} r="8">{A('cx', 'h', 0)}{A('cy', 'h', 1)}</circle>
        {HELD.has(move) && <circle cx={a.w[0]} cy={a.w[1]} r="6" fill="#ff4a1c">{A('cx', 'w', 0)}{A('cy', 'w', 1)}</circle>}
      </g>
    </svg>
  )
}

// Plays /videos/<slug>.mp4 if you added one, otherwise the sketch.
export const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export function ExerciseMedia({ name }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div className="w-44 mx-auto"><Doodle move={moveFor(name)} /></div>
  return <video src={`/videos/${slug(name)}.mp4`} autoPlay muted loop playsInline onError={() => setBad(true)} className="w-full h-full object-cover" aria-label={`${name} demonstration`} />
}
export function HeroMedia() {
  const [bad, setBad] = useState(false)
  if (bad) return <Doodle move="squat" />
  return <video src="/videos/hero.mp4" autoPlay muted loop playsInline onError={() => setBad(true)} className="w-full h-full object-cover" aria-hidden="true" />
}
export const watchUrl = (name) => `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' proper form tutorial')}`

export const Spark = ({ className = '' }) => <svg viewBox="0 0 40 40" className={className} fill="currentColor" aria-hidden="true"><path d="M20 2c1 10 8 17 18 18-10 1-17 8-18 18-1-10-8-17-18-18C12 19 19 12 20 2z" /></svg>
export const DumbbellDoodle = ({ className = '' }) => <svg viewBox="0 0 100 40" className={className} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" aria-hidden="true"><path d="M10 12v16M20 6v28M80 6v28M90 12v16M20 20h60" /></svg>
export const Squiggle = ({ className = '' }) => <svg viewBox="0 0 120 12" preserveAspectRatio="none" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true"><path d="M2 6C12 0 17 12 27 6S42 0 52 6 67 12 77 6 92 0 102 6s10 4 16 0" /></svg>
