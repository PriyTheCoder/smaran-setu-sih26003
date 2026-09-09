import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const SECTIONS = [
  {
    id: 'family',
    label: 'Family',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    id: 'friends',
    label: 'Friends',
    emoji: '🧑‍🤝‍🧑',
  },
  {
    id: 'places',
    label: 'Places',
    emoji: '🏠',
  },
  {
    id: 'personal',
    label: 'Personal',
    emoji: '💭',
  },
]

function loadMemories() {
  try {
    const saved = localStorage.getItem('memories')

    if (!saved) {
      return []
    }

    const parsed = JSON.parse(saved)

    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Error loading memories:', error)
    return []
  }
}

export default function AddMemory() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [person, setPerson] = useState('')
  const [category, setCategory] = useState('Family')
  const [section, setSection] = useState('family')
  const [story, setStory] = useState('')
  const [photo, setPhoto] = useState('')
  const [saving, setSaving] = useState(false)

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    if (file.size > 2.5 * 1024 * 1024) {
      alert(
        'Image is too large. Please choose an image under 2.5 MB.'
      )
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result)
      }
    }

    reader.onerror = () => {
      alert('Could not read the image.')
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim()) {
      alert('Please enter a memory title.')
      return
    }

    if (!person.trim()) {
      alert('Please enter a person, place or object.')
      return
    }

    if (!story.trim()) {
      alert('Please enter the memory story.')
      return
    }

    setSaving(true)

    const sectionMeta =
      SECTIONS.find(
        (item) => item.id === section
      ) || SECTIONS[0]

    const newMemory = {
      id: `memory-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      title: title.trim(),

      subtitle: person.trim(),

      category,

      section,

      sectionLabel: sectionMeta.label,

      emoji: sectionMeta.emoji,

      story: story.trim(),

      description: story.trim(),

      photo,

      createdAt: new Date().toISOString(),
    }

    const existingMemories = loadMemories()

    const updatedMemories = [
      ...existingMemories,
      newMemory,
    ]

    try {
      localStorage.setItem(
        'memories',
        JSON.stringify(updatedMemories)
      )

      alert('Memory added successfully!')

      navigate('/user/memories')
    } catch (error) {
      console.error(
        'Error saving memory:',
        error
      )

      alert(
        'Could not save the memory. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">
      {/* BACK */}
      <Link
        to="/user/memories"
        className="mb-5 inline-flex items-center gap-2 rounded-xl px-2 py-2 font-bold text-slate-600 transition hover:bg-white hover:text-[#2f8f92]"
      >
        <ArrowLeft size={19} />
        Back to memories
      </Link>

      <div className="card overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#dfece7] via-[#f3f7f5] to-[#eee9f8] p-8 text-center">
          <div className="text-6xl">
            💭
          </div>

          <h1 className="mt-3 text-3xl font-black text-[#17345f]">
            Add a New Memory
          </h1>

          <p className="mt-2 text-slate-500">
            Save a special person, place or moment.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 sm:p-9"
        >
          {/* SECTION */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Memory section
            </label>

            <select
              value={section}
              onChange={(event) =>
                setSection(event.target.value)
              }
              className="input"
            >
              {SECTIONS.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.emoji} {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Memory title *
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Example: My wedding day"
              className="input"
              required
            />
          </div>

          {/* PERSON */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Person / place / object *
            </label>

            <input
              type="text"
              value={person}
              onChange={(event) =>
                setPerson(event.target.value)
              }
              placeholder="Example: My wife, Delhi, My old house"
              className="input"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="input"
            >
              <option>Family</option>
              <option>Friend</option>
              <option>Place</option>
              <option>Song</option>
              <option>Important date</option>
              <option>Personal</option>
            </select>
          </div>

          {/* STORY */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Tell the story *
            </label>

            <textarea
              value={story}
              onChange={(event) =>
                setStory(event.target.value)
              }
              placeholder="Write something you want to remember..."
              className="input min-h-36 resize-y"
              required
            />
          </div>

          {/* PHOTO */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Add a photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="input"
            />

            <p className="mt-1 text-xs text-slate-400">
              Maximum image size: 2.5 MB
            </p>

            {photo && (
              <div className="mt-4 overflow-hidden rounded-2xl">
                <img
                  src={photo}
                  alt="Memory preview"
                  className="max-h-64 w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2f8f92] px-5 py-4 font-bold text-white transition hover:bg-[#287c7f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={20} />

              {saving
                ? 'Saving...'
                : 'Save Memory'}
            </button>

            <Link
              to="/user/memories"
              className="flex-1 rounded-2xl bg-slate-100 px-5 py-4 text-center font-bold text-slate-600 transition hover:bg-slate-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}