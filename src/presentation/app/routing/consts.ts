import { ContainerIcon, DatabaseIcon, Home, LayoutDashboard, Settings } from 'lucide-react'

export const APP_NAV_SECTIONS = [
  {
    title: 'navigation.main',
    navLinks: [
      { icon: Home, labelKey: 'navigation.home', to: '/' },
      { icon: LayoutDashboard, labelKey: 'navigation.projects', to: '/projects' },
      { icon: ContainerIcon, labelKey: 'navigation.containers', to: '/containers' },
      { icon: DatabaseIcon, labelKey: 'navigation.devices', to: '/devices' },
    ],
  },
  {
    title: 'navigation.settings',
    navLinks: [{ icon: Settings, labelKey: 'navigation.main_settings' }],
  },
] as const
