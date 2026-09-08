import { useEffect, useState } from 'react'

import {
  CalendarDays,
  Gamepad2,
  Heart,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Volume2,
  Smile,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import SmaranChatbot from '../../components/patient/SmaranChatbot'

const actions = [
  {
    to: '/user/games',
    Icon: Gamepad2,
    title: 'Play Games',
    note: 'Fun activities for your memory',
    color: 'bg-[#e8f4f2]',
    iconColor: 'text-[#2f8f92]',
  },
  {
    to: '/user/memories',
    Icon: Heart,
    title: 'My Memories',
    note: 'People and moments I love',
    color: 'bg-[#f0ebfa]',
    iconColor: 'text-[#7656bd]',
  },
  {
    to: '/user/routine',
    Icon: CalendarDays,
    title: 'My Routine',
    note: 'See what comes next',
    color: 'bg-[#fff4df]',
    iconColor: 'text-[#d28a2d]',
  },
  {
    to: '/user/progress',
    Icon: BarChart3,
    title: 'My Progress',
    note: 'See how I am doing',
    color: 'bg-[#e9f0fa]',
    iconColor: 'text-[#17345f]',
  },
]

export default function Home() {
  const { profile } = useAuth()
  const [showSmaranChat, setShowSmaranChat] = useState(false)
  const [activity, setActivity] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  })

  const refreshActivity = () => {
    try {
      const savedRoutines = JSON.parse(
        localStorage.getItem('dailyRoutines') || '[]'
      )

      const savedGames = JSON.parse(
        localStorage.getItem('gameResults') || '[]'
      )

      // Completed routines
      const completedRoutines = savedRoutines.filter(
        (item) => item.done
      ).length

      const totalRoutines = savedRoutines.length

      // Count unique games played today
      const today = new Date().toLocaleDateString()

      const todayGames = savedGames.filter(
        (game) => game.date === today
      )

      const completedGames = new Set(
        todayGames.map((game) => game.gameId)
      ).size

      // There are currently 4 games in the app
      const totalGames = 4

      const completed = completedRoutines + completedGames
      const total = totalRoutines + totalGames

      const percentage =
        total > 0
          ? Math.round((completed / total) * 100)
          : 0

      setActivity({
        completed,
        total,
        percentage,
      })
    } catch (error) {
      console.error('Unable to calculate activity:', error)
    }
  }

  useEffect(() => {
    refreshActivity()

    const handleActivityUpdate = () => {
      refreshActivity()
    }

    window.addEventListener(
      'smaran-activity-updated',
      handleActivityUpdate
    )

    return () => {
      window.removeEventListener(
        'smaran-activity-updated',
        handleActivityUpdate
      )
    }
  }, [])

  const patientName = profile?.name || 'there'

  return (
    <div className="space-y-7">

      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[30px] bg-linear-to-r from-[#17345f] via-[#1d5274] to-[#2f8f92] p-7 text-white shadow-lg sm:p-9">

        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 right-24 h-44 w-44 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between gap-5">

          <div className="max-w-2xl">

            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white/90">
                Good morning
              </span>

              <span className="text-xl">❤️</span>
            </div>

           <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
         Hello, {patientName}! 👋
          </h1>

            <p className="mt-3 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
              Welcome back to your personal space.
              Let&apos;s make today a happy and active day.
            </p>

            {/* Small wellness badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <Sparkles size={17} />
              <span>You&apos;re doing great today!</span>
            </div>

          </div>

          {/* Voice button */}
          <div className="hidden rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:block">
            <Volume2 size={30} />
          </div>

        </div>
      </section>


      {/* =====================================================
          TODAY'S WELLNESS
      ===================================================== */}

      <section className="card overflow-hidden p-6 sm:p-7">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-2">
              <Smile
                size={20}
                className="text-[#2f8f92]"
              />

              <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
                Today&apos;s wellness
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-black text-[#17345f]">
              Keep your mind active 🌱
            </h2>

            <p className="mt-2 max-w-xl text-slate-500">
              A few simple activities can make your day more enjoyable.
            </p>

          </div>

          {/* Progress circle */}
          <div className="flex shrink-0 items-center gap-4">

            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f4f2]">

                            <div className="text-xl font-black text-[#2f8f92]">
                           {activity.percentage}%
                            </div>

            </div>

            <div>
              <p className="font-bold text-[#17345f]">
            {activity.completed} of {activity.total}
              </p>

              <p className="text-sm text-slate-500">
                activities done
              </p>
            </div>

          </div>

        </div>

        {/* Progress bar */}
        <div className="mt-6">

          <div className="mb-2 flex justify-between text-xs font-bold">
            <span className="text-slate-500">
              Daily goal
            </span>

                      <span className="text-[#2f8f92]">
            {activity.percentage >= 80
              ? 'Excellent!'
              : activity.percentage >= 50
                ? 'Almost there!'
                : 'Keep going gently!'}
          </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div
          className="h-full rounded-full bg-[#2f8f92] transition-all duration-500"
          style={{
            width: `${activity.percentage}%`,
          }}
/>

          </div>

        </div>

      </section>


      {/* =====================================================
          YOUR SPACE
      ===================================================== */}

      <section>

        <div className="mb-5">

          <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
            Your space
          </p>

          <h2 className="mt-1 text-2xl font-black text-[#17345f]">
            What would you like to do?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose something you would like to enjoy.
          </p>

        </div>


        <div className="grid gap-4 sm:grid-cols-2">

          {actions.map(
            ({ to, Icon, title, note, color, iconColor }) => (

              <Link
                key={to}
                to={to}
                className="card card-hover group flex min-h-38.75 items-center gap-5 p-6"
              >

                {/* Icon */}
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${color} ${iconColor} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    size={32}
                    strokeWidth={2.2}
                  />
                </div>


                {/* Text */}
                <div className="min-w-0">

                  <h3 className="text-xl font-black text-[#17345f]">
                    {title}
                  </h3>

                  <p className="mt-1 text-base leading-6 text-slate-500">
                    {note}
                  </p>

                  <span className="mt-3 inline-block text-sm font-bold text-[#2f8f92]">
                    Open →
                  </span>

                </div>


                {/* Arrow */}
                <ArrowRight
                  className="ml-auto shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#2f8f92]"
                  size={25}
                />

              </Link>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          NEXT ACTIVITY
      ===================================================== */}

      <section className="card border-[#dcebe8] bg-[#f8fcfb] p-6 sm:p-7">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Icon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e8f4f2] text-[#2f8f92]">
            <CheckCircle2 size={28} />
          </div>


          {/* Content */}
          <div className="flex-1">

            <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
              Next activity
            </p>

            <h3 className="mt-1 text-xl font-black text-[#17345f]">
              Memory Match 🎮
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              A short and fun activity to exercise your memory.
            </p>

          </div>


          {/* Button */}
          <Link
            to="/user/games"
            className="btn-secondary shrink-0"
          >
            Start Activity
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>


      {/* =====================================================
          ENCOURAGEMENT
      ===================================================== */}

      <section className="rounded-3xl border border-[#e6e0f4] bg-linear-to-r from-[#f8f5fd] to-[#f8fcfb] p-6 sm:p-7">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            💚
          </div>

          <div>

            <h3 className="text-lg font-black text-[#17345f]">
              Every little step matters
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Take your time, enjoy your activities, and keep making
              beautiful moments every day.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          VOICE HELP
      ===================================================== */}
<div className="flex justify-center pb-3">
  <button
    type="button"
    onClick={() => setShowSmaranChat(true)}
    className="flex items-center gap-3 rounded-2xl bg-[#2f8f92] px-6 py-4 font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#267a7d] hover:shadow-lg"
  >
    <Volume2 size={20} />
    <span>Need help? Talk to Smaran</span>
  </button>
</div>

      {showSmaranChat && (
  <SmaranChatbot
    onClose={() => setShowSmaranChat(false)}
  />
)}

    </div>
  )
}