import { Brain, Sparkles, Clock3, Heart, ArrowRight } from 'lucide-react'

import PageTitle from '../../components/common/PageTitle'
import GameCard from '../../components/patient/GameCard'
import { games } from '../../data/games'

export default function Games() {
  return (
    <div className="space-y-7">

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <PageTitle
        title="Cognitive Games"
        subtitle="Short, friendly activities designed to keep your mind engaged."
      />


      {/* =====================================================
          WELCOME BANNER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[30px] bg-linear-to- from-[#17345f] via-[#245c75] to-[#2f8f92] p-7 text-white shadow-lg sm:p-9">

        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5" />

        <div className="absolute -bottom-16 right-28 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between gap-5">

          <div className="max-w-2xl">

            <div className="flex items-center gap-2">
              <Brain size={22} />
              <p className="text-sm font-bold uppercase tracking-wide text-[#17345f]">
                Brain Time
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-black sm:text-[#17345f]">
              Let&apos;s have some fun! 🧩
            </h1>

            <p className="mt-3 text-base leading-7 text-[#17345f] sm:text-lg">
              Choose a game you enjoy and take your time.
              There is no rush — just have fun.
            </p>

          </div>

          <div className="hidden rounded-3xl bg-white/10 p-5 backdrop-blur-sm sm:block">
            <Sparkles size={38} />
          </div>

        </div>

      </section>


      {/* =====================================================
          QUICK INFO
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-3">

        {/* Games */}
        <div className="card flex items-center gap-4 p-5">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f4f2] text-[#2f8f92]">
            <Brain size={24} />
          </div>

          <div>
            <p className="text-2xl font-black text-[#17345f]">
              {games.length}
            </p>

            <p className="text-sm font-semibold text-slate-500">
              Activities
            </p>
          </div>

        </div>


        {/* Duration */}
        <div className="card flex items-center gap-4 p-5">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4df] text-[#d28a2d]">
            <Clock3 size={24} />
          </div>

          <div>
            <p className="text-lg font-black text-[#17345f]">
              Short & Easy
            </p>

            <p className="text-sm font-semibold text-slate-500">
              Take your time
            </p>
          </div>

        </div>


        {/* Encouragement */}
        <div className="card flex items-center gap-4 p-5">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebfa] text-[#7656bd]">
            <Heart size={24} />
          </div>

          <div>
            <p className="text-lg font-black text-[#17345f]">
              Just for you
            </p>

            <p className="text-sm font-semibold text-slate-500">
              Enjoy the activity
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          GAME SECTION
      ===================================================== */}

      <section>

        <div className="mb-5 flex items-end justify-between gap-4">

          <div>

            <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
              Choose an activity
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#17345f]">
              What would you like to play?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pick any activity that looks interesting.
            </p>

          </div>

        </div>


        {/* Existing games */}
        <div className="grid gap-5 sm:grid-cols-2">

          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
            />
          ))}

        </div>

      </section>


      {/* =====================================================
          FRIENDLY MESSAGE
      ===================================================== */}

      <section className="rounded-3xl border border-[#dcebe8] bg-[#f8fcfb] p-6 sm:p-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            💚
          </div>

          <div className="flex-1">

            <h3 className="text-lg font-black text-[#17345f]">
              Remember, it&apos;s not a competition
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Enjoy each activity at your own pace. Every little activity
              is a positive step.
            </p>

          </div>

          <div className="hidden text-[#2f8f92] sm:block">
            <ArrowRight size={24} />
          </div>

        </div>

      </section>

    </div>
  )
}