import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/presentation/pages/HomePage'
import { NotFoundPage } from '@/presentation/pages/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
