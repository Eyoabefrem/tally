import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function NotFound() {
  return (
    <div><Header /><main className="max-w-5xl mx-auto px-5 py-20">
      <p className="display text-[clamp(8rem,34vw,22rem)]" style={{ color: 'var(--o)' }}>404</p>
      <h1 className="display text-5xl">Missed the rep</h1><Link to="/" className="btn mt-8">Back home</Link>
    </main></div>
  )
}
