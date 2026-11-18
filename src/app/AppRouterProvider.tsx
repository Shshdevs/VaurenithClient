import { BrowserRouter, HashRouter } from 'react-router-dom'
import { LanguageSync } from './LanguageSync'
import { AppRouter } from '@/presentation/app/AppRouter'
import { usePlatform } from '@/presentation/app/usePlatform'

export function AppRouterProvider() {
  const platform = usePlatform()
  const Router = platform.kind === 'desktop' ? HashRouter : BrowserRouter

  return (
    <Router>
      <LanguageSync />
      <AppRouter />
    </Router>
  )
}
