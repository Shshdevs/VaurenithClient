import { BrowserRouter, HashRouter } from 'react-router-dom'
import { LanguageSync } from './LanguageSync'
import { AppRouter } from '@/presentation/app/routing/AppRouter'
import { usePlatform } from '@/presentation/hooks/app/platform/usePlatform'

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
