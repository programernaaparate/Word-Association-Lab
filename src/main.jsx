import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './components/AppRouter'
import MobileAppBootstrap from './components/MobileAppBootstrap'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MobileAppBootstrap>
      <AppRouter>
        <App />
      </AppRouter>
    </MobileAppBootstrap>
  </React.StrictMode>,
)
