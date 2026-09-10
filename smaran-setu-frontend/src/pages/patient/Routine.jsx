import { useEffect, useState } from 'react'

import {
  CheckCircle2,
  Clock,
  Heart,
  Sparkles,
} from 'lucide-react'

import PageTitle from '../../components/common/PageTitle'
import RoutineCard from '../../components/patient/RoutineCard'
import { routines } from '../../data/routines'

export default function Routine() {
  const [routineList, setRoutineList] = useState(() => {
  const savedRoutines = localStorage.getItem('dailyRoutines')

  if (savedRoutines) {
    return JSON.parse(savedRoutines)
  }

  return routines
})
useEffect(() => {
  localStorage.setItem(
    'dailyRoutines',
    JSON.stringify(routineList)
  )

  window.dispatchEvent(
    new Event('smaran-activity-updated')
  )
}, [routineList])

  const completedCount = routineList.filter(
    (item) => item.done
  ).length

  const totalCount = routineList.length

  const progress =
    totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0

  const handleComplete = (index) => {
    setRoutineList((currentRoutines) =>
      currentRoutines.map((item, i) =>
        i === index
          ? {
              ...item,
              done: !item.done,
            }
          : item
      )
    )
  }

  return (
    <div className="space-y-7 pb-8">

      {/* Page heading */}
      <PageTitle
        title="Today's Routine 🌞"
        subtitle="A gentle list of activities to help you through your day."
      />

      {/* Progress card */}
      <section className="relative overflow-hidden rounded-[30px] bg-linear-to-r from-[#2f8f92] to-[#7656bd] p-7 text-white shadow-lg sm:p-8">

        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />

        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative">

          <div className="flex items-center gap-2">
            <Heart size={19} fill="currentColor" />

            <span className="text-sm font-bold uppercase tracking-wide text-white/75">
              Your day
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-3xl font-black">
                One step at a time 💚
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Follow your routine at your own pace. You are doing great!
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">

              <CheckCircle2 size={25} />

              <div>
                <p className="text-2xl font-black">
                  {completedCount}/{totalCount}
                </p>

                <p className="text-xs font-semibold text-white/70">
                  completed
                </p>
              </div>

            </div>

          </div>

          {/* Progress bar */}
          <div className="mt-6">

            <div className="mb-2 flex justify-between text-xs font-bold text-white/70">

              <span>
                Today's progress
              </span>

              <span>
                {progress}%
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/20">

              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>

      {/* Routine heading */}
      <section>

        <div className="mb-5 flex items-end justify-between gap-4">

          <div>

            <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
              Your schedule
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#17345f]">
              Today's Activities
            </h2>

          </div>

          <div className="hidden items-center gap-2 rounded-xl bg-[#f8faf9] px-4 py-2 text-sm font-bold text-slate-500 sm:flex">

            <Clock size={17} />

            Take your time

          </div>

        </div>

        {/* Routine cards */}
        <div className="space-y-4">

          {routineList.map((item, index) => (
            <RoutineCard
              key={index}
              item={item}
              onComplete={() => handleComplete(index)}
            />
          ))}

        </div>

      </section>

      {/* Encouragement */}
      <section className="rounded-3xl border border-[#dcebe8] bg-[#f8fcfb] p-6 sm:p-7">

        <div className="flex items-start gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2f8f92] shadow-sm">

            <Sparkles size={26} />

          </div>

          <div>

            <h3 className="text-lg font-black text-[#17345f]">
              You're doing wonderfully 🌷
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              There is no need to rush. Complete each activity
              when you are ready and enjoy your day.
            </p>

          </div>

        </div>

      </section>

    </div>
  )
}