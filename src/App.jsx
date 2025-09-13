import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import SortableItem from './components/SortableItem.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { FiEdit2 } from 'react-icons/fi'

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('todos')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items))
  }, [items])

  function addItem(e) {
    e?.preventDefault()
    const value = text.trim()
    if (!value) return
    setItems((prev) => [
      { id: crypto.randomUUID(), title: value, done: false },
      ...prev,
    ])
    setText('')
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditText(item.title)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  function saveEdit() {
    const value = editText.trim()
    if (!editingId) return
    if (!value) {
      cancelEdit()
      return
    }
    setItems((prev) =>
      prev.map((it) => (it.id === editingId ? { ...it, title: value } : it))
    )
    cancelEdit()
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  function toggle(id) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    )
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function clearCompleted() {
    setItems((prev) => prev.filter((it) => !it.done))
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems((prev) => {
      const oldIndex = prev.findIndex((it) => it.id === active.id)
      const newIndex = prev.findIndex((it) => it.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur border-b">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">ToDoList</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <form onSubmit={addItem} className="card mb-6 flex gap-3 items-start">
          <input
            className="input flex-1"
            placeholder="New task…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn-accent">Add</button>
        </form>

        {items.length === 0 ? (
          <div className="card text-center text-muted">
            No tasks yet — it's time to plan something!
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              // порядок определяется по текущему массиву
              items={items.map((it) => it.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {items.map((it) => {
                  const isEditing = editingId === it.id
                  return (
                    <li key={it.id}>
                      <SortableItem
                        id={it.id}
                        disabled={isEditing}
                        className="card flex items-center gap-3"
                      >
                        <span
                          className="inline-flex h-5 w-5 items-center justify-center rounded border text-muted"
                          title="Drag to move"
                        >
                          ⋮⋮
                        </span>

                        <input
                          type="checkbox"
                          checked={it.done}
                          onChange={() => toggle(it.id)}
                          className="h-5 w-5"
                          disabled={isEditing}
                        />

                        {isEditing ? (
                          <input
                            className="input flex-1"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            autoFocus
                          />
                        ) : (
                          <div
                            className={`flex-1 ${
                              it.done ? 'line-through text-muted' : ''
                            }`}
                            onDoubleClick={() => startEdit(it)}
                            title="Double-click to edit"
                          >
                            {it.title}
                          </div>
                        )}

                        {isEditing ? (
                          <>
                            <button
                              className="btn-accent"
                              onClick={saveEdit}
                              type="button"
                              title="Save"
                            >
                              Save
                            </button>
                            <button
                              className="btn-ghost border"
                              onClick={cancelEdit}
                              type="button"
                              title="Cancel"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn-ghost border"
                              onClick={() => startEdit(it)}
                              type="button"
                              title="Edit"
                              aria-label="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              className="btn-ghost border"
                              onClick={() => removeItem(it.id)}
                              title="Delete"
                              type="button"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </SortableItem>
                    </li>
                  )
                })}
              </ul>
            </SortableContext>
          </DndContext>
        )}

        {items.some((it) => it.done) && (
          <div className="mt-6 flex justify-end">
            <button
              className="btn-ghost border"
              onClick={clearCompleted}
              type="button"
            >
              Clear completed
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
