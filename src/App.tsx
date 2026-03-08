import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './components/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="scanlines">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
