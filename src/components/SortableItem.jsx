import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableItem({ id, children, className = '' }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'touch-none cursor-grab active:cursor-grabbing select-none',
        isDragging ? 'opacity-70 ring-2 ring-accent' : '',
        className,
      ].join(' ')}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}
