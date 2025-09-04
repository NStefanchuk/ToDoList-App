import React from 'react'
import { FaTrashAlt, FaRegCircle, FaCheckCircle } from 'react-icons/fa'

const TodoItems = ({ text, id, isComplete, deleteTodo, toggle }) => {
  return (
    <div className="flex items-center my-3 gap-2">
      <div
        onClick={() => toggle(id)}
        className="flex flex-1 items-center cursor-pointer"
      >
        {isComplete ? (
          <FaCheckCircle className="text-2xl text-green-600 w-7" />
        ) : (
          <FaRegCircle className="text-2xl text-gray-400 w-7" />
        )}
        <p
          className={`ml-4 text-[17px] ${
            isComplete
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          }`}
        >
          {text}
        </p>
      </div>
      <button
        type="button"
        onClick={() => deleteTodo(id)}
        className="p-2 rounded hover:bg-red-50 focus-visible:outline outline-2 outline-offset-2 outline-blue-500"
        aria-label="Delete task"
      >
        <FaTrashAlt className="w-5 h-5 text-red-500" />
      </button>
    </div>
  )
}

export default TodoItems
