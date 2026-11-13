import { Layout } from '@/presentation/components/Layout'
import { Home, LayoutDashboard } from 'lucide-react'
export function HomePage() {
  return (
    <Layout
      navLinks={[
        { icon: Home, label: 'Главная' },
        { icon: LayoutDashboard, label: 'Проекты' },
      ]}
    >
      <div>Main</div>
    </Layout>
  )
}
