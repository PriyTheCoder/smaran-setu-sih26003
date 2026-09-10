import { useEffect, useState } from 'react'
import {
  Brain,
  Target,
  Star,
  Flame,
  TrendingUp,
} from 'lucide-react'

import PageTitle from '../../components/common/PageTitle'

export default function Progress() {
  const [results, setResults] = useState([])

  useEffect(() => {
    const savedResults = JSON.parse(
      localStorage.getItem('gameResults') || '[]'
    )

    setResults(savedResults)
  }, [])

  const gamesCompleted = results.length

  const averageScore =
    gamesCompleted > 0
      ? Math.round(
          results.reduce((total, item) => total + item.score, 0) /
            gamesCompleted
        )
      : 0

  const bestScore =
    gamesCompleted > 0
      ? Math.max(...results.map((item) => item.score))
      : 0

  const getGameScore = (type) => {
    const gameResults = results.filter(
      (item) => item.gameType === type
    )

    if (gameResults.length === 0) return 0

    return Math.round(
      gameResults.reduce(
        (total, item) => total + item.score,
        0
      ) / gameResults.length
    )
  }

  const memoryScore = getGameScore('memory')
  const pictureScore = getGameScore('picture')
  const numberScore = getGameScore('number')
  const objectScore = getGameScore('object')

  const activities =
    results.length > 0
      ? Math.min(results.length, 7)
      : 0

  return (
    <div className="space-y-6">
      <PageTitle
        title="My Progress"
        subtitle="See how you are doing with your activities."
      />

      {/* Encouragement */}
      <div className="rounded-3xl bg-gradient-to-r from-[#e8f2f0] to-[#f4f8f7] p-7 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
              Keep going!
            </p>

            <h2 className="mt-1 text-3xl font-bold text-[#17345f]">
              🌟 You're Doing Great!
            </h2>

            <p className="mt-2 text-slate-600">
              Every activity is a small step forward.
            </p>
          </div>

          <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-[#17345f]">
              <Flame size={24} />
              {activities} days
            </div>

            <div className="text-sm font-semibold text-slate-500">
              Activity streak
            </div>
          </div>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        {/* Average Score */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#2f8f92]">
              <Target size={27} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Average Score
              </p>

              <p className="text-3xl font-bold text-[#17345f]">
                {averageScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Best Score */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#d28a2d]">
              <Star size={27} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Best Score
              </p>

              <p className="text-3xl font-bold text-[#17345f]">
                {bestScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Games Completed */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#7656bd]">
              <Brain size={27} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Games Completed
              </p>

              <p className="text-3xl font-bold text-[#17345f]">
                {gamesCompleted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Performance */}
      <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
        <div className="mb-7">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={22}
              className="text-[#2f8f92]"
            />

            <h2 className="text-2xl font-bold text-[#17345f]">
              Game Performance
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Your performance across different activities.
          </p>
        </div>

        {/* Memory */}
        <ProgressBar
          label="🧠 Memory"
          score={memoryScore}
        />

        {/* Picture */}
        <ProgressBar
          label="🖼️ Picture Recall"
          score={pictureScore}
        />

        {/* Number */}
        <ProgressBar
          label="🔢 Number Sequence"
          score={numberScore}
        />

        {/* Object */}
        <ProgressBar
          label="🔎 Object Recognition"
          score={objectScore}
        />
      </div>

      {/* Recent Activities */}
      <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#17345f]">
            Recent Activities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest completed games.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl bg-[#f8fcfb] p-6 text-center">
            <div className="text-3xl">🧩</div>

            <p className="mt-2 font-bold text-[#17345f]">
              No activities completed yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Play a cognitive game and your results will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...results]
              .reverse()
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={`${item.timestamp}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8fcfb] p-4"
                >
                  <div>
                    <p className="font-bold text-[#17345f]">
                      {item.game}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-black-200">
                      {item.date}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-2 font-black text-blue shadow-sm">
                    {item.score}%
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Positive Message */}
      <div className="rounded-3xl border border-[#dcefeb] bg-[#f7fbfa] p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">
            💚
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#17345f]">
              Keep enjoying your activities!
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              You are building a wonderful routine. Keep playing,
              remembering and staying active.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ label, score }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-bold text-black">
          {label}
        </span>

        <span className="font-bold text-blue">
          {score}%
        </span>
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#2f8f92] transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}