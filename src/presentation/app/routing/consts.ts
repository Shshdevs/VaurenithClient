import { ContainerIcon, DatabaseIcon, Home, LayoutDashboard, Settings } from 'lucide-react'

export const APP_NAV_SECTIONS = [
  {
    title: 'navigation.main',
    navLinks: [
      { icon: Home, labelKey: 'navigation.home' },
      { icon: LayoutDashboard, labelKey: 'navigation.projects' },
      { icon: ContainerIcon, labelKey: 'navigation.containers' },
      { icon: DatabaseIcon, labelKey: 'navigation.devices' },
    ],
  },
  {
    title: 'navigation.settings',
    navLinks: [{ icon: Settings, labelKey: 'navigation.main_settings' }],
  },
] as const
