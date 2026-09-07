
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Heart,
  Brain,
  Image,
  Hash,
  Search,
  Eye,
} from 'lucide-react'

import { games } from '../../data/games'
import Button from '../../components/common/Button'
import MemoryMatch from '../../components/patient/MemoryMatch'

const gameQuestions = {
  memory: [
    {
      emoji: '🍎',
      instruction: 'Remember this item.',
      question: 'Which item did you see?',
      options: ['Apple', 'Book', 'Cup', 'Shoe'],
      answer: 'Apple',
    },
    {
      emoji: '🏠',
      instruction: 'Remember this item.',
      question: 'Which item did you see?',
      options: ['Dog', 'House', 'Car', 'Flower'],
      answer: 'House',
    },
    {
      emoji: '🌸',
      instruction: 'Remember this item.',
      question: 'Which item did you see?',
      options: ['Tree', 'Flower', 'Ball', 'Book'],
      answer: 'Flower',
    },
    {
      emoji: '🐶',
      instruction: 'Remember this item.',
      question: 'Which item did you see?',
      options: ['Cat', 'Bird', 'Dog', 'Fish'],
      answer: 'Dog',
    },
    {
      emoji: '📖',
      instruction: 'Remember this item.',
      question: 'Which item did you see?',
      options: ['Cup', 'Book', 'Shoe', 'Car'],
      answer: 'Book',
    },
  ],

  picture: [
    {
      emoji: '🏡🌳☀️',
      instruction: 'Look carefully at the picture.',
      question: 'What can you see in the picture?',
      options: ['A House', 'A Train', 'A Boat', 'A Hospital'],
      answer: 'A House',
    },
    {
      emoji: '🌳🐦🌸',
      instruction: 'Look carefully at the picture.',
      question: 'What animal is in the picture?',
      options: ['Dog', 'Cat', 'Bird', 'Cow'],
      answer: 'Bird',
    },
    {
      emoji: '🍎🍌🍊',
      instruction: 'Look carefully at the picture.',
      question: 'Which fruit can you see?',
      options: ['Apple', 'Mango', 'Watermelon', 'Grapes'],
      answer: 'Apple',
    },
    {
      emoji: '🚗🛣️🌳',
      instruction: 'Look carefully at the picture.',
      question: 'What vehicle can you see?',
      options: ['Bus', 'Car', 'Train', 'Boat'],
      answer: 'Car',
    },
    {
      emoji: '☕🍪📖',
      instruction: 'Look carefully at the picture.',
      question: 'What is beside the book?',
      options: ['A Cup', 'A Car', 'A Shoe', 'A Ball'],
      answer: 'A Cup',
    },
  ],

  number: [
    {
      emoji: '1 → 2 → 3 → ?',
      instruction: 'Find the next number.',
      question: 'Which number comes next?',
      options: ['4', '5', '6', '7'],
      answer: '4',
    },
    {
      emoji: '2 → 4 → 6 → ?',
      instruction: 'Find the next number.',
      question: 'Which number comes next?',
      options: ['7', '8', '9', '10'],
      answer: '8',
    },
    {
      emoji: '5 → 10 → 15 → ?',
      instruction: 'Find the next number.',
      question: 'Which number comes next?',
      options: ['18', '20', '22', '25'],
      answer: '20',
    },
    {
      emoji: '10 → 9 → 8 → ?',
      instruction: 'Find the next number.',
      question: 'Which number comes next?',
      options: ['5', '6', '7', '8'],
      answer: '7',
    },
    {
      emoji: '3 → 6 → 9 → ?',
      instruction: 'Find the next number.',
      question: 'Which number comes next?',
      options: ['10', '11', '12', '13'],
      answer: '12',
    },
  ],

  object: [
    {
      emoji: '☕ 📖 🚗 👟',
      instruction: 'Find the requested object.',
      question: 'Which object is a cup?',
      options: ['Cup', 'Book', 'Car', 'Shoe'],
      answer: 'Cup',
    },
    {
      emoji: '🍎 📖 🏠 🚗',
      instruction: 'Find the requested object.',
      question: 'Which object is a book?',
      options: ['Apple', 'Book', 'House', 'Car'],
      answer: 'Book',
    },
    {
      emoji: '🚗 🍎 👟 🌸',
      instruction: 'Find the requested object.',
      question: 'Which object is a car?',
      options: ['Flower', 'Apple', 'Car', 'Shoe'],
      answer: 'Car',
    },
    {
      emoji: '🐶 📖 ☕ 🚲',
      instruction: 'Find the requested object.',
      question: 'Which object is a bicycle?',
      options: ['Dog', 'Book', 'Cup', 'Bicycle'],
      answer: 'Bicycle',
    },
    {
      emoji: '🌸 👟 🍎 🏠',
      instruction: 'Find the requested object.',
      question: 'Which object is a shoe?',
      options: ['Flower', 'Shoe', 'Apple', 'House'],
      answer: 'Shoe',
    },
  ],
}

