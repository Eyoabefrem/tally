import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { sendCode, verifyCode } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const send = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr('Enter a valid email address.')
    setBusy(true); setErr('')
    const m = await sendCode(email.trim())
    setBusy(false); m ? setErr(m) : setSent(true)
  }
  const verify = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const m = await verifyCode(email.trim(), code.trim())
    setBusy(false); m ? setErr(m) : nav('/today')
  }

  return (
    <div>
      <Header />
      <main className="max-w-lg mx-auto px-5 py-12">
        <h1 className="display text-[clamp(3.5rem,12vw,6rem)]">{sent ? 'Check your email' : 'Sync your training'}</h1>
        <p className="mt-4 text-lg" style={{ color: 'var(--muted)' }}>{sent ? `We sent a code to ${email.trim()}. Enter it below.` : 'Enter your email and we’ll send a code. Your workouts follow you to every device. New here? That creates your account.'}</p>
        {!sent ? (
          <form onSubmit={send} className="mt-8 space-y-4">
            <label className="block font-bold">Email<input type="email" className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus /></label>
            {err && <p role="alert" className="font-bold" style={{ color: 'var(--o)' }}>{err}</p>}
            <button disabled={busy} className="btn w-full disabled:opacity-60">{busy ? 'Sending' : 'Send code'}</button>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-8 space-y-4">
            <label className="block font-bold">Code<input className="input mt-1 text-center !text-3xl tracking-[.3em]" inputMode="numeric" maxLength={10} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} autoFocus /></label>
            {err && <p role="alert" className="font-bold" style={{ color: 'var(--o)' }}>{err}</p>}
            <button disabled={busy || code.length < 6} className="btn w-full disabled:opacity-60">{busy ? 'Checking' : 'Verify and continue'}</button>
            <button type="button" onClick={() => { setSent(false); setCode(''); setErr('') }} className="w-full font-bold underline underline-offset-4 py-2">Use a different email</button>
          </form>
        )}
      </main>
    </div>
  )
}
