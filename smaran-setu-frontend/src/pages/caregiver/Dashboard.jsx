import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Activity,
  Brain,
  CheckCircle2,
  Flame,
  Gamepad2,
  ClipboardCheck,
} from 'lucide-react'

import PageTitle from '../../components/common/PageTitle'
import StatCard from '../../components/common/StatCard'
import ActivityChart from '../../components/caregiver/ActivityChart'
import AlertCard from '../../components/caregiver/AlertCard'

export default function Dashboard() {

    const { profile } = useAuth()

  const caregiverName = profile?.name || 'Caregiver'

  let patientProfile = null

  try {
    patientProfile = JSON.parse(
      localStorage.getItem('smaran_profile_user') || 'null'
    )
  } catch {
    patientProfile = null
  }

  const patientName = patientProfile?.name || 'your user'

  const [results, setResults] = useState([])
  const [routines, setRoutines] = useState([])

  useEffect(() => {
  const refreshDashboard = () => {
    const savedResults = JSON.parse(
      localStorage.getItem('gameResults') || '[]'
    )

    const savedRoutines = JSON.parse(
      localStorage.getItem('dailyRoutines') || '[]'
    )

    setResults(savedResults)
    setRoutines(savedRoutines)
  }

  // Load immediately
  refreshDashboard()

  // Listen for patient activity changes
  window.addEventListener(
    'smaran-activity-updated',
    refreshDashboard
  )

  return () => {
    window.removeEventListener(
      'smaran-activity-updated',
      refreshDashboard
    )
  }
}, [])

  /* =====================================================
     GAME STATISTICS
     ===================================================== */

  const gamesCompleted = results.length

  const averageScore =
    gamesCompleted > 0
      ? Math.round(
          results.reduce(
            (total, item) => total + item.score,
            0
          ) / gamesCompleted
        )
      : 0

  const bestScore =
    gamesCompleted > 0
      ? Math.max(...results.map((item) => item.score))
      : 0

  /* =====================================================
     ROUTINE STATISTICS
     ===================================================== */

  const completedRoutines = routines.filter(
    (item) => item.done
  ).length

  const totalRoutines = routines.length

  const routineCompletion =
    totalRoutines > 0
      ? Math.round(
          (completedRoutines / totalRoutines) * 100
        )
      : 0

  /* =====================================================
     CHART DATA
     ===================================================== */

  const recentResults = [...results]
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-7)

  const chart =
    recentResults.length > 0
      ? recentResults.map((item, index) => ({
          day: `Game ${index + 1}`,
          score: item.score,
        }))
      : [
          { day: 'Mon', score: 0 },
          { day: 'Tue', score: 0 },
          { day: 'Wed', score: 0 },
          { day: 'Thu', score: 0 },
          { day: 'Fri', score: 0 },
          { day: 'Sat', score: 0 },
          { day: 'Sun', score: 0 },
        ]

  /* =====================================================
     INSIGHTS
     ===================================================== */

  const getTrendMessage = () => {
    if (results.length < 2) {
      return 'Complete a few more activities to see a performance trend.'
    }

    const latest = results[results.length - 1].score
    const previous = results[results.length - 2].score

    if (latest > previous) {
      return 'Recent activity score is improving.'
    }

    if (latest < previous) {
      return 'Recent score is slightly lower. Gentle encouragement may help.'
    }

    return 'Recent activity scores are staying consistent.'
  }

  const getRoutineMessage = () => {
    if (totalRoutines === 0) {
      return 'No routine activities have been added yet.'
    }

    if (routineCompletion === 100) {
      return 'All routine activities are completed today.'
    }

    if (routineCompletion >= 60) {
      return 'Most routine activities have been completed today.'
    }

    return 'Some routine activities are still pending today.'
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Caregiver Dashboard"
        subtitle="A quick overview of Kamla's recent activity."
      />

      {/* =====================================================
          GREETING
          ===================================================== */}

      <div className="rounded-3xl bg-linear-to-r from-[#e8f2f0] to-[#f7faf9] p-6 shadow-sm sm:p-7">
        <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
          Caregiver Overview
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#17345f] sm:text-4xl">
         Good morning, {caregiverName} 👋
        </h1>

        <p className="mt-2 text-base text-slate-600">
         Here's how {patientName} is doing today.
        </p>
      </div>

      {/* =====================================================
          STATISTICS
          ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={Brain}
          label="Average score"
          value={`${averageScore}%`}
          note={
            gamesCompleted > 0
              ? `Best score ${bestScore}%`
              : 'No games completed yet'
          }
        />

        <StatCard
          icon={Gamepad2}
          label="Games completed"
          value={gamesCompleted}
          note="All completed activities"
        />

        <StatCard
          icon={Flame}
          label="Activity streak"
          value={`${Math.min(gamesCompleted, 7)} days`}
          note={
            gamesCompleted > 0
              ? 'Keep it going'
              : 'Start an activity'
          }
        />

        <StatCard
          icon={ClipboardCheck}
          label="Routine completion"
          value={`${routineCompletion}%`}
          note={
            totalRoutines > 0
              ? `${completedRoutines} of ${totalRoutines} completed`
              : 'No routines available'
          }
        />

      </div>

      {/* =====================================================
          ACTIVITY + INSIGHTS
          ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">

        {/* Cognitive Activity */}

        <div className="card overflow-hidden p-6 sm:p-7">

          <div className="flex items-start justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold text-[#17345f]">
                Cognitive Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Recent game scores.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f2f0] text-[#2f8f92]">
              <Activity size={22} />
            </div>

          </div>

          <div className="mt-6">
            <ActivityChart data={chart} />
          </div>

        </div>

        {/* Smart Insights */}

        <div className="card p-6 sm:p-7">

          <div>
            <h2 className="text-xl font-bold text-[#17345f]">
              Smart Insights
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Helpful observations from recent activity.
            </p>
          </div>

          <div className="mt-5 space-y-3">

            <AlertCard
              type="success"
              title="Activity trend"
              text={getTrendMessage()}
            />

            <AlertCard
              type="info"
              title="Routine progress"
              text={getRoutineMessage()}
            />

            <AlertCard
              type="warning"
              title="Games completed"
              text={
                gamesCompleted === 0
                  ? '{patientName} has not completed a cognitive game yet.'
                  : `{patientName} has completed ${gamesCompleted} cognitive ${
                      gamesCompleted === 1
                        ? 'activity'
                        : 'activities'
                    }.`
              }
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          RECENT ACTIVITIES
          ===================================================== */}

      <div className="card p-6 sm:p-7">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f2f0] text-[#2f8f92]">
            <Brain size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#17345f]">
              Recent Activities
            </h2>

            <p className="text-sm text-slate-500">
              Latest games completed by Kamla.
            </p>
          </div>

        </div>

        {results.length === 0 ? (

          <div className="mt-5 rounded-2xl bg-[#f8fcfb] p-6 text-center">

            <div className="text-3xl">
              🧩
            </div>

            <p className="mt-2 font-bold text-[#17345f]">
              No games completed yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Completed cognitive activities will appear here.
            </p>

          </div>

        ) : (

          <div className="mt-5 space-y-3">

            {[...results]
              .reverse()
              .slice(0, 5)
              .map((item, index) => (

                <div
                  key={`${item.timestamp}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8fcfb] p-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2f8f92] shadow-sm">
                      <GameIcon type={item.gameType} />
                    </div>

                    <div>
                      <p className="font-bold text-[#17345f]">
                        {item.game}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {item.date}
                      </p>
                    </div>

                  </div>

                  <div className="rounded-xl bg-white px-4 py-2 font-black text-[#2f8f92] shadow-sm">
                    {item.score}%
                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

      {/* =====================================================
          ROUTINE STATUS
          ===================================================== */}

      <div className="card p-6 sm:p-7">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f2f0] text-[#2f8f92]">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#17345f]">
              Today's Routine
            </h2>

            <p className="text-sm text-slate-500">
              Daily activity completion.
            </p>
          </div>

        </div>

        {routines.length === 0 ? (

          <p className="mt-5 text-sm text-slate-500">
            No routine activities available.
          </p>

        ) : (

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            {routines.map((item, index) => (

              <div
                key={`${item.title}-${index}`}
                className="flex items-center gap-3 rounded-2xl bg-[#f8fcfb] p-4"
              >

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    item.done
                      ? 'bg-[#2f8f92] text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <CheckCircle2 size={19} />
                </div>

                <div className="flex-1">

                  <p className="font-bold text-[#17345f]">
                    {item.title}
                  </p>

                  <p className="text-xs font-semibold text-slate-400">
                    {item.time}
                  </p>

                </div>

                <span
                  className={`text-xs font-bold ${
                    item.done
                      ? 'text-[#2f8f92]'
                      : 'text-slate-400'
                  }`}
                >
                  {item.done ? 'Completed' : 'Pending'}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          FRIENDLY REMINDER
          ===================================================== */}

      <div className="rounded-3xl border border-[#dcefeb] bg-[#f7fbfa] p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            💚
          </div>

          <div>

            <h3 className="text-lg font-bold text-[#17345f]">
              A little encouragement goes a long way
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Keep encouraging Kamla to complete her daily
              activities and enjoy the games together.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

function GameIcon({ type }) {
  if (type === 'number') {
    return <span className="text-lg">🔢</span>
  }

  if (type === 'picture') {
    return <span className="text-lg">🖼️</span>
  }

  if (type === 'object') {
    return <span className="text-lg">🔎</span>
  }

  return <Brain size={19} />
}