/* eslint-disable import-x/no-unused-modules */
/* eslint-disable import-x/no-named-as-default-member */
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { AuthProvider } from './app/providers/AuthContext'
import './index.css'



const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No se encontró el elemento #root')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
