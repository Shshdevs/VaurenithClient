import { Route, Routes, useParams } from 'react-router-dom'
import { HomePage } from '@/presentation/pages/HomePage'
import { NotFoundPage } from '@/presentation/pages/NotFoundPage'

function LocalizedHomePage() {
  const { locale } = useParams()

  return locale === 'en' || locale === 'ru' ? <HomePage /> : <NotFoundPage />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:locale" element={<LocalizedHomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
