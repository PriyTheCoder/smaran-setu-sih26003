import { useEffect, useState } from 'react'
import { User, Calendar, Phone, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Logo from '../../components/common/Logo'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'

export default function BasicDetails() {
  const navigate = useNavigate()
  const {
    role,
    profile,
    saveProfile,
  } = useAuth()

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
  })
useEffect(() => {
  if (!role) {
    navigate('/login', { replace: true })
  }
}, [role, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (form.mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.')
      return
    }

    if (Number(form.age) < 1 || Number(form.age) > 120) {
      alert('Please enter a valid age.')
      return
    }

    saveProfile({
      ...form,
      age: Number(form.age),
      updatedAt: Date.now(),
    })
if (role === 'user') {
  navigate('/initial-assessment')
} else {
  navigate('/caregiver/dashboard')
}
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-xl">
        <Logo />

        <div className="card mt-8 p-7 sm:p-9">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
              One-time setup
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#17345f] dark:text-white">
              Tell us a little about you
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-300">
              These details help us personalize your Smaran Setu experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <User size={17} />
                Full Name
              </label>

              <input
                className="input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <Calendar size={17} />
                Age
              </label>

              <input
                className="input"
                name="age"
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter your age"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <Users size={17} />
                Gender
              </label>

              <select
                className="input"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <Phone size={17} />
                Mobile Number
              </label>

              <input
                className="input"
                name="mobile"
                type="tel"
                inputMode="numeric"
                maxLength="10"
                value={form.mobile}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 10)

                  setForm((previous) => ({
                    ...previous,
                    mobile: value,
                  }))
                }}
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <div className="rounded-2xl bg-[#e8f4f2] p-4 text-sm text-[#17345f] dark:bg-slate-800 dark:text-slate-200">
              💚 Your information is stored locally in this prototype and is
              used to personalize your dashboard.
            </div>

            <Button type="submit" className="w-full">
              Continue to Smaran Setu →
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}