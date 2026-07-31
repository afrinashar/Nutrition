'use client'

import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { postJson } from '../../lib/api'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await postJson('/auth/register', { email, password })
      setMessage('Account created successfully. You can now sign in.')
    } catch (error) {
      setMessage('Registration failed. Try a different email.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-xl shadow-slate-900/40">
        <h1 className="text-3xl font-semibold text-emerald-300">Create your NutriAI account</h1>
        <p className="mt-3 text-slate-400">Start building smart nutrition plans with AI.</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
              required
            />
          </label>
          <button className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-amber-300">{message}</p>}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-emerald-300 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
