import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/common/Button'

const SECTIONS = [
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'friends', label: 'Friends', emoji: '🧑‍🤝‍🧑' },
  { id: 'places', label: 'Places', emoji: '🏠' },
  { id: 'personal', label: 'Personal', emoji: '💭' },
]

function loadMemories() {
  try {
    const saved = localStorage.getItem('memories')
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveMemories(list) {
  localStorage.setItem('memories', JSON.stringify(list))
}

export default function Memories() {
  const [memories, setMemories] = useState(() => loadMemories())
  const [activeSection, setActiveSection] = useState('all')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    setMemories(loadMemories())
  }, [])

  const filtered = useMemo(() => {
    if (activeSection === 'all') return memories
    return memories.filter((m) => m.section === activeSection)
  }, [memories, activeSection])

  const counts = useMemo(() => {
    const map = { all: memories.length }
    SECTIONS.forEach((s) => {
      map[s.id] = memories.filter((m) => m.section === s.id).length
    })
    return map
  }, [memories])

  const handleDelete = (id) => {
    if (!window.confirm('Delete this memory?')) return
    const next = memories.filter((m) => m.id !== id)
    setMemories(next)
    saveMemories(next)
    if (editingId === id) setEditingId(null)
  }

  const startEdit = (memory) => {
    setEditingId(memory.id)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleEditSave = (e, memoryId) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const title = formData.get('title')
    const person = formData.get('person')
    const category = formData.get('category')
    const story = formData.get('story')
    const section = formData.get('section')

    const sectionMeta = SECTIONS.find((s) => s.id === section)

    const next = memories.map((m) => {
      if (m.id !== memoryId) return m
      return {
        ...m,
        title,
        subtitle: person,
        category,
        story,
        section,
        sectionLabel: sectionMeta?.label || section,
        emoji: sectionMeta?.emoji || m.emoji,
      }
    })

    setMemories(next)
    saveMemories(next)
    setEditingId(null)
  }

  const handleEditPhoto = (memoryId, file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 2.5 * 1024 * 1024) {
      alert('Image is too large. Please choose a photo under 2.5 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') return

      const next = memories.map((m) =>
        m.id === memoryId ? { ...m, photo: result } : m
      )
      setMemories(next)
      saveMemories(next)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = (memoryId) => {
    const next = memories.map((m) =>
      m.id === memoryId ? { ...m, photo: '' } : m
    )
    setMemories(next)
    saveMemories(next)
  }

  return (
    <div>
      <PageTitle
        title="Memory Library"
        subtitle="Add and edit familiar people, places, songs and stories for personalized activities."
        action={
          <Link to="/caregiver/memories/add">
            <Button>+ Add Memory</Button>
          </Link>
        }
      />

      {/* Section filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSection('all')}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            activeSection === 'all'
              ? 'bg-[#2f8f92] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({counts.all})
        </button>

        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
              activeSection === s.id
                ? 'bg-[#2f8f92] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{s.emoji}</span>
            {s.label} ({counts[s.id]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-5xl">📭</p>
          <h3 className="mt-4 text-xl font-black text-[#17345f]">
            No memories yet
          </h3>
          <p className="mt-2 text-slate-500">
            {activeSection === 'all'
              ? 'Add your first memory to get started.'
              : `No memories in the ${SECTIONS.find((s) => s.id === activeSection)?.label || ''} section yet.`}
          </p>
          <Link to="/caregiver/memories/add" className="mt-5 inline-block">
            <Button>+ Add Memory</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => {
            const isEditing = editingId === m.id

            return (
              <div key={m.id} className="card overflow-hidden">
                <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#dfece7] to-[#eee9f8]">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">{m.emoji || '💭'}</span>
                  )}

                  {m.sectionLabel && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#17345f] shadow">
                      {m.sectionLabel}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  {isEditing ? (
                    <form
                      className="space-y-3"
                      onSubmit={(e) => handleEditSave(e, m.id)}
                    >
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Section
                        </label>
                        <select
                          name="section"
                          className="input"
                          defaultValue={m.section || 'family'}
                        >
                          {SECTIONS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.emoji} {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Title
                        </label>
                        <input
                          name="title"
                          className="input"
                          defaultValue={m.title}
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Person / place / object
                        </label>
                        <input
                          name="person"
                          className="input"
                          defaultValue={m.subtitle}
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Category
                        </label>
                        <select
                          name="category"
                          className="input"
                          defaultValue={m.category || 'Family'}
                        >
                          <option>Family</option>
                          <option>Friend</option>
                          <option>Place</option>
                          <option>Song</option>
                          <option>Important date</option>
                          <option>Personal</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Story
                        </label>
                        <textarea
                          name="story"
                          className="input min-h-20"
                          defaultValue={m.story || ''}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Change photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="input"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleEditPhoto(m.id, file)
                          }}
                        />
                        {m.photo && (
                          <button
                            type="button"
                            onClick={() => removePhoto(m.id)}
                            className="mt-2 text-sm font-bold text-red-600"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button type="submit" className="flex-1">
                          Save
                        </Button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="font-bold text-[#17345f]">{m.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{m.subtitle}</p>
                      {m.story && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {m.story}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(m)}
                          className="text-sm font-bold text-[#2f8f92]"
                        >
                          Edit memory
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id)}
                          className="text-sm font-bold text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
