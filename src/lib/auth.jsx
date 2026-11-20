import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, configured } from './supabase'

// Email codes: no passwords. Signing in with a new email creates the account.
const Ctx = createContext(null)
const NOT_SET = 'Accounts are not set up yet. Add your Supabase keys to .env and restart.'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!configured) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])
  // Each returns an error message, or null on success.
  const sendCode = async (email) => {
    if (!configured) return NOT_SET
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    return error ? error.message : null
  }
  const verifyCode = async (email, token) => {
    if (!configured) return NOT_SET
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    return error ? error.message : null
  }
  const logout = () => supabase.auth.signOut()
  return <Ctx.Provider value={{ user, loading, sendCode, verifyCode, logout }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
