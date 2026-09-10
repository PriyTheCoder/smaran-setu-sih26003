import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/common/Button'

const SECTIONS = [
  {
    id: 'family',
    label: 'Family',
    description: 'Parents, children, siblings, relatives',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    id: 'friends',
    label: 'Friends',
    description: 'Close friends, neighbours, companions',
    emoji: '🧑‍🤝‍🧑',
  },
  {
    id: 'places',
    label: 'Places',
    description: 'Home, school, workplace, favourite spots',
    emoji: '🏠',
  },
  {
    id: 'personal',
    label: 'Personal',
    description: 'Songs, hobbies, important dates, objects',
    emoji: '💭',
  },
]

export default function AddMemory() {
  const [saved, setSaved] = useState(false)
  const [section, setSection] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoData, setPhotoData] = useState('')
  const [photoError, setPhotoError] = useState('')
  const navigate = useNavigate()

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    setPhotoError('')

    if (!file) {
      setPhotoPreview('')
      setPhotoData('')
      return
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file (JPG, PNG, etc.).')
      setPhotoPreview('')
      setPhotoData('')
      e.target.value = ''
      return
    }

    const maxSize = 2.5 * 1024 * 1024
    if (file.size > maxSize) {
      setPhotoError('Image is too large. Please choose a photo under 2.5 MB.')
      setPhotoPreview('')
      setPhotoData('')
      e.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        setPhotoPreview(result)
        setPhotoData(result)
      }
    }

    reader.onerror = () => {
      setPhotoError('Could not read the image. Please try another file.')
      setPhotoPreview('')
      setPhotoData('')
    }

    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    setPhotoPreview('')
    setPhotoData('')
    setPhotoError('')
    const input = document.getElementById('memory-photo-input')
    if (input) input.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!section) {
      return
    }

    const formData = new FormData(e.currentTarget)

    const title = formData.get('title')
    const person = formData.get('person')
    const category = formData.get('category')
    const story = formData.get('story')

    const selectedSection = SECTIONS.find((s) => s.id === section)

    const newMemory = {
      id: `memory-${Date.now()}`,
      title,
      subtitle: person,
      category,
      section: section,
      sectionLabel: selectedSection?.label || section,
      story,
      emoji: selectedSection?.emoji || getCategoryEmoji(category),
      photo: photoData || '',
      createdAt: Date.now(),
    }

    const existingMemories = JSON.parse(
      localStorage.getItem('memories') || '[]'
    )

    const updatedMemories = [...existingMemories, newMemory]

    localStorage.setItem('memories', JSON.stringify(updatedMemories))

    setSaved(true)

    setTimeout(() => {
      navigate('/caregiver/memories')
    }, 700)
  }

  return (
    <div>
      <PageTitle
        title="Add a Memory"
        subtitle="Choose a section, then add photos of family, friends, places, or personal moments."
      />

      <div className="card max-w-2xl p-7">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Section selection */}
          <div>
            <label className="mb-3 block text-sm font-bold text-[#17345f]">
              Which section do you want to add this memory to?
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              {SECTIONS.map((item) => {
                const isSelected = section === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                      isSelected
                        ? 'border-[#2f8f92] bg-[#e8f4f2] shadow-md'
                        : 'border-slate-200 bg-white hover:border-[#2f8f92]'
                    }`}
                  >
                    <span className="text-3xl leading-none">{item.emoji}</span>
                    <div>
                      <p className="font-black text-[#17345f]">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {!section && (
              <p className="mt-2 text-xs text-slate-400">
                Please select one of the four sections above to continue.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Memory title
            </label>
            <input
              name="title"
              className="input"
              placeholder="e.g. Family picnic"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Person / place / object
            </label>
            <input
              name="person"
              className="input"
              placeholder="e.g. Rajesh, Childhood home, Favourite song"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Relationship or category
            </label>
            <select name="category" className="input" defaultValue="Family">
              <option>Family</option>
              <option>Friend</option>
              <option>Place</option>
              <option>Scenery</option>
              <option>Memorable Moment</option>
              <option>Important Thing</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Memory story
            </label>
            <textarea
              name="story"
              className="input min-h-32"
              placeholder="Write a short, warm description..."
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#17345f]">
              Photo (family, friends, places, etc.)
            </label>

            <input
              id="memory-photo-input"
              name="photo"
              className="input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

            <p className="mt-2 text-xs text-slate-400">
              Upload a clear photo of a family member, friend, place, or object.
              JPG or PNG recommended. Max 2.5 MB.
            </p>

            {photoError && (
              <p className="mt-2 text-sm font-medium text-red-600">{photoError}</p>
            )}

            {photoPreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-bold text-[#17345f]">Preview</p>
                <div className="relative overflow-hidden rounded-2xl border-2 border-[#e8f4f2] bg-slate-50">
                  <img
                    src={photoPreview}
                    alt="Memory preview"
                    className="mx-auto max-h-72 w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-red-600 shadow hover:bg-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={saved || !section}>
            {saved ? 'Saved ✓' : 'Save Memory'}
          </Button>
        </form>
      </div>
    </div>
  )
}

function getCategoryEmoji(category) {
  if (category === 'Family') return '👨‍👩‍👧‍👦'
  if (category === 'Friend') return '🧑‍🤝‍🧑'
  if (category === 'Place') return '🏠'
  if (category === 'Song') return '🎵'
  if (category === 'Important date') return '📅'
  return '💭'
}