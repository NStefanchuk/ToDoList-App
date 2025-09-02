import React from 'react'
import {
  FaTrash, // delete
  FaTrashAlt,
  FaRegCircle, // not tick
  FaCheckCircle, // tick
  FaCalendarPlus, // todo/calendar plus
} from 'react-icons/fa'

const TodoItems = () => {
  return (
    <div className="flex items-center my-3 gap-2">
      <div className='flex flex-1 items-center cursor-pointer'>
        <FaCheckCircle className="text-2xl text-black-500 w-7" />
        <p className='text-slate-700 ml-4 text-[17px]'>Learn Coding</p>
      </div>
      <FaTrashAlt className="text-2xl text-black-500 w-3.5 cursor-pointer" />
    </div>
  )
}

export default TodoItems
