import React, { useEffect, useState } from 'react'
import TodosCard from './TodosCard'
import { BiTaskX } from "react-icons/bi";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

const TodoList = () => {

    const todoLocalStorageKey = 'todos'
    const modeLocalStorageKey = 'darkLightMode'
    
    const [todos, setTodos] = useState(()=>{
        const getLocalStorageData = JSON.parse(localStorage.getItem(todoLocalStorageKey))
        if(getLocalStorageData)
            return getLocalStorageData
        else 
            return []
    })

    const [mode, setMode] = useState(()=>{
        const getLocalStorageData = localStorage.getItem(modeLocalStorageKey)
        if(getLocalStorageData)
            return getLocalStorageData
        else 
            return 'dark'
    })
    
    const [minDate, setMinDate] = useState("");
    const [dragCard, setDragCard] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [categoryData, setcategoryData] = useState('TODO')
    const [task, setTask] = useState({
        id: '',
        taskName: '',
        category:'TODO',
        dueDate: '',
        reminderDate: ''
    })   
     
    const handleInputChange = (e) =>{
        const { name, value } = e.target
        setTask((prev) =>({...prev, [name]: value}))
    }
    
    const uniqueId = todos.length ===  0 ? 1 : todos.length + 1
    
    const filteredTodos = todos.filter((currTask) => categoryData === "TODO" || currTask.category === categoryData )

    const categoryFilter = (e) =>{
        if(e.target !== e.currentTarget)
            setcategoryData(e.target.textContent === "All" ? "TODO" : e.target.textContent.toUpperCase())       
    }

    const capitalized = "All " + categoryData.charAt(0).toUpperCase() + categoryData.slice(1).toLowerCase();
        
    useEffect(() => {
        localStorage.setItem(todoLocalStorageKey, JSON.stringify(todos))
        localStorage.setItem(modeLocalStorageKey, mode);
    }, [todos, mode])

    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        setMinDate(`${yyyy}-${mm}-${dd}`);
    }, []);
    

    const handleFormSubmit = (e) =>{
        e.preventDefault();

        if(!task.taskName) return alert("enter task");
        if(!task.dueDate) return alert("enter due date");
        if(!task.reminderDate) return alert("enter reaminder date");
        if(!(task.reminderDate < task.dueDate)) return alert("reaminder date must be less than due date");


           
        if(isEdit){
            const editedTaskList = todos.map((currTask) => currTask.id === task.id ? task : currTask)
            setTodos(editedTaskList)
            setIsEdit(false)
            setTask({id: '', taskName: '', category: 'TODO', dueDate: '', reminderDate: ''})
        }else{

            const allTaskName = todos.map((currTask)=>currTask.taskName);                
            const allTaskCategory = todos.map((currTask)=>currTask.taskName);                
            
            if(allTaskName.includes(task.taskName.trim().toLowerCase()) || allTaskCategory.includes(task.category) ){
                setTask({id: '', taskName: '', category: 'TODO', dueDate: '', reminderDate: ''});
                return alert("task already exit!");
            } 
            
            setTodos((prev)=>[...prev, {...task, id:uniqueId}])
            setTask({id: '', taskName: '', category: 'TODO', dueDate: '', reminderDate: ''})
        }
    }   

    const darkLightMode = () => setMode(mode === "dark" ? "light" : "dark");

    const handleDrop = (dropPosition) =>{
        const newTodos = [...todos]
        const taskToMoved = todos[dropPosition]
        
        newTodos[dropPosition] = dragCard
        newTodos[dragCard.dragPosition] = taskToMoved

        setTodos(newTodos)        
        
    }

    
    return (
    <div className={`${mode === "dark" ? "bg-[#030712] text-white min-h-screen" : "bg-white text-gray-900 min-h-screen pb-10"} transition-colors duration-300 text-sm lg:text-base`}>
        <div className='flex justify-center items-center flex-col gap-4 py-8'>
            <h1 className='text-2xl sm:text-3xl font-bold' > Todo List  </h1>
            <form onSubmit={handleFormSubmit} className=' flex flex-col w-[90%] sm:w-[60%] md:w-[50%] lg:w-full lg:flex-row justify-center lg:items-center gap-4 mt-6'>
                <div className='relative'>
                    <input onChange={handleInputChange} value={task.taskName} type="text" name="taskName" id="task" className='peer border-b outline-none placeholder-transparent w-full' placeholder='enter task' autoComplete='off' />
                    <label htmlFor="task" className='absolute left-0 -top-5 peer-placeholder-shown:top-0 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-500 text-gray-600 transition-all duration-500 ease-in-out cursor-text' >Enter Task</label>
                </div>

                <select onChange={handleInputChange} value={task.category} name="category" id="category" className={` ${ mode === "dark" ? "dark:bg-gray-950 border-white/40" : "dark:bg-white border-black/40" } border p-1.5 rounded-sm outline-none cursor-pointer`} >
                    <option defaultValue={"TODO"} value="TODO">Todo</option>
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                </select>

                <div className='flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-4 gap-2'>
                    <p>Due Date: </p>
                    <input onChange={handleInputChange} value={task.dueDate} min={minDate} type="date" name="dueDate" className={`${mode === "dark" ? "border-white/40": "border-black/40"} border outline-none p-1.5`} />                
                </div>               

                <div className='flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-4 gap-2'>
                    <p>Reminder Date: </p>
                    <input onChange={handleInputChange} value={task.reminderDate} type="date" name="reminderDate" className={`${mode === "dark" ? "border-white/40": "border-black/40"} border outline-none p-1.5`} />                    
                </div>
        
                <button type='submit' className={` ${ isEdit ? "bg-green-700 hover:bg-green-600" : "bg-blue-700 hover:bg-blue-600" } px-4 py-1.5 active:scale-95 text-white transition-all duration-300 rounded-sm cursor-pointer`}>{ isEdit ? "+ Edit Task" : "+ Add Task" }</button>
            </form>
        </div>
    
        <div className='w-[90%] mx-auto'>
            <div className='flex justify-between items-center'>
                <h1 className='text-base sm:text-xl font-bold'>{categoryData === "TODO" ? "All" : capitalized} Tasks</h1>
                <div className='flex justify-center items-center gap-1 sm:gap-6 text-[8px] sm:text-sm'>
                    <div onClick={categoryFilter} className='flex justify-center items-center gap-1 sm:gap-4 text-white'>
                        <button className={` ${ categoryData === "TODO" ? "scale-90" : "scale-100" } px-2 py-1 sm:px-4 sm:py-1 bg-blue-600 hover:bg-blue-700 duration-300 ease-in-out active:scale-95 cursor-pointer rounded-sm`} >All</button>
                        <button className={` ${ categoryData === "PENDING" ? "scale-90" : "scale-100" } px-2 py-1 sm:px-4 sm:py-1 bg-yellow-600 hover:bg-yellow-700 duration-300 ease-in-out active:scale-95 cursor-pointer rounded-sm`} >Pending</button>
                        <button className={` ${ categoryData === "COMPLETED" ? "scale-90" : "scale-100" } px-2 py-1 sm:px-4 sm:py-1 bg-green-600 hover:bg-green-700 duration-300 ease-in-out active:scale-95 cursor-pointer rounded-sm`} >Completed</button>
                    </div>
                    
                    <button onClick={darkLightMode} className='cursor-pointer' type="button"> {mode === 'light'? <MdDarkMode size="25px" />:<MdOutlineLightMode size="25px" />}</button>
                </div>
            </div>

            <div className={` ${filteredTodos.length >= 1 ? "hidden" : " flex gap-4 justify-center items-center h-screen w-screen fixed text-xl"}`}>
                <BiTaskX size={"25px"} />
                <p>{categoryData === "PENDING" ? "No Pending Task Available" : categoryData === "COMPLETED" ? "No Completed Task Available" : "No Task Available" }</p>
            </div>

            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6'>
                {
                    filteredTodos?.map((currTask, index)=> <TodosCard key={currTask.id} currTask={currTask} setTask = {setTask} setIsEdit = {setIsEdit} todos = {todos} setTodos={setTodos} mode = {mode} setDragCard = {setDragCard} index = {index} handleDrop = {handleDrop} /> )
                }
            </div>
        </div>
    
    </div>
  )
}

export default TodoList