const iconMap = {
  memory: Brain,
  picture: Image,
  number: Hash,
  object: Search,
}

export default function GamePlay() {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const game = games.find((g) => g.id === gameId) || games[0]

  const questions =
    gameQuestions[game.type] || gameQuestions.memory

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  const question = questions[currentQuestion]
  const Icon = iconMap[game.type] || Brain

  /*
   * MEMORY MATCH
   *
   * MemoryMatch is now a completely separate playable game.
   * When it finishes, this function saves the result and
   * sends the patient to the result page.
   */
  const handleMemoryMatchComplete = (result) => {
    const previousResults = JSON.parse(
      localStorage.getItem('gameResults') || '[]'
    )

    localStorage.setItem(
      'gameResults',
      JSON.stringify([
        ...previousResults,
        result,
      ])
    )

    navigate('/user/result', {
      state: {
        game: result.game,
        gameId: result.gameId,
        gameType: result.gameType,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        moves: result.moves,
        timeSeconds: result.timeSeconds,
      },
    })
  }

  /*
   * MEMORY MATCH SCREEN
   *
   * We return early only for the actual Memory Match game.
   * Picture, Number and Object games continue using the
   * original question-based UI below.
   */
  if (game.type === 'memory') {
    return (
      <div className="mx-auto max-w-3xl pb-8">
        <button
          type="button"
          onClick={() => navigate('/user/games')}
          className="mb-5 flex items-center gap-2 rounded-xl px-2 py-2 font-bold text-slate-600 transition hover:bg-white hover:text-[#2f8f92] dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={19} />
          Back to games
        </button>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 p-6 dark:border-slate-700 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f4f2] text-[#2f8f92] dark:bg-slate-700">
                  <Brain size={28} />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
                    Cognitive Activity
                  </p>

                  <h1 className="mt-1 text-2xl font-black text-[#17345f] dark:text-white sm:text-3xl">
                    Memory Match
                  </h1>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200 sm:flex">
                <Clock3 size={16} />
                2 min
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <MemoryMatch
              onComplete={handleMemoryMatchComplete}
            />
          </div>
        </div>
      </div>
    )
  }

  const progress = Math.round(
    ((currentQuestion + 1) / questions.length) * 100
  )

  const handleAnswer = (option) => {
    if (showFeedback) return

    setSelectedAnswer(option)
    setShowFeedback(true)

    if (option === question.answer) {
      setScore((previousScore) => previousScore + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1)
      setSelectedAnswer('')
      setShowFeedback(false)
      return
    }

    /*
     * Activity finished.
     * Calculate final score and save result.
     */
    const finalScore =
      score + (selectedAnswer === question.answer ? 1 : 0)

    const percentage = Math.round(
      (finalScore / questions.length) * 100
    )

    const result = {
      gameId: game.id,
      game: game.title,
      gameType: game.type,
      correctAnswers: finalScore,
      totalQuestions: questions.length,
      score: percentage,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    }

    const previousResults = JSON.parse(
      localStorage.getItem('gameResults') || '[]'
    )

    localStorage.setItem(
      'gameResults',
      JSON.stringify([
        ...previousResults,
        result,
      ])
    )

    navigate('/user/result', {
      state: {
        game: game.title,
        gameId: game.id,
        gameType: game.type,
        score: percentage,
        correctAnswers: finalScore,
        totalQuestions: questions.length,
      },
    })
  }

  return (
    <div className="mx-auto max-w-3xl pb-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/user/games')}
        className="mb-5 flex items-center gap-2 rounded-xl px-2 py-2 font-bold text-slate-600 transition hover:bg-white hover:text-[#2f8f92] dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <ArrowLeft size={19} />
        Back to games
      </button>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-100 p-6 dark:border-slate-700 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e8f4f2] text-[#2f8f92] dark:bg-slate-700">
                <Icon size={28} />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
                  Cognitive Activity
                </p>

                <h1 className="mt-1 text-2xl font-black text-[#17345f] dark:text-white sm:text-3xl">
                  {game.title}
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200 sm:flex">
              <Clock3 size={16} />
              {game.duration}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-300 sm:hidden">
            <Clock3 size={16} />
            {game.duration}
          </div>

          {/* Progress */}
          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-300">
                Question {currentQuestion + 1} of {questions.length}
              </span>

              <span className="text-sm font-bold text-[#2f8f92]">
                {progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-[#2f8f92] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Game content */}
        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#2f8f92]">
            <Heart size={17} fill="currentColor" />
            Take your time. There is no rush.
          </div>

          {/* Question */}
          <div className="rounded-[28px] bg-linear-to- from-[#e8f4f2] via-[#f3f8f7] to-[#f0ebfa] p-7 text-center sm:p-10">
            <div className="flex justify-center">
              <div className="flex min-h-28 min-w-28 items-center justify-center rounded-full bg-white px-5 text-4xl shadow-sm sm:min-h-32 sm:min-w-32 sm:text-5xl">
                {question.emoji}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#2f8f92]">
              <Eye size={17} />
              {question.instruction}
            </div>

            <h2 className="mt-4 text-2xl font-black leading-tight text-[#17345f] dark:text-white sm:text-3xl">
              {question.question}
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-300 sm:text-base">
              Choose the answer that feels right to you.
            </p>
          </div>

          {/* Options */}
          <div className="mt-7">
            <p className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-300">
              Choose an answer
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((option, index) => {
                const selected = selectedAnswer === option

                const correct =
                  showFeedback &&
                  option === question.answer

                const wrong =
                  showFeedback &&
                  selected &&
                  option !== question.answer

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                    className={`
                      flex
                      min-h-18.5
                      items-center
                      gap-4
                      rounded-2xl
                      border-2
                      px-5
                      py-4
                      text-left
                      transition-all
                      duration-200
                      ${
                        correct
                          ? 'border-[#2f8f92] bg-[#e8f4f2]'
                          : wrong
                            ? 'border-red-300 bg-red-50'
                            : selected
                              ? 'border-[#2f8f92] bg-[#e8f4f2] shadow-md'
                              : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#9fcfca] hover:bg-[#f8fcfb] dark:border-slate-600 dark:bg-slate-800'
                      }
                    `}
                  >
                    <span
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-sm
                        font-black
                        ${
                          correct
                            ? 'bg-[#2f8f92] text-white'
                            : wrong
                              ? 'bg-red-400 text-white'
                              : selected
                                ? 'bg-[#2f8f92] text-white'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                        }
                      `}
                    >
                      {index + 1}
                    </span>

                    <span
                      className={`
                        text-lg
                        font-bold
                        ${
                          correct
                            ? 'text-[#17345f] dark:text-white'
                            : wrong
                              ? 'text-red-700'
                              : 'text-slate-700 dark:text-slate-200'
                        }
                      `}
                    >
                      {option}
                    </span>

                    {correct && (
                      <CheckCircle2
                        className="ml-auto shrink-0 text-[#2f8f92]"
                        size={24}
                      />
                    )}

                    {wrong && (
                      <span className="ml-auto text-xl">
                        ❌
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Feedback */}
          <div className="mt-5 min-h-13">
            {showFeedback &&
              selectedAnswer === question.answer && (
                <div className="rounded-2xl bg-[#e8f4f2] p-4 text-center">
                  <p className="font-black text-[#2f8f92]">
                    Wonderful! 🌟 That is correct.
                  </p>
                </div>
              )}

            {showFeedback &&
              selectedAnswer !== question.answer && (
                <div className="rounded-2xl bg-[#fff5f5] p-4 text-center">
                  <p className="font-black text-slate-700">
                    Good try! 💚 The correct answer is{' '}
                    <span className="text-[#2f8f92]">
                      {question.answer}
                    </span>
                    .
                  </p>
                </div>
              )}
          </div>

          {/* Next button */}
          <Button
            disabled={!showFeedback}
            onClick={nextQuestion}
            className="mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currentQuestion === questions.length - 1
              ? 'Finish Activity ✓'
              : 'Next Question →'}
          </Button>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-semibold text-slate-400">
            <span>💚</span>
            Enjoy the activity at your own pace.
          </div>
        </div>
      </div>
    </div>
  )
}

