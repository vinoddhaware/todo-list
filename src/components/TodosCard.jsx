import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { MdPending } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";


const TodosCard = ({currTask, setIsEdit, setTask, todos, setTodos, mode, setDragCard, handleDrop, index}) => {
  const {id, taskName, category, dueDate, reminderDate} = currTask

  const handleDeleteTask = (id) =>{
    const updatedTaskList = todos.filter((currTask)=> currTask.id != id)
    setTodos(updatedTaskList)
  }

  const handleUpdateTask = (editTask) =>{
    setTask(editTask)
    setIsEdit(true)
  }

  const handleDragStart = (e, dragTask, dragPosition) =>{
    e.target.style.opacity = '0.4'
    setDragCard({...dragTask, dragPosition})
  }

const handleDragEnd = (e) =>{
    e.target.style.opacity = '1'
    setDragCard(null)
  }

  
  const numberOfDays = (todaysDate, dueOrreminderDate) =>{
    const today = new Date(todaysDate);
    const dueAndReminder = new Date(dueOrreminderDate);
    
    today.setHours(0, 0, 0, 0);
    dueAndReminder.setHours(0, 0, 0, 0);
    
    const diffMs = Math.abs(dueAndReminder - today);
    
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
  
  const todaysDate = new Date();
  
  const dueDays = numberOfDays(todaysDate, dueDate)
  const reminderDays = numberOfDays(dueDate, reminderDate)

  return (
    <div draggable onDrop={()=>handleDrop(index)} onDragOver={e=> e.preventDefault()} onDragStart={(e)=>handleDragStart(e, currTask, index)} onDragEnd={handleDragEnd} className={`${ category === "PENDING" ? 'border-[#ffff00]' : category === "COMPLETED" ? 'border-[#008000]' : '' }  ${mode === "dark" ? "bg-gray-900" : "bg-white" } relative p-4 border-t-3 rounded-t-sm flex flex-col gap-2 font-sans shadow-2xl cursor-grab `}>
      <div className='absolute right-2'>
        { 
          category === "PENDING" ? <MdPending color='yellow' /> : category === "COMPLETED" ? <FaCircleCheck color='green' /> : '📝' 
        }
      </div>
      
      <span> Id: {id} </span>
      <p className='line-clamp-2'> Task: {taskName} </p>
      <p className='flex justify-start items-center gap-2'>
          Reminder: <span className={`${reminderDays === 0 ? "text-green-500":""}`}> {reminderDays} {`${reminderDays === 1 ? "day":"days"}`} left</span>
          <span className='text-yellow-400'><GoBellFill /></span>
        </p>
        
      <div className='flex justify-between items-center pt-6' >
        <p className='text-[12px] text-red-300 font-bold '>Due Date: <span className={` ${dueDays === 0 && category === "COMPLETED" ? "text-green-500" : ""} ml-2`}>{dueDate}</span></p>
        <div className='flex justify-between items-center gap-4'>
            <button onClick={()=>handleUpdateTask(currTask)} className='text-lg text-green-400 hover:text-green-700 duration-300 ease-in-out active:scale-95 cursor-pointer' > <FaEdit /> </button>
            <button onClick={()=>handleDeleteTask(id)} type='button'  className='text-lg text-red-500 hover:text-red-700 duration-300 ease-in-out active:scale-95 cursor-pointer' > <MdDelete /> </button>
        </div>
      </div>
    </div>
  )
}

export default TodosCard
