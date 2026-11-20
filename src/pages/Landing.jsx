import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Doodle, { HeroMedia, Spark, DumbbellDoodle, Squiggle, moveFor } from '../components/Doodle'
import { PROGRAMS } from '../lib/programs'

function Float({ children, y = 12, d = 4, className = '' }) {
  const still = useReducedMotion()
  return <motion.div className={className} animate={still ? {} : { y: [0, -y, 0], rotate: [0, 5, 0] }} transition={{ duration: d, repeat: Infinity, ease: 'easeInOut' }}>{children}</motion.div>
}
const Line = ({ children, i }) => (
  <span className="block overflow-hidden pb-[.04em]"><motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.12 * i, duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}>{children}</motion.span></span>
)
const Ring = () => (
  <svg viewBox="0 0 120 120" className="-rotate-90" aria-hidden="true">
    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="10" />
    <circle cx="60" cy="60" r="54" fill="none" stroke="#ff4a1c" strokeWidth="10" strokeDasharray="339.3" strokeDashoffset="0"><animate attributeName="stroke-dashoffset" values="0;339.3" dur="6s" repeatCount="indefinite" /></circle>
  </svg>
)
const reveal = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } }
const colors = [['var(--o)', '#0d0d0d'], ['var(--b)', '#fff'], ['var(--card)', 'var(--ink)'], ['var(--o)', '#0d0d0d'], ['var(--b)', '#fff']]

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      <header className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Logo /><span className="flex items-center gap-4"><Link to="/programs" className="font-bold hidden sm:block hover:underline underline-offset-4">Programs</Link><Link to="/today" className="font-bold hidden sm:block hover:underline underline-offset-4">Open the app</Link><ThemeToggle /></span>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-6 pb-16 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="font-bold text-lg" style={{ color: 'var(--muted)' }}>The training log that keeps up with you</motion.p>
          <h1 className="display text-[clamp(5.5rem,17vw,13rem)] mt-2"><Line i={0}>Log</Line><Line i={1}>the work</Line></h1>
          <Squiggle className="w-52 h-4 -mt-1" />
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-xl font-semibold max-w-md mt-8">Ready-made programs, a focus mode with a rest timer, personal records and charts. Free to start, and nothing to sign up for.</motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="flex flex-wrap gap-4 mt-9"><Link to="/today" className="btn text-lg">Start a workout</Link><Link to="/programs" className="btn btn-plain border-[3px] text-lg">See programs</Link></motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.92, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }} className="relative max-w-md mx-auto w-full">
          <div className="aspect-square border-[3px] border-[var(--ink)] grid place-items-center overflow-hidden" style={{ background: 'var(--b)', color: '#fff', boxShadow: '10px 10px 0 var(--ink)' }}><div className="w-4/5"><HeroMedia /></div></div>
          <Float className="absolute -top-6 -left-6 w-14" d={3.5}><Spark className="text-[var(--o)]" /></Float>
          <Float className="absolute -bottom-5 -right-7 w-28" d={5} y={9}><DumbbellDoodle className="text-[var(--ink)]" /></Float>
          <Float className="absolute top-6 -right-6 w-24 p-2 border-[3px] border-[var(--ink)]" d={6} y={6}><div className="relative" style={{ background: 'var(--b)', color: '#fff' }}><Ring /><span className="absolute inset-0 grid place-items-center display text-2xl">Rest</span></div></Float>
          <Float className="absolute bottom-8 -left-8" d={4.5} y={8}><span className="display text-3xl px-4 py-2 border-[3px] border-[var(--ink)] -rotate-6 block" style={{ background: 'var(--o)', color: '#0d0d0d' }}>New record</span></Float>
        </motion.div>
      </section>

      <div className="border-y-[3px] border-[var(--ink)] py-4 overflow-hidden" style={{ background: 'var(--ink)', color: 'var(--o)' }} aria-hidden="true">
        <div className="marquee display text-5xl whitespace-nowrap">{[0, 1].map((i) => <span key={i} className="pr-8">{'Log the work / Beat last time / Rest. Repeat. / '.repeat(4)}</span>)}</div>
      </div>

      <section className="max-w-6xl mx-auto px-5 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div {...reveal}>
          <h2 className="display text-[clamp(3rem,9vw,6.5rem)]">One set at a time</h2>
          <p className="text-xl mt-6 max-w-md" style={{ color: 'var(--muted)' }}>Focus mode shows only what matters: the lift, the weight, the reps. Tap to complete a set, watch the rest ring run, and hear it beep when it is time to go again.</p>
          <ul className="mt-6 space-y-2 font-bold text-lg"><li>Big steppers, no tiny keyboards</li><li>Plate calculator built in</li><li>Screen stays awake</li></ul>
        </motion.div>
        <motion.div {...reveal} whileHover={{ rotate: -1.5, y: -6 }} className="border-[3px] border-[var(--ink)] max-w-sm mx-auto w-full" style={{ background: 'var(--card)', boxShadow: '10px 10px 0 var(--o)' }}>
          <div className="p-5 border-b-[3px] border-[var(--ink)] flex items-center justify-between gap-3"><div><p className="font-bold">Set 2 of 3, target 8</p><h3 className="display text-5xl">Back squat</h3></div><div className="w-20 shrink-0"><Doodle move="squat" /></div></div>
          <div className="grid grid-cols-2 gap-3 p-5">{[['Weight (kg)', '80'], ['Reps', '8']].map(([l, v]) => <div key={l}><p className="font-bold text-sm mb-1">{l}</p><p className="display text-6xl text-center border-[3px] border-[var(--ink)] py-1">{v}</p></div>)}</div>
          <div className="px-5 pb-5"><div className="display text-3xl text-center py-4 border-[3px] border-[var(--ink)]" style={{ background: 'var(--o)', color: '#0d0d0d' }}>Complete set</div></div>
          <div className="p-5 flex items-center gap-4 border-t-[3px] border-[var(--ink)]" style={{ background: 'var(--b)', color: '#fff' }}><div className="w-16"><Ring /></div><span className="display text-4xl">Rest 1:30</span></div>
        </motion.div>
      </section>

      <section className="py-20" style={{ background: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto px-5">
          <motion.h2 {...reveal} className="display text-[clamp(3rem,9vw,6.5rem)]">Ready-made programs</motion.h2>
          <p className="text-lg mt-3 max-w-lg" style={{ color: 'var(--muted)' }}>Five plans from first-timer to lifter. Pick one and Tally serves up the next workout.</p>
        </div>
        <div className="flex gap-6 overflow-x-auto snap-x px-5 sm:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] py-10">
          {PROGRAMS.map((p, i) => (
            <motion.div key={p.id} whileHover={{ y: -10, rotate: i % 2 ? 1.5 : -1.5 }} className="snap-start shrink-0 w-72 border-[3px] border-[var(--ink)]" style={{ background: colors[i][0], color: colors[i][1], boxShadow: '6px 6px 0 var(--ink)' }}>
              <div className="p-5 pb-0"><p className="font-bold">{p.level}, {p.days}</p><h3 className="display text-4xl mt-1">{p.name}</h3></div>
              <div className="w-40 mx-auto my-3"><Doodle move={moveFor(p.workouts[0].exercises[0].name)} speed={2.4 + i * 0.3} /></div>
              <p className="px-5 pb-5 font-semibold">{p.workouts.length} {p.workouts.length === 1 ? 'workout' : 'workouts'}, {p.workouts[0].minutes} min each</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-24 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <motion.div {...reveal}>
          <svg viewBox="0 0 220 100" className="w-full max-w-sm" aria-hidden="true"><g fill="none" strokeLinecap="round" strokeWidth="9" stroke="currentColor">
            {[30, 70, 110, 150].map((x, i) => <motion.path key={x} d={`M${x} 10V90`} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.25, duration: 0.45 }} />)}
            <motion.path d="M10 82L185 18" stroke="var(--o)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 1.1, duration: 0.5 }} />
          </g></svg>
        </motion.div>
        <motion.div {...reveal} className="grid sm:grid-cols-3 gap-8">
          {[['Records', 'Tally tells you the moment you break one.'], ['Insights', 'Weekly volume, muscle balance and a record timeline.'], ['Yours to keep', 'Export everything as a spreadsheet. Sync across devices when you want.']].map(([t, d]) => <div key={t}><h3 className="display text-3xl">{t}</h3><p className="mt-2 font-medium" style={{ color: 'var(--muted)' }}>{d}</p></div>)}
        </motion.div>
      </section>

      <section className="relative overflow-hidden" style={{ background: 'var(--o)', color: '#0d0d0d' }}>
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-wrap items-center justify-between gap-8">
          <h2 className="display text-[clamp(3.5rem,12vw,9rem)]">Start today</h2>
          <div className="w-48 hidden sm:block"><Doodle move="press" /></div>
          <Link to="/today" className="btn btn-ink text-xl">Open Tally</Link>
        </div>
      </section>
      <footer className="max-w-6xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4"><Logo size={26} /><span className="font-semibold" style={{ color: 'var(--muted)' }}>Tally is free. Your workouts stay on your device until you choose to sync.</span></footer>
    </div>
  )
}
