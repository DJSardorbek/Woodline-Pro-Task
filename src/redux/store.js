import {configureStore} from "@reduxjs/toolkit";
import todos from "../components/Todos/todos_slice";
import {stringMiddleware} from "../middleware/stringMiddleware";

export const store = configureStore({
    reducer: todos,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== "production"
})