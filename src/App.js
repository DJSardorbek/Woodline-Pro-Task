import React from "react";
import Todos from "./components/Todos/Todos";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
    return (
        <div className='App'>
            <ToastContainer autoClose={2000}/>
            <Todos/>
        </div>

    )
}
