import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SortableItem({
  id,
  children,
  className = '',
  disabled = false,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const dragClasses = disabled
    ? 'cursor-default'
    : 'cursor-grab active:cursor-grabbing'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'touch-none select-none',
        dragClasses,
        isDragging ? 'opacity-70 ring-2 ring-accent' : '',
        className,
      ].join(' ')}
      {...(!disabled ? attributes : {})}
      {...(!disabled ? listeners : {})}
    >
      {children}
    </div>
  )
}
