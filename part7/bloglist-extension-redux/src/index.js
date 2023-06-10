import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import notificationReducer from "./reducers/notificationReducer";
import { configureStore } from "@reduxjs/toolkit"
import { createStore } from "redux"
import {Provider} from "react-redux"


const store = configureStore({
    reducer: notificationReducer
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store} >
        <App />
    </Provider>
)