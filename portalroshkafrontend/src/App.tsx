import { BrowserRouter } from 'react-router'

import AppRoutes from './app/routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
