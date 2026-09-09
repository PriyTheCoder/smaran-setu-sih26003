import {
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Heart,
  Sparkles,
  Trophy,
  Brain,
  Image as ImageIcon,
  Hash,
  Search,
  Star,
  TrendingUp,
} from 'lucide-react'

import { Link, useLocation } from 'react-router-dom'

import Button from '../../components/common/Button'

export default function GameResult() {
  const { state } = useLocation()

  /* =====================================================
     RESULT DATA
     ===================================================== */

  const game = state?.game || 'Memory Game'

  const score = Number(state?.score ?? 0)

  const correctAnswers = Number(
    state?.correctAnswers ?? 0
  )

  const totalQuestions = Number(
    state?.totalQuestions ?? 0
  )

  const gameType = state?.gameType || 'memory'

  const level = Number(state?.level ?? 1)

  const nextLevel = Number(
    state?.nextLevel ?? level
  )

  const levelUp = Boolean(
    state?.levelUp ?? nextLevel > level
  )

  const resultDate =
    state?.date ||
    new Date().toLocaleDateString()

  /* =====================================================
     GAME ICON
     ===================================================== */

  const getGameIcon = () => {
    switch (gameType) {
      case 'picture':
        return ImageIcon

      case 'number':
        return Hash

      case 'object':
        return Search

      case 'memory':
      default:
        return Brain
    }
  }

  const GameIcon = getGameIcon()

  /* =====================================================
     DIFFICULTY
     ===================================================== */

  const getDifficulty = () => {
    if (level === 1) return 'Beginner'
    if (level === 2) return 'Easy'
    if (level === 3) return 'Moderate'
    if (level === 4) return 'Challenging'

    return 'Advanced'
  }

  const difficulty = getDifficulty()

  /* =====================================================
     SCORE MESSAGE
     ===================================================== */

  const getMessage = () => {
    if (score >= 90) {
      return {
        title: 'Amazing memory! 🌟',
        text:
          'Excellent work! You remembered the information very well.',
      }
    }

    if (score >= 70) {
      return {
        title: 'Great job! 💚',
        text:
          'You did really well. Keep practicing to make the next level easier.',
      }
    }

    if (score >= 50) {
      return {
        title: 'Good effort! 🌱',
        text:
          'You are making progress. Take your time and keep practicing.',
      }
    }

    return {
      title: 'Well done! 💚',
      text:
        'You completed the activity. Every attempt is valuable.',
    }
  }

  const message = getMessage()

  /* =====================================================
     RESULT LABEL
     ===================================================== */

  const getResultLabel = () => {
    if (score >= 90) {
      return 'Excellent'
    }

    if (score >= 70) {
      return 'Very Good'
    }

    if (score >= 50) {
      return 'Good Effort'
    }

    return 'Keep Practicing'
  }

  const resultLabel = getResultLabel()

  /* =====================================================
     LEVEL MESSAGE
     ===================================================== */

  const getLevelMessage = () => {
    if (levelUp) {
      return {
        title: `Level ${nextLevel} unlocked! 🎉`,
        text:
          'Your performance has improved. The next activity will be a little more challenging.',
      }
    }

    if (score >= 70) {
      return {
        title: 'Keep building your progress 🌱',
        text:
          `Score ${70}% or more to work toward Level ${
            Math.min(level + 1, 5)
          }.`,
      }
    }

    return {
      title: `You are on Level ${level}`,
      text:
        'Keep practicing at your own pace. Your progress is saved automatically.',
    }
  }

  const levelMessage = getLevelMessage()

  /* =====================================================
     GAME DESCRIPTION
     ===================================================== */

  const getGameDescription = () => {
    switch (gameType) {
      case 'picture':
        return {
          title: 'Picture Memory',
          text:
            'You looked at pictures, remembered the details, and answered questions from memory.',
        }

      case 'number':
        return {
          title: 'Number Memory',
          text:
            'You observed number patterns and used your memory and thinking skills to find the correct answer.',
        }

      case 'object':
        return {
          title: 'Object Memory',
          text:
            'You identified and remembered everyday objects using visual memory.',
        }

      case 'memory':
      default:
        return {
          title: 'Memory Match',
          text:
            'You matched cards and used your visual memory to remember where objects were located.',
        }
    }
  }

  const gameDescription = getGameDescription()

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="mx-auto max-w-2xl px-4 pb-8">

      {/* =================================================
          MAIN CARD
          ================================================= */}

      <div className="card overflow-hidden">

        {/* =================================================
            SUCCESS HEADER
            ================================================= */}

        <div className="relative overflow-hidden bg-gradient-to-br from-[#17345f] via-[#245c75] to-[#2f8f92] px-6 py-10 text-center text-white sm:px-10 sm:py-12">

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

            <h1 className="mt-6 text-3xl font-black text-white sm:text-4xl">
              Well done! 🌟
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">
              You completed your activity.
              Take a moment to feel proud of yourself.
            </p>

          </div>

        </div>


        {/* =================================================
            RESULT CONTENT
            ================================================= */}

        <div className="p-6 sm:p-8">

          {/* =================================================
              GAME INFORMATION
              ================================================= */}

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f4f2] text-[#2f8f92]">
              <GameIcon size={28} />
            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
              Activity completed
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#17345f] dark:text-white">
              {game}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Completed on {resultDate}
            </p>

          </div>


          {/* =================================================
              LEVEL CARD
              ================================================= */}

          <div className="mt-6 rounded-3xl border border-[#dcebe8] bg-[#f8fcfb] p-5">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#2f8f92] shadow-sm">

                  <Star
                    size={24}
                    fill="currentColor"
                  />

                </div>

                <div className="text-left">

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Current Level
                  </p>

                  <p className="mt-1 text-xl font-black text-[#17345f] dark:text-white">
                    Level {level}
                  </p>

                </div>

              </div>


              <div className="rounded-full bg-[#e8f4f2] px-4 py-2 text-sm font-black text-[#2f8f92]">
                {difficulty}
              </div>

            </div>


            {/* Level progress */}

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between text-xs font-bold">

                <span className="text-slate-400">
                  Difficulty progress
                </span>

                <span className="text-[#2f8f92]">
                  {level} / 5
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-[#2f8f92] transition-all"
                  style={{
                    width: `${Math.min(
                      (level / 5) * 100,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* =================================================
              LEVEL UP MESSAGE
              ================================================= */}

          <div className="mt-5 rounded-3xl bg-gradient-to-r from-[#e8f4f2] to-[#f0ebfa] p-5">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2f8f92] shadow-sm">

                {levelUp ? (
                  <TrendingUp size={24} />
                ) : (
                  <Sparkles size={24} />
                )}

              </div>

              <div>

                <h3 className="text-lg font-black text-[#17345f] dark:text-white">
                  {levelMessage.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {levelMessage.text}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              SCORE CARD
              ================================================= */}

          <div className="my-7 rounded-[28px] bg-gradient-to-br from-[#e8f4f2] to-[#f0ebfa] p-7 text-center sm:p-8">

            <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">

              <Trophy
                size={18}
                className="text-[#2f8f92]"
              />

              Activity Score

            </div>


            {/* Score */}

            <p className="mt-3 text-6xl font-black tracking-tight text-[#17345f] sm:text-7xl">
              {score}%
            </p>


            {/* Score label */}

            <div className="mt-2 inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-black text-[#2f8f92] shadow-sm">
              {resultLabel}
            </div>


            {/* Correct answers */}

            {totalQuestions > 0 && (
              <p className="mt-4 text-sm font-semibold text-slate-500">

                You remembered{' '}

                <span className="font-black text-[#17345f]">
                  {correctAnswers}
                </span>

                {' '}out of{' '}

                <span className="font-black text-[#17345f]">
                  {totalQuestions}
                </span>

                {' '}correctly.

              </p>
            )}


            {/* Friendly message */}

            <p className="mt-4 text-base font-bold text-[#2f8f92]">
              {message.title}
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {message.text}
            </p>

          </div>


          {/* =================================================
              GAME-SPECIFIC SUMMARY
              ================================================= */}

          <div className="mb-5 rounded-3xl border border-[#dcebe8] bg-[#f8fcfb] p-5 sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2f8f92] shadow-sm">

                <GameIcon size={24} />

              </div>

              <div>

                <h3 className="text-lg font-black text-[#17345f] dark:text-white">
                  {gameDescription.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {gameDescription.text}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              LEVEL DIFFICULTY INFO
              ================================================= */}

          <div className="mb-5 rounded-3xl border border-[#dcebe8] bg-white p-5">

            <h3 className="text-base font-black text-[#17345f] dark:text-white">
              Your difficulty level
            </h3>

            <div className="mt-4 grid grid-cols-5 gap-2">

              {[1, 2, 3, 4, 5].map((item) => (

                <div
                  key={item}
                  className={`rounded-xl py-2 text-center text-xs font-black ${
                    item <= level
                      ? 'bg-[#2f8f92] text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  L{item}
                </div>

              ))}

            </div>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Each successful level makes the activity slightly more challenging,
              helping the user practice progressively.
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

                <h3 className="text-lg font-black text-[#17345f] dark:text-white">
                  Every activity counts 💚
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Keep taking part in activities at your own pace.
                  There is no need to rush. Regular practice can
                  make activities more comfortable over time.
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