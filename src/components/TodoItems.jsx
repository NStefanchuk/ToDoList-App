import React from 'react'
import { FaTrashAlt, FaRegCircle, FaCheckCircle } from 'react-icons/fa'

const TodoItems = ({ text, id, isComplete, deleteTodo, toggle }) => {
  return (
    <div className="flex items-center my-3 gap-2">
      <div
        onClick={() => {
          toggle(id)
        }}
        className="flex flex-1 items-center cursor-pointer"
      >
        {isComplete ? (
          <FaCheckCircle className="text-2xl text-green-500 w-7" />
        ) : (
          <FaRegCircle className="text-2xl text-gray-500 w-7" />
        )}
        <p
          className={`text-slate-700 ml-4 text-[17px] decoration-slate-500 ${
            isComplete ? 'line-through' : ''
          }`}
        >
          {text}
        </p>
      </div>
      <FaTrashAlt
        onClick={() => {
          deleteTodo(id)
        }}
        className="text-2xl text-black-500 w-3.5 cursor-pointer"
      />
    </div>
  )
}

export default TodoItems
