import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import OverlayProvider from './ui/core/overlay/overlay_provider'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <div className="h-screen w-full relative overflow-hidden">
            <App />
            <OverlayProvider />
        </div>
    </React.StrictMode>
)
