import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Clock3,
  RotateCcw,
  Trophy,
} from 'lucide-react'

const ALL_CARDS = [
  { id: 1, value: '🍎', name: 'Apple' },
  { id: 2, value: '🏠', name: 'House' },
  { id: 3, value: '🌸', name: 'Flower' },
  { id: 4, value: '🐶', name: 'Dog' },
]

function shuffleCards(cards) {
  return [...cards]
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({
      ...card,
      uniqueId: `${card.id}-${index}`,
    }))
}

export default function MemoryMatch({ onComplete }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [locked, setLocked] = useState(false)
  const [started, setStarted] = useState(false)

  const totalPairs = ALL_CARDS.length
  const completed = matched.length === totalPairs

  const score = useMemo(() => {
    if (!completed) return 0

    const baseScore = 100
    const movePenalty = Math.max(0, moves - totalPairs) * 5
    const timePenalty = Math.floor(seconds / 10) * 2

    return Math.max(
      20,
      Math.min(100, baseScore - movePenalty - timePenalty)
    )
  }, [completed, moves, seconds])

  const startGame = () => {
    const deck = shuffleCards(
      ALL_CARDS.flatMap((card) => [
        card,
        { ...card },
      ])
    )

    setCards(deck)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setLocked(false)
    setStarted(true)
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (!started || completed) return

    const timer = setInterval(() => {
      setSeconds((previous) => previous + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [started, completed])

  useEffect(() => {
    if (flipped.length !== 2) return

    setLocked(true)
    setMoves((previous) => previous + 1)

    const first = cards.find(
      (card) => card.uniqueId === flipped[0]
    )

    const second = cards.find(
      (card) => card.uniqueId === flipped[1]
    )

    if (!first || !second) return

    if (first.id === second.id) {
      setTimeout(() => {
        setMatched((previous) => [
          ...previous,
          first.id,
        ])

        setFlipped([])
        setLocked(false)
      }, 500)
    } else {
      setTimeout(() => {
        setFlipped([])
        setLocked(false)
      }, 900)
    }
  }, [flipped, cards])

  useEffect(() => {
    if (!completed) return

    const finalResult = {
      gameId: 'memory-match',
      game: 'Memory Match',
      gameType: 'memory',
      correctAnswers: totalPairs,
      totalQuestions: totalPairs,
      score,
      moves,
      timeSeconds: seconds,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    }

    if (typeof onComplete === 'function') {
      onComplete(finalResult)
    }
  }, [
    completed,
    score,
    moves,
    seconds,
    totalPairs,
    onComplete,
  ])

  const handleCardClick = (card) => {
    if (locked) return

    if (flipped.includes(card.uniqueId)) return

    if (matched.includes(card.id)) return

    if (flipped.length >= 2) return

    setFlipped((previous) => [
      ...previous,
      card.uniqueId,
    ])
  }

  const isVisible = (card) => {
    return (
      flipped.includes(card.uniqueId) ||
      matched.includes(card.id)
    )
  }

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">

      {/* Instructions */}
      <div className="rounded-3xl bg-[#e8f4f2] p-5 text-center dark:bg-slate-800">
        <p className="text-lg font-black text-[#17345f] dark:text-white">
          🧠 Remember the matching pairs
        </p>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Tap two cards to find matching pictures.
          Take your time — there is no rush.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">

        <div className="rounded-2xl bg-white p-4 text-center shadow-sm dark:bg-slate-800">
          <p className="text-xs font-bold uppercase text-slate-400">
            Moves
          </p>

          <p className="mt-1 text-2xl font-black text-[#17345f] dark:text-white">
            {moves}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 text-center shadow-sm dark:bg-slate-800">
          <p className="text-xs font-bold uppercase text-slate-400">
            Pairs
          </p>

          <p className="mt-1 text-2xl font-black text-[#2f8f92]">
            {matched.length}/{totalPairs}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 text-center shadow-sm dark:bg-slate-800">
          <p className="flex items-center justify-center gap-1 text-xs font-bold uppercase text-slate-400">
            <Clock3 size={13} />
            Time
          </p>

          <p className="mt-1 text-2xl font-black text-[#17345f] dark:text-white">
            {formatTime()}
          </p>
        </div>

      </div>

      {/* Game board */}
      {!completed && (
        <div className="mx-auto grid max-w-xl grid-cols-4 gap-3 sm:gap-4">

          {cards.map((card) => {
            const visible = isVisible(card)
            const isMatched = matched.includes(card.id)

            return (
              <button
                key={card.uniqueId}
                type="button"
                disabled={
                  locked ||
                  isMatched ||
                  flipped.includes(card.uniqueId)
                }
                onClick={() => handleCardClick(card)}
                aria-label={
                  visible
                    ? `${card.name} card`
                    : 'Hidden memory card'
                }
                className={`
                  aspect-square rounded-2xl border-2
                  p-2 shadow-sm transition-all
                  duration-200
                  sm:rounded-3xl sm:p-3

                  ${
                    visible
                      ? isMatched
                        ? 'border-[#2f8f92] bg-[#e8f4f2] dark:bg-slate-700'
                        : 'border-[#9fcfca] bg-white dark:bg-slate-700'
                      : 'border-[#17345f] bg-[#17345f] hover:-translate-y-1 hover:shadow-lg'
                  }
                `}
              >
                {visible ? (
                  <div className="flex h-full flex-col items-center justify-center">

                    <span className="text-4xl sm:text-5xl">
                      {card.value}
                    </span>

                    {isMatched && (
                      <CheckCircle2
                        className="mt-1 text-[#2f8f92]"
                        size={20}
                      />
                    )}

                  </div>
                ) : (
                  <span className="text-3xl font-black text-white/80 sm:text-4xl">
                    ?
                  </span>
                )}
              </button>
            )
          })}

        </div>
      )}

      {/* Completion */}
      {completed && (
        <div className="rounded-[30px] border border-[#b9ddd8] bg-linear-to- from-[#e8f4f2] to-[#f5fbfa] p-7 text-center dark:border-slate-600 dark:from-slate-800 dark:to-slate-800 sm:p-10">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2f8f92] text-white shadow-lg">
            <Trophy size={38} />
          </div>

          <h2 className="mt-5 text-3xl font-black text-[#17345f] dark:text-white">
            Wonderful! 🎉
          </h2>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            You found all the matching pairs.
          </p>

          <div className="mx-auto mt-7 grid max-w-md grid-cols-3 gap-3">

            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-700">
              <p className="text-xs font-bold text-slate-400">
                PAIRS
              </p>

              <p className="mt-1 text-2xl font-black text-[#2f8f92]">
                {matched.length}/{totalPairs}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-700">
              <p className="text-xs font-bold text-slate-400">
                MOVES
              </p>

              <p className="mt-1 text-2xl font-black text-[#17345f] dark:text-white">
                {moves}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-700">
              <p className="text-xs font-bold text-slate-400">
                SCORE
              </p>

              <p className="mt-1 text-2xl font-black text-[#7656bd]">
                {score}%
              </p>
            </div>

          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#17345f] px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <RotateCcw size={18} />
              Play Again
            </button>

          </div>

          <p className="mt-5 text-sm font-semibold text-[#2f8f92]">
            💚 Great effort! Every activity is a step forward.
          </p>

        </div>
      )}

    </div>
  )
}