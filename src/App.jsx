import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { CountryDetail } from './pages/CountryDetail'
import { Compare } from './pages/Compare'
import { Visited } from './pages/Visited'
import { PageTransition } from './components/PageTransition'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/country/:code" element={<CountryDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/visited" element={<Visited />} />
      </Routes>
    </PageTransition>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}