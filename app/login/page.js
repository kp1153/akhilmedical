'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      window.location.href = '/'
    } else {
      setError('Wrong password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-6 text-center">Akhil Medical Store</h1>
        <div className="relative mb-4">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}