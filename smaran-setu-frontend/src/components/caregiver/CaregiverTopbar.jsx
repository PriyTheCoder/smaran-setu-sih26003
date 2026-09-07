import { Bell, Menu } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import ThemeToggle from '../common/ThemeToggle'

export default function CaregiverTopbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">

      <div className="flex items-center justify-between px-4 py-4 lg:px-8">

        {/* Mobile menu */}
        <button
          type="button"
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>


        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">

          {/* Dark / Light mode */}
          <ThemeToggle />


          {/* Notifications */}
          <button
            type="button"
            className="rounded-xl p-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>


          {/* Profile */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f2f0] font-bold text-[#17345f] dark:bg-slate-700 dark:text-teal-300">
            R
          </div>

        </div>
      </div>


      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 lg:hidden">

          <NavLink
            className="block rounded-lg p-3 font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            to="/caregiver/dashboard"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            className="block rounded-lg p-3 font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            to="/caregiver/user"
            onClick={() => setOpen(false)}
          >
            My User
          </NavLink>

          <NavLink
            className="block rounded-lg p-3 font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            to="/caregiver/memories"
            onClick={() => setOpen(false)}
          >
            Memories
          </NavLink>

        </div>
      )}

    </header>
  )
}