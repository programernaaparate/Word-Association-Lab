import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './components/AppRouter'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter>
      <App />
    </AppRouter>
  </React.StrictMode>,
)
