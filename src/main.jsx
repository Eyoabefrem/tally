import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { StoreProvider } from './lib/store'
import { AuthProvider } from './lib/auth'
import Login from './pages/Login'
import Body from './pages/Body'
import Insights from './pages/Insights'
import Landing from './pages/Landing'
import Log from './pages/Log'
import History from './pages/History'
import Progress from './pages/Progress'
import NotFound from './pages/NotFound'
import Today from './pages/Today'
import Programs from './pages/Programs'
import Session from './pages/Session'
import Exercises from './pages/Exercises'
import Settings from './pages/Settings'

createRoot(document.getElementById('root')).render(
  <AuthProvider><StoreProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/today" element={<Today />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/session" element={<Session />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/body" element={<Body />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/log" element={<Log />} />
        <Route path="/history" element={<History />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StoreProvider></AuthProvider>
)

// Lets Tally open offline and be installed as an app.
if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
