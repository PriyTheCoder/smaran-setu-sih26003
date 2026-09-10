import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import Logo from '../../components/common/Logo'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signup } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await signup(role, email, password)

      localStorage.removeItem(`smaran_profile_${role}`)

      navigate('/setup-profile', { replace: true })
    } catch (err) {
      console.error('Signup error:', err)

      setError(
        err.message || 'Signup failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-md">
        <Logo />

        <div className="card mt-8 p-7">
          <h1 className="text-2xl font-bold text-[#17345f] dark:text-black">
            Create your account
          </h1>

          <p className="mt-2 text-slate-500 dark:text-black">
            Start your personalized Smaran Setu journey.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`rounded-2xl border p-4 text-left ${
                role === 'user'
                  ? 'border-[#2f8f92] bg-[#e8f2f0]'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <b>User</b>

              <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                For the elderly user
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole('caregiver')}
              className={`rounded-2xl border p-4 text-left ${
                role === 'caregiver'
                  ? 'border-[#2f8f92] bg-[#e8f2f0]'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <b>Caregiver</b>

              <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                For family or helper
              </span>
            </button>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={submit}
          >
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              className="input"
              placeholder="Create password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Continue to profile →'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}

            <Link
              className="font-bold text-[#2f8f92]"
              to="/login"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}