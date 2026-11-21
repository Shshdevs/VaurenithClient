import type { LucideIcon } from 'lucide-react'

export type NavbarLink = {
  icon: LucideIcon
  labelKey: string
  to?: string
}

export type NavbarSection = {
  title: string
  navLinks: readonly NavbarLink[]
}

export type LayoutProps = {
  navSections: readonly NavbarSection[]
}

export type NavbarNavLinkProps = {
  navLink: NavbarLink
  label: string
  isCollapsed: boolean
  isActive: boolean
  onActiveElementChange: (element: HTMLAnchorElement | null) => void
  onHover: (element: HTMLElement) => void
  onHoverEnd: () => void
  onNavigate: () => void
}
