import { Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Logo from '../common/Logo'
import ThemeToggle from '../common/ThemeToggle'

import { useAuth } from '../../context/AuthContext'


export default function PatientNavbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Logo compact />


        {/* Right side buttons */}
        <div className="flex items-center gap-2">

          {/* Dark / Light mode */}
          <ThemeToggle />


          {/* Notifications */}
          <button
            type="button"
            className="rounded-xl p-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={21} />
          </button>


          {/* Logout */}
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="rounded-xl p-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Log out"
          >
            <LogOut size={21} />
          </button>

        </div>

      </div>

    </header>
  )
}