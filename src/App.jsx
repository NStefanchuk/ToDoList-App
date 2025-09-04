import { useState } from 'react'
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

  function persist(next) {
    setItems(next)
    localStorage.setItem('todos', JSON.stringify(next))
  }

  function addItem(e) {
    e?.preventDefault()
    const value = text.trim()
    if (!value) return
    persist([{ id: crypto.randomUUID(), title: value, done: false }, ...items])
    setText('')
  }

  function toggle(id) {
    persist(items.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  function remove(id) {
    persist(items.filter((it) => it.id !== id))
  }

  function clearCompleted() {
    persist(items.filter((it) => !it.done))
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

        <section className="space-y-3">
          {items.length === 0 ? (
            <div className="card text-center text-muted">
              No tasks yet. it's time to plan something!
            </div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="card flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={it.done}
                  onChange={() => toggle(it.id)}
                  className="h-5 w-5"
                />
                <div
                  className={`flex-1 ${
                    it.done ? 'line-through text-muted' : ''
                  }`}
                >
                  {it.title}
                </div>
                <button
                  className="btn-ghost border"
                  onClick={() => remove(it.id)}
                  title="Удалить"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </section>

        {items.some((it) => it.done) && (
          <div className="mt-6 flex justify-end">
            <button className="btn-ghost border" onClick={clearCompleted}>
              Clear completed
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
