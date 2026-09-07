import {
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Heart,
  Sparkles,
  Trophy,
} from 'lucide-react'

import { Link, useLocation } from 'react-router-dom'

import Button from '../../components/common/Button'


export default function GameResult() {
  const { state } = useLocation()

  const game = state?.game || 'Memory Game'
  const score = state?.score || 80


  /* =====================================================
     FRIENDLY MESSAGE
     ===================================================== */

  const getMessage = () => {
    if (score >= 90) {
      return 'Amazing work! You did wonderfully.'
    }

    if (score >= 70) {
      return 'Great job! You are doing really well.'
    }

    if (score >= 50) {
      return 'Good effort! Keep enjoying your activities.'
    }

    return 'Well done for completing the activity!'
  }


  return (
    <div className="mx-auto max-w-2xl pb-8">

      {/* =====================================================
          SUCCESS CARD
          ===================================================== */}

      <div className="card overflow-hidden">

        {/* ===================================================
            TOP SUCCESS AREA
            =================================================== */}

        <div className="relative overflow-hidden bg-linear-to- from-[#17345f] via-[#245c75] to-[#2f8f92] px-6 py-10 text-center text-white sm:px-10 sm:py-12">

          {/* Decorative circles */}

          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5" />

          <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />


          <div className="relative">

            {/* Success icon */}

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/15 shadow-lg backdrop-blur-sm">

              <CheckCircle2
                size={52}
                strokeWidth={2}
              />

            </div>


            {/* Heading */}

            <h1 className="text-[#17345f] dark:text-[#17345f]">
              Well done! 🌟
            </h1>


            <p className="text-slate-600 dark:text-[#17345f]">
              You completed your activity. Take a moment to feel proud of yourself.
            </p>

          </div>

        </div>


        {/* ===================================================
            RESULT CONTENT
            =================================================== */}

        <div className="p-6 sm:p-8">

          {/* Game name */}

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
              Activity completed
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#17345f]">
              {game}
            </h2>

          </div>


          {/* =================================================
              SCORE
              ================================================= */}

          <div className="my-7 rounded-[28px] bg-linear-to- from-[#e8f4f2] to-[#f0ebfa] p-7 text-center sm:p-8">

            <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">

              <Trophy size={18} />

              Activity Score

            </div>


            <p className="mt-3 text-6xl font-black tracking-tight text-[#17345f] sm:text-7xl">
              {score}%
            </p>


            <p className="mt-3 text-base font-bold text-[#2f8f92]">
              {getMessage()}
            </p>

          </div>


          {/* =================================================
              ENCOURAGEMENT
              ================================================= */}

          <div className="rounded-3xl border border-[#dcebe8] bg-[#f8fcfb] p-5 sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2f8f92] shadow-sm">

                <Heart
                  size={24}
                  fill="currentColor"
                />

              </div>


              <div>

                <h3 className="text-lg font-black text-[#17345f]">
                  Every activity counts 💚
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Keep taking part in activities at your own pace.
                  There is no need to rush.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              ACTION BUTTONS
              ================================================= */}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">

            <Link
              to="/user/games"
              className="w-full"
            >
              <Button className="w-full">

                <RotateCcw
                  className="mr-2"
                  size={18}
                />

                Play Another

              </Button>
            </Link>


            <Link
              to="/user/progress"
              className="w-full"
            >
              <Button
                variant="secondary"
                className="w-full"
              >

                View My Progress

                <ArrowRight
                  className="ml-2"
                  size={18}
                />

              </Button>
            </Link>

          </div>


          {/* =================================================
              FINAL MESSAGE
              ================================================= */}

          <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs font-semibold text-slate-400">

            <Sparkles size={15} />

            Keep enjoying your activities.

          </div>

        </div>

      </div>

    </div>
  )
}