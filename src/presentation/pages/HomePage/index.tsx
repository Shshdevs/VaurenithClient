import { Layout } from '@/presentation/components/Layout'
import { Home, LayoutDashboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation('presentation')

  return (
    <Layout
      navLinks={[
        { icon: Home, labelKey: 'navigation.home' },
        { icon: LayoutDashboard, labelKey: 'navigation.projects' },
      ]}
    >
      <div>{t('home.title')}</div>
    </Layout>
  )
}
