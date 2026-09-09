  
import {
  ArrowLeft,
  Heart,
  MapPin,
  CalendarDays,
  Sparkles,
  Volume2,
  Users,
} from 'lucide-react'

import { Link, useParams } from 'react-router-dom'

import { useEffect, useState } from 'react'

export default function MemoryDetail() {
  const { memoryId } = useParams()

  const [memory, setMemory] = useState(null)

  /* =====================================================
     LOAD ONLY USER-ADDED MEMORIES
  ===================================================== */
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('memories')

      if (!saved) {
        setMemory(null)
        return
      }

      const parsed = JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        setMemory(null)
        return
      }

      const foundMemory = parsed.find(
        (item) =>
          String(item.id) === String(memoryId)
      )

      setMemory(foundMemory || null)
    } catch (error) {
      console.error(
        'Error loading memory:',
        error
      )

      setMemory(null)
    }
  }, [memoryId])

  /* =====================================================
     NO MEMORY FOUND
  ===================================================== */
  if (!memory) {
    return (
      <div className="mx-auto max-w-3xl pb-8">
        <Link
          to="/user/memories"
          className="mb-5 inline-flex items-center gap-2 rounded-xl px-2 py-2 font-bold text-slate-600 transition hover:bg-white hover:text-[#2f8f92]"
        >
          <ArrowLeft size={19} />
          Back to memories
        </Link>

        <div className="card p-10 text-center">
          <div className="text-6xl">📭</div>

          <h1 className="mt-5 text-2xl font-black text-[#17345f]">
            Memory not found
          </h1>

          <p className="mt-2 text-slate-500">
            This memory has not been added yet.
          </p>

          <Link
            to="/user/memories"
            className="mt-6 inline-block"
          >
            <button
              type="button"
              className="rounded-xl bg-[#2f8f92] px-5 py-3 font-bold text-white transition hover:bg-[#277a7d]"
            >
              Back to memories
            </button>
          </Link>
        </div>
      </div>
    )
  }

  /* =====================================================
     STORY
  ===================================================== */
  const story =
    memory.story ||
    memory.description ||
    'This is a special memory worth remembering.'

  /* =====================================================
     TEXT TO SPEECH
  ===================================================== */
  const handleListen = () => {
    if (!('speechSynthesis' in window)) {
      alert(
        'Text-to-speech is not supported in this browser.'
      )
      return
    }

    window.speechSynthesis.cancel()

    const text = `${memory.title}. ${story}`

    const speech =
      new SpeechSynthesisUtterance(text)

    speech.rate = 0.85
    speech.pitch = 1

    window.speechSynthesis.speak(speech)
  }

  return (
    <div className="mx-auto max-w-3xl pb-8">

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}
      <Link
        to="/user/memories"
        className="mb-5 inline-flex items-center gap-2 rounded-xl px-2 py-2 font-bold text-slate-600 transition hover:bg-white hover:text-[#2f8f92]"
      >
        <ArrowLeft size={19} />
        Back to memories
      </Link>

      <div className="card overflow-hidden">

        {/* =====================================================
            MEMORY HEADER
        ===================================================== */}
        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-r from-[#dfece7] via-[#f3f7f5] to-[#eee9f8]">

          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/40" />

          <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/30" />

          {/* PHOTO */}
          {memory.photo ? (
            <img
              src={memory.photo}
              alt={memory.title}
              className="relative h-56 w-56 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white text-7xl shadow-lg">
              {memory.emoji || '❤️'}
            </div>
          )}
        </div>

        {/* =====================================================
            MEMORY INFORMATION
        ===================================================== */}
        <div className="p-6 sm:p-9">

          <div className="flex items-start gap-4">

            <div className="min-w-0 flex-1">

              <p className="text-sm font-bold uppercase tracking-wide text-[#2f8f92]">
                A special memory
              </p>

              <h1 className="mt-2 text-3xl font-black text-[#17345f] sm:text-4xl">
                {memory.title}
              </h1>

              {memory.subtitle && (
                <p className="mt-2 text-base text-slate-500">
                  {memory.subtitle}
                </p>
              )}

            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-[#d36a75]">
              <Heart
                size={25}
                fill="currentColor"
              />
            </div>

          </div>

          {/* =====================================================
              MEMORY DETAILS
          ===================================================== */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">

            {/* PEOPLE */}
            <div className="flex items-center gap-3 rounded-2xl bg-[#f8faf9] p-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f2] text-[#2f8f92]">
                <Users size={20} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Category
                </p>

                <p className="font-bold text-[#17345f]">
                  {memory.category ||
                    memory.sectionLabel ||
                    'Personal'}
                </p>
              </div>

            </div>

            {/* PLACE / SECTION */}
            <div className="flex items-center gap-3 rounded-2xl bg-[#f8faf9] p-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff4df] text-[#d28a2d]">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Section
                </p>

                <p className="font-bold text-[#17345f]">
                  {memory.sectionLabel ||
                    memory.section ||
                    'Personal'}
                </p>
              </div>

            </div>

          </div>

          {/* =====================================================
              STORY
          ===================================================== */}
          <div className="mt-8">

            <div className="flex items-center gap-2">

              <Sparkles
                size={19}
                className="text-[#2f8f92]"
              />

              <h2 className="text-xl font-black text-[#17345f]">
                The Story
              </h2>

            </div>

            <div className="mt-4 rounded-3xl bg-[#f8fcfb] p-6">

              <p className="text-base leading-8 text-slate-600">
                {story}
              </p>

            </div>

          </div>

          {/* =====================================================
              VOICE BUTTON
          ===================================================== */}
          <button
            type="button"
            onClick={handleListen}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#cfe5e1] bg-[#e8f4f2] px-5 py-4 font-bold text-[#17345f] transition hover:-translate-y-0.5 hover:bg-[#dff0ed]"
          >
            <Volume2
              size={22}
              className="text-[#2f8f92]"
            />

            Listen to this memory
          </button>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <div className="mt-7 flex items-center justify-center gap-2 text-center text-sm font-semibold text-slate-400">

            <CalendarDays size={16} />

            A memory worth remembering ❤️

          </div>

        </div>
      </div>
    </div>
  )
}
