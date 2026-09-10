import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/common/Logo'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [role, setRole] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(role, email, password)

      if (data.profileCompleted) {
        navigate(role === 'user' ? '/user/home' : '/caregiver/dashboard', {
          replace: true,
        })
      } else {
        navigate('/setup-profile', { replace: true })
      }
    } catch (err) {
      setError(err.message)
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
            Welcome back
          </h1>
          <p className="mt-2 text-slate-500 dark:text-black">
            Choose your account type and continue.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`rounded-xl p-3 font-bold ${
                role === 'user'
                  ? 'bg-white text-[#17345f] shadow dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole('caregiver')}
              className={`rounded-xl p-3 font-bold ${
                role === 'caregiver'
                  ? 'bg-white text-[#17345f] shadow dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              Caregiver
            </button>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold">Email</label>
              <input
                className="input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">
                Password
              </label>
              <input
                className="input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? 'Logging in...'
                : `Continue as ${role === 'user' ? 'User' : 'Caregiver'}`}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{' '}
            <Link className="font-bold text-[#2f8f92]" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
