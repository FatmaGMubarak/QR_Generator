import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserOptionsProvider } from './context/UserOptionsContext.jsx'
import { Provider } from 'react-redux'
import store from './store/index.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <UserOptionsProvider>
    <App />

  </UserOptionsProvider>
  </Provider>
  
)
