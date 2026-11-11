import { Link, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<main />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NotFound() {
  return (
    <main>
      <h1>Страница не найдена</h1>
      <Link to="/">На главную</Link>
    </main>
  )
}

export default App
