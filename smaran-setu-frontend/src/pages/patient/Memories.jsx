import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTitle from '../../components/common/PageTitle'
import Button from '../../components/common/Button'

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

function loadSavedMemories() {
  try {
    const saved = localStorage.getItem('memories')

    if (!saved) {
      return []
    }

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
  } catch (error) {
    console.error('Error loading memories:', error)
    return []
  }
}

function saveMemoriesToStorage(list) {
  try {
    localStorage.setItem('memories', JSON.stringify(list))
  } catch (error) {
    console.error('Error saving memories:', error)
  }
}

export default function Memories() {
  const [memoryList, setMemoryList] = useState([])
  const [activeSection, setActiveSection] = useState('all')
  const [editingId, setEditingId] = useState(null)

  // Load ONLY caregiver-added memories
  useEffect(() => {
    const savedMemories = loadSavedMemories()
    setMemoryList(savedMemories)
  }, [])

  const filtered = useMemo(() => {
    if (activeSection === 'all') {
      return memoryList
    }

    return memoryList.filter(
      (memory) => memory.section === activeSection
    )
  }, [memoryList, activeSection])

  const counts = useMemo(() => {
    const result = {
      all: memoryList.length,
    }

    SECTIONS.forEach((section) => {
      result[section.id] = memoryList.filter(
        (memory) => memory.section === section.id
      ).length
    })

    return result
  }, [memoryList])

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this memory?'
    )

    if (!confirmed) {
      return
    }

    const next = memoryList.filter(
      (memory) => String(memory.id) !== String(id)
    )

    setMemoryList(next)
    saveMemoriesToStorage(next)

    if (editingId === id) {
      setEditingId(null)
    }
  }

  const startEdit = (memory) => {
    setEditingId(memory.id)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleEditSave = (event, memoryId) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const title = String(
      formData.get('title') || ''
    ).trim()

    const person = String(
      formData.get('person') || ''
    ).trim()

    const category = String(
      formData.get('category') || ''
    )

    const story = String(
      formData.get('story') || ''
    ).trim()

    const section = String(
      formData.get('section') || 'family'
    )

    if (!title || !person) {
      alert('Please fill in the required fields.')
      return
    }

    const sectionMeta =
      SECTIONS.find(
        (item) => item.id === section
      ) || SECTIONS[0]

    const next = memoryList.map((memory) => {
      if (
        String(memory.id) !== String(memoryId)
      ) {
        return memory
      }

      return {
        ...memory,
        title,
        subtitle: person,
        category,
        story,
        description: story,
        section,
        sectionLabel: sectionMeta.label,
        emoji: sectionMeta.emoji,
      }
    })

    setMemoryList(next)
    saveMemoriesToStorage(next)
    setEditingId(null)
  }

  const handleEditPhoto = (memoryId, file) => {
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
      if (typeof reader.result !== 'string') {
        return
      }

      const next = memoryList.map((memory) => {
        if (
          String(memory.id) !== String(memoryId)
        ) {
          return memory
        }

        return {
          ...memory,
          photo: reader.result,
        }
      })

      setMemoryList(next)
      saveMemoriesToStorage(next)
    }

    reader.onerror = () => {
      alert('Could not read the image.')
    }

    reader.readAsDataURL(file)
  }

  const removePhoto = (memoryId) => {
    const next = memoryList.map((memory) => {
      if (
        String(memory.id) !== String(memoryId)
      ) {
        return memory
      }

      return {
        ...memory,
        photo: '',
      }
    })

    setMemoryList(next)
    saveMemoriesToStorage(next)
  }

  return (
    <>
      <PageTitle
        title="Memory Library"
        subtitle="Add and edit familiar people, places, songs and stories for personalized activities."
        action={
          <Link to="/caregiver/memories/add">
            <Button>+ Add Memory</Button>
          </Link>
        }
      />

      {/* CATEGORY FILTERS */}
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

        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() =>
              setActiveSection(section.id)
            }
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
              activeSection === section.id
                ? 'bg-[#2f8f92] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{section.emoji}</span>

            {section.label} ({counts[section.id]})
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-5xl">📭</p>

          <h3 className="mt-4 text-xl font-black text-[#17345f]">
            No memories yet
          </h3>

          <p className="mt-2 text-slate-500">
            Add your first memory to get started.
          </p>

          <Link
            to="/caregiver/memories/add"
            className="mt-5 inline-block"
          >
            <Button>+ Add Memory</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((memory) => {
            const isEditing =
              String(editingId) === String(memory.id)

            return (
              <div
                key={memory.id}
                className="card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* IMAGE */}
                <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#dfece7] to-[#eee9f8]">
                  {memory.photo ? (
                    <img
                      src={memory.photo}
                      alt={memory.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">
                      {memory.emoji || '💭'}
                    </span>
                  )}

                  {(memory.sectionLabel ||
                    memory.section) && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#17345f] shadow">
                      {memory.sectionLabel ||
                        SECTIONS.find(
                          (item) =>
                            item.id === memory.section
                        )?.label ||
                        memory.section}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  {isEditing ? (
                    <form
                      className="space-y-3"
                      onSubmit={(event) =>
                        handleEditSave(
                          event,
                          memory.id
                        )
                      }
                    >
                      {/* SECTION */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Section
                        </label>

                        <select
                          name="section"
                          className="input"
                          defaultValue={
                            memory.section ||
                            'family'
                          }
                        >
                          {SECTIONS.map(
                            (section) => (
                              <option
                                key={section.id}
                                value={section.id}
                              >
                                {section.emoji}{' '}
                                {section.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* TITLE */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Title
                        </label>

                        <input
                          name="title"
                          className="input"
                          defaultValue={
                            memory.title || ''
                          }
                          required
                        />
                      </div>

                      {/* PERSON */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Person / place / object
                        </label>

                        <input
                          name="person"
                          className="input"
                          defaultValue={
                            memory.subtitle || ''
                          }
                          required
                        />
                      </div>

                      {/* CATEGORY */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Category
                        </label>

                        <select
                          name="category"
                          className="input"
                          defaultValue={
                            memory.category ||
                            'Family'
                          }
                        >
                          <option>Family</option>
                          <option>Friend</option>
                          <option>Place</option>
                          <option>Song</option>
                          <option>
                            Important date
                          </option>
                          <option>Personal</option>
                        </select>
                      </div>

                      {/* STORY */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Story
                        </label>

                        <textarea
                          name="story"
                          className="input min-h-20"
                          defaultValue={
                            memory.story ||
                            memory.description ||
                            ''
                          }
                        />
                      </div>

                      {/* PHOTO */}
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#17345f]">
                          Change photo
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          className="input"
                          onChange={(event) => {
                            const file =
                              event.target.files?.[0]

                            if (file) {
                              handleEditPhoto(
                                memory.id,
                                file
                              )
                            }
                          }}
                        />

                        {memory.photo && (
                          <button
                            type="button"
                            onClick={() =>
                              removePhoto(
                                memory.id
                              )
                            }
                            className="mt-2 text-sm font-bold text-red-600"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>

                      {/* SAVE / CANCEL */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          type="submit"
                          className="flex-1"
                        >
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
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-[#17345f]">
                          {memory.title}
                        </h3>

                        {memory.category && (
                          <span className="rounded-full bg-[#e8f2f0] px-2 py-1 text-[10px] font-bold text-[#2f8f92]">
                            {memory.category}
                          </span>
                        )}
                      </div>

                      {memory.subtitle && (
                        <p className="mt-1 text-sm font-medium text-slate-600">
                          {memory.subtitle}
                        </p>
                      )}

                      {(memory.story ||
                        memory.description) && (
                        <p className="mt-3 text-sm leading-5 text-slate-500">
                          {memory.story ||
                            memory.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(memory)
                          }
                          className="text-sm font-bold text-[#2f8f92] hover:underline"
                        >
                          Edit memory
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              memory.id
                            )
                          }
                          className="text-sm font-bold text-red-500 hover:underline"
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
    </>
  )
}