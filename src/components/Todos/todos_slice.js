import {createSlice} from "@reduxjs/toolkit";

export const getDateFormatted = () => {
    const date = new Date();
    const hours = Math.floor((date / (1000 * 60 * 60)) % 24),
    minutes = Math.floor((date / (1000 * 60)) % 60),
    seconds = Math.floor((date / 1000) % 60);

    return `${getZero(hours)}:${getZero(minutes)}.${getZero(seconds)}`
};
const getZero = (num) => (num >= 0 && num < 10) ? `0${num}` : num;

const initialState = {
    todos : [
        { id: 1, name: 'Move the lawn', status: 'new', lastUpdated: getDateFormatted() },
        { id: 2, name: 'Go to the gym', status: 'new', lastUpdated: getDateFormatted() },
        { id: 3, name: 'Call Ollie', status: 'new', lastUpdated: getDateFormatted() },
        { id: 4, name: 'Fix bike tyre', status: 'new', lastUpdated: getDateFormatted() },
        { id: 5, name: 'Finish blog post', status: 'new', lastUpdated: getDateFormatted() } ],
    todoEdited: false,
    editedTodoId: 0,
    todoId: 0,
    lastUpdatedTodo: {}
}

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        todoEditedChanged: (state, action) => {
            state.todoEdited = action.payload.todoEdited;
            state.editedTodoId = action.payload.editedTodoId;
        },
        todoStatusUpdated: (state, action) => {
            state.lastUpdatedTodo = action.payload;
        },
        todoDragStarted: (state, action) => {
            state.todoId = action.payload;
        },
        todoDropped: (state, action) => {
            state.todos = action.payload;
        },
        addTodo: (state, action) => {
            state.todos.push(action.payload);
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
        },
        editTodo: (state, action) => {
            state.todos = state.todos.map(todo => {
                if(todo.id === action.payload.id) {
                    return action.payload;
                } else {
                    return todo;
                }
            })
        }
    }
})

export const {todoEditedChanged, todoStatusUpdated, todoDragStarted, todoDropped, addTodo, deleteTodo, editTodo} = todosSlice.actions;
export default todosSlice.reducer;