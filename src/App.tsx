import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { BlogPage } from './pages/BlogPage'
import { HomePage } from './pages/HomePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
