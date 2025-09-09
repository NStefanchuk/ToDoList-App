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

  // сохраняем при каждом изменении
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items))
  }, [items])

  function addItem(e) {
    e?.preventDefault()
    const value = text.trim()
    if (!value) return
    setItems(prev => [{ id: crypto.randomUUID(), title: value, done: false }, ...prev])
    setText('')
  }

  function toggle(id) {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  function clearCompleted() {
    setItems(prev => prev.filter(it => !it.done))
  }

  // --- DND setup ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems(prev => {
      const oldIndex = prev.findIndex(it => it.id === active.id)
      const newIndex = prev.findIndex(it => it.id === over.id)
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
              items={items.map(it => it.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {items.map((it) => (
                  <li key={it.id}>
                    <SortableItem id={it.id} className="card flex items-center gap-3">
                      <span
                        className="inline-flex h-5 w-5 items-center justify-center rounded border text-muted"
                        title="Drag to move"
                      >
                        {/* визуальная «ручка» — просто индикатор, тащить можно за весь блок */}
                        ⋮⋮
                      </span>

                      <input
                        type="checkbox"
                        checked={it.done}
                        onChange={() => toggle(it.id)}
                        className="h-5 w-5"
                      />

                      <div className={`flex-1 ${it.done ? 'line-through text-muted' : ''}`}>
                        {it.title}
                      </div>

                      <button
                        className="btn-ghost border"
                        onClick={() => removeItem(it.id)}
                        title="Delete"
                        type="button"
                      >
                        ✕
                      </button>
                    </SortableItem>
                  </li>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}

        {items.some((it) => it.done) && (
          <div className="mt-6 flex justify-end">
            <button className="btn-ghost border" onClick={clearCompleted} type="button">
              Clear completed
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
