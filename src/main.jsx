import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <div className="h-screen w-full relative overflow-hidden">
            <App />
        </div>
    </React.StrictMode>
)
