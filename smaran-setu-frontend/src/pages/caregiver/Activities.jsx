import { useEffect, useState } from 'react'
import {
  Brain,
  Image,
  Hash,
  Search,
  Gamepad2,
} from 'lucide-react'

import PageTitle from '../../components/common/PageTitle'

export default function Activities() {
  const [results, setResults] = useState([])

  useEffect(() => {
    const savedResults = JSON.parse(
      localStorage.getItem('gameResults') || '[]'
    )

    setResults(savedResults)
  }, [])

  return (
    <>
      <PageTitle
        title="Activities"
        subtitle="Review recent cognitive activities."
      />

      <div className="space-y-6">

        {/* Activity summary */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <ActivitySummary
            icon={Brain}
            title="Memory"
            type="memory"
            results={results}
          />

          <ActivitySummary
            icon={Image}
            title="Picture Recall"
            type="picture"
            results={results}
          />

          <ActivitySummary
            icon={Hash}
            title="Pattern Recognition"
            type="number"
            results={results}
          />

          <ActivitySummary
            icon={Search}
            title="Find the Object"
            type="object"
            results={results}
          />

        </div>

        {/* Recent activities */}

        <div className="card overflow-hidden">

          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f2f0] text-[#2f8f92]">
                <Gamepad2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#17345f]">
                  Recent Activities
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest cognitive activities completed by Kamla.
                </p>
              </div>

            </div>
          </div>

          {results.length === 0 ? (

            <div className="p-10 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f2f0] text-3xl">
                🧩
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#17345f]">
                No activities yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Completed cognitive games will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="border-b bg-slate-50 text-sm text-slate-500">

                  <tr>
                    <th className="p-4 font-semibold">
                      Activity
                    </th>

                    <th className="p-4 font-semibold">
                      When
                    </th>

                    <th className="p-4 font-semibold">
                      Status
                    </th>

                    <th className="p-4 font-semibold">
                      Score
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {[...results]
                    .reverse()
                    .map((item, index) => (

                      <tr
                        key={`${item.timestamp}-${index}`}
                        className="border-b last:border-0 hover:bg-slate-50"
                      >

                        <td className="p-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f2f0] text-[#2f8f92]">
                              <GameIcon
                                type={item.gameType}
                              />
                            </div>

                            <span className="font-bold text-[#17345f]">
                              {item.game}
                            </span>

                          </div>

                        </td>

                        <td className="p-4 text-sm text-slate-500">
                          {item.date}
                        </td>

                        <td className="p-4">

                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            Completed
                          </span>

                        </td>

                        <td className="p-4 font-bold text-[#17345f]">
                          {item.score}%
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* Encouragement */}

        <div className="rounded-3xl border border-[#dcefeb] bg-[#f7fbfa] p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
              💚
            </div>

            <div>

              <h3 className="text-lg font-bold text-[#17345f]">
                Every activity is meaningful
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Encourage Kamla to enjoy these activities at her
                own pace. Regular participation helps maintain a
                healthy daily routine.
              </p>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}


/* =====================================================
   ACTIVITY SUMMARY CARD
   ===================================================== */

function ActivitySummary({
  icon: Icon,
  title,
  type,
  results,
}) {
  const activityResults = results.filter(
    (item) => item.gameType === type
  )

  const count = activityResults.length

  const average =
    count > 0
      ? Math.round(
          activityResults.reduce(
            (total, item) => total + item.score,
            0
          ) / count
        )
      : 0

  return (
    <div className="card p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2f0] text-[#2f8f92]">
          <Icon size={24} />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-500">
            {title}
          </p>

          <p className="text-2xl font-black text-[#17345f]">
            {count}
          </p>

        </div>

      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">

        <p className="text-xs font-semibold text-slate-400">
          Average score
        </p>

        <p className="mt-1 font-bold text-[#2f8f92]">
          {count > 0 ? `${average}%` : 'Not played'}
        </p>

      </div>

    </div>
  )
}


/* =====================================================
   GAME ICON
   ===================================================== */

function GameIcon({ type }) {
  if (type === 'number') {
    return <Hash size={19} />
  }

  if (type === 'picture') {
    return <Image size={19} />
  }

  if (type === 'object') {
    return <Search size={19} />
  }

  return <Brain size={19} />
}