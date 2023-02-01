import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    addTodo,
    deleteTodo, editTodo,
    getDateFormatted,
    todoDragStarted,
    todoDropped,
    todoEditedChanged,
    todoStatusUpdated
} from "./todos_slice";
import {toast} from "react-toastify";
export default function Todos() {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('new');
    const todos = useSelector(state => state.todos);
    const todoId = useSelector(state => state.todoId);
    const lastUpdatedTodo = useSelector(state => state.lastUpdatedTodo);
    const todoEdited = useSelector(state => state.todoEdited);
    const editedTodoId = useSelector(state => state.editedTodoId);
    const dispatch = useDispatch();
    const dragRed = useRef(null);
    const onDragStart = evt => {
        let element = evt.currentTarget;
        element.classList.add("dragged");
        evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
        dispatch(todoDragStarted(element.id))
        evt.dataTransfer.effectAllowed = "move";
    }
    const onDragEnd = evt => {
        evt.currentTarget.classList.remove("dragged");
    };
    const onDragEnter = evt => {
        evt.preventDefault();
        let element = evt.currentTarget;
        element.classList.add("dragged-over");
        evt.dataTransfer.dropEffect = "move";
    };
    const onDragLeave = evt => {
        let currentTarget = evt.currentTarget;
        let newTarget = evt.relatedTarget;
        if (newTarget.parentNode === currentTarget || newTarget === currentTarget)
            return;
        evt.preventDefault();
        let element = evt.currentTarget;
        element.classList.remove("dragged-over");
    };
    const onDragOver = evt => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";
        let tasks = JSON.parse(JSON.stringify(todos));
        const todo = tasks.filter(task => task.id.toString() === todoId)[0];
        let currentTarget = evt.currentTarget;
        if(todo.status === 'new' && currentTarget.classList[0] === 'completed') {
            currentTarget.classList.add('dragged-red');
            dragRed.current = currentTarget;
        }
    };
    const onDrop = (evt, value, status) => {
        evt.preventDefault();
        evt.currentTarget.classList.remove("dragged-over");

        let data = evt.dataTransfer.getData("text/plain");
        let tasks = JSON.parse(JSON.stringify(todos));
        let updated = tasks.map(task => {
            if (task.id.toString() === data.toString()) {
                if(task.status === 'new' && status === 'completed'){
                    evt.currentTarget.classList.remove('dragged-red');
                }
                else if(task.status === status){
                    evt.currentTarget.classList.remove('dragged');
                }
                else {
                    task.status = status;
                    task.lastUpdated = getDateFormatted();
                    task.lastUpdatedTime = new Date().getTime();
                    dispatch(todoStatusUpdated(task));
                    dragRed.current && dragRed.current.classList.remove('dragged-red');
                    dragRed.current = null;
                }
            }
            return task;
        });

        if(evt.target.className !== 'todo' && evt.target.className !== 'started' && evt.target.className !== 'completed') {
            const dragOverItem = evt.target.getAttribute('data-id');

            let copyTodoItems = [...updated];
            const dragOverItemContent = copyTodoItems.filter(item => item.id.toString() === dragOverItem)[0];
            const dragItemContent = copyTodoItems.filter(item => item.id.toString() === todoId)[0];
            const dragItemPosition = copyTodoItems.findIndex(item => item === dragItemContent);
            const dragOverItemPosition = copyTodoItems.findIndex(item => item === dragOverItemContent);
            copyTodoItems.splice(dragItemPosition, 1);
            copyTodoItems.splice(dragOverItemPosition, 0, dragItemContent);

            updated = copyTodoItems;
        }

        if(JSON.stringify(updated) !== JSON.stringify(todos)){
            dispatch(todoDropped(updated));
        }
    };
    const createTodo = (e) => {
        e.preventDefault();
        const newTodo = { id: new Date().getTime(), name, status, lastUpdated: getDateFormatted()};
        dispatch(addTodo(newTodo));
        setName('');
        setStatus('new');
        toast.success('Todo added successfully!');
    }
    const removeTodo = (id) => {
        dispatch(deleteTodo(id));
        toast.error('Todo deleted successfully!');
    }
    const handleEditTodo = (id) => {
        const todo = todos.filter(todo => todo.id === id)[0];
        setName(todo.name);
        setStatus(todo.status);
        dispatch(todoEditedChanged({todoEdited: true, editedTodoId: id}))
    }
    const applyEditTodo = (e) => {
        e.preventDefault();
        let tasks = JSON.parse(JSON.stringify(todos));
        let editedTodo = tasks.filter(todo => todo.id === editedTodoId)[0];
        if(editedTodo.status === 'new' && status === 'completed') {
            toast.error("Can't move new todo to completed");
            return;
        }
        editedTodo.name = name;
        editedTodo.status = status;
        editedTodo.lastUpdated = getDateFormatted();
        editedTodo.lastUpdatedTime = new Date().getTime();
        dispatch(editTodo(editedTodo));

        setName('');
        setStatus('new');
        dispatch(todoEditedChanged({todoEdited: false, editedTodoId: 0}));
        toast.warn('Todo edited successfully!');
    }

    let startedTodos = todos.filter(t => t.status === "started")
    let completedTodos = todos.filter(t => t.status === "completed")
    let newTodos = todos.filter(t => t.status === "new")

    // View
    return (
        <div className='container'>
            <div className='title'>
                <h2>{`Todo (${newTodos.length})`}</h2>
                <h2>{`Started (${startedTodos.length})`}</h2>
                <h2>{`Completed (${completedTodos.length})`}</h2>
                <h2>Info</h2>
            </div>
            <div className='content'>
                {/* Todo */}
                <div
                    className='todo'
                    onDragEnter={e => onDragEnter(e)}
                    onDragLeave={e => onDragLeave(e)}
                    onDragOver={e => onDragOver(e)}
                    onDragEnd={e => onDragEnd(e)}
                    onDrop={e => onDrop(e, false, 'new')}
                >
                    {newTodos.map((todo, index) => (
                        <div
                            key={index}
                            id={todo.id}
                            data-id={`${todo.id}`}
                            className='item'
                            draggable
                            onDragStart={e => onDragStart(e)}
                            onDragEnd={e => onDragEnd(e)}
                        >
                            <p data-id={`${todo.id}`} className='item-name'>{todo.name}</p>
                            <p data-id={`${todo.id}`} className='item-date'>last updated <span className='item-date-hours'>{todo.lastUpdated}</span></p>
                            <div className='item-actions'>
                                <button onClick={() => handleEditTodo(todo.id)} className='btn-action'>Edit</button>
                                <button onClick={() => removeTodo(todo.id)} className='btn-action'>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Started */}
                <div
                    className='started'
                    onDragEnter={e => onDragEnter(e)}
                    onDragLeave={e => onDragLeave(e)}
                    onDragOver={e => onDragOver(e)}
                    onDragEnd={e => onDragEnd(e)}
                    onDrop={e => onDrop(e, false, 'started')}
                >
                    {startedTodos.map((todo, index) => (
                        <div
                            key={index}
                            id={todo.id}
                            data-id={`${todo.id}`}
                            className='item'
                            draggable
                            onDragStart={e => onDragStart(e)}
                            onDragEnd={e => onDragEnd(e)}
                        >
                            <p data-id={`${todo.id}`} className='item-name'>{todo.name}</p>
                            <p data-id={`${todo.id}`} className='item-date'>last updated <span className='item-date-hours'>{todo.lastUpdated}</span></p>
                            <div className='item-actions'>
                                <button onClick={() => handleEditTodo(todo.id)} className='btn-action'>Edit</button>
                                <button onClick={() => removeTodo(todo.id)} className='btn-action'>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Completed */}
                <div
                    className='completed'
                    onDragEnter={e => onDragEnter(e)}
                    onDragLeave={e => onDragLeave(e)}
                    onDragOver={e => onDragOver(e)}
                    onDragEnd={e => onDragEnd(e)}
                    onDrop={e => onDrop(e, false, 'completed')}
                >
                    {completedTodos.map((todo, index) => (
                        <div
                            key={index}
                            id={todo.id}
                            data-id={`${todo.id}`}
                            className='item'
                            draggable
                            onDragStart={e => onDragStart(e)}
                            onDragEnd={e => onDragEnd(e)}
                        >
                            <p data-id={`${todo.id}`} className='item-name'>{todo.name}</p>
                            <p data-id={`${todo.id}`} className='item-date'>last updated <span className='item-date-hours'>{todo.lastUpdated}</span></p>
                            <div className='item-actions'>
                                <button onClick={() => handleEditTodo(todo.id)} className='btn-action'>Edit</button>
                                <button onClick={() => removeTodo(todo.id)} className='btn-action'>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Info / TodoAddForm */}
                <div>
                    <div className='info'>
                        <div className='last-updated-task'>
                            <p>Last updated job was: <b>{lastUpdatedTodo.name}</b></p>
                        </div>
                        <div className='todos-status'>
                            {todos.map(task => (
                                <p key={task.id} className='task-name'>{task.name} - <b className='task-status'>{task.status}</b></p>
                            ))}
                        </div>
                    </div>
                    <form className='todo-add-form' onSubmit={todoEdited ? e=> applyEditTodo(e) : e => createTodo(e)}>
                        <div className='form-title'>
                            Todos form
                        </div>
                        <div className='group'>
                            <label htmlFor="name">Todo</label>
                            <input
                                type="text"
                                id='name'
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder='Enter todo...'
                            />
                        </div>
                        <div className='group'>
                            <label htmlFor="status">Status</label>
                            <select
                                name="status"
                                id="status"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            >
                                <option value="new">New</option>
                                <option value="started">Started</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <button
                            type='submit'
                            className='btn-submit'
                        >{todoEdited ? 'Edit todo' : 'Add todo'}</button>
                    </form>
                </div>
            </div>

        </div>
    );
}