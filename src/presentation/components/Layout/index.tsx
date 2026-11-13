import { AppShell, Burger, Group, NavLink, ScrollArea, Tooltip } from '@mantine/core'
import { useAppShellResize } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import css from './index.module.scss'

const NAVBAR_MIN_WIDTH = 86
const NAVBAR_MAX_WIDTH = 300
const INITIAL_RESIZE_SIZES = { navbar: NAVBAR_MAX_WIDTH }

type NavbarLink = {
  icon: LucideIcon
  label: string
}

type LayoutProps = {
  children: ReactNode
  navLinks: NavbarLink[]
}

export function Layout({ children, navLinks }: LayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [expandedWidth, setExpandedWidth] = useState(NAVBAR_MAX_WIDTH)
  const [currentWidth, setCurrentWidth] = useState(NAVBAR_MAX_WIDTH)
  const navLinksRef = useRef<HTMLDivElement>(null)
  const isCollapsed = currentWidth < NAVBAR_MIN_WIDTH + 1
  const resize = useAppShellResize({
    navbar: {
      min: NAVBAR_MIN_WIDTH,
      max: NAVBAR_MAX_WIDTH,
      label: 'Изменить ширину навигационной панели',
    },
    initialSizes: INITIAL_RESIZE_SIZES,
    onResize: ({ navbar }) => {
      if (navbar !== undefined) {
        setCurrentWidth(navbar)
      }
    },
    onResizeEnd: ({ navbar }) => {
      if (navbar !== undefined) {
        setCurrentWidth(navbar)
      }
    },
  })

  useEffect(() => {
    if (isCollapsed) {
      return
    }

    const labels = navLinksRef.current?.querySelectorAll<HTMLElement>(`.${css.navLinkLabel}`)
    const hasOverflow = Array.from(labels ?? []).some((label) => label.scrollWidth > label.clientWidth)

    if (resize.navbar.active) {
      if (!hasOverflow) {
        setExpandedWidth(currentWidth)
      }

      return
    }

    if (hasOverflow) {
      setCurrentWidth(NAVBAR_MIN_WIDTH)
      resize.navbar.setSize(NAVBAR_MIN_WIDTH)
      return
    }

    setExpandedWidth(currentWidth)
  }, [currentWidth, isCollapsed, navLinks, resize.navbar])

  const toggleDesktop = () => {
    const nextOpened = isCollapsed
    const nextWidth = nextOpened ? expandedWidth : NAVBAR_MIN_WIDTH

    setCurrentWidth(nextWidth)
    resize.navbar.setSize(nextWidth)
  }

  return (
    <AppShell
      className={css.layout}
      header={{ height: 60 }}
      transitionDuration={320}
      transitionTimingFunction="cubic-bezier(0.22, 1, 0.36, 1)"
      navbar={{
        width: NAVBAR_MAX_WIDTH,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
      resize={resize}
      classNames={{ resizeHandle: css.resizeHandle }}
    >
      <AppShell.Header>
        <Group className={css.headerGroup}>
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={!isCollapsed} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          The burger icon is always visible
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={css.navbar}>
        <AppShell.Section className={css.navbarSection}>
          <span className={`${css.navbarText} ${isCollapsed ? css.navbarTextCollapsed : ''}`}>
            Header – should some useful tips
          </span>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea} className={css.navLinks}>
          <div ref={navLinksRef}>
            {navLinks.map((navLink, index) => {
              const Icon = navLink.icon
              const { label } = navLink
              const icon = (
                <span className={css.navLinkIcon}>
                  <Icon />
                </span>
              )

              return (
                <NavLink
                  href="#"
                  key={index}
                  onClick={(event) => event.preventDefault()}
                  leftSection={
                    isCollapsed ? (
                      <Tooltip label={label} position="right">
                        {icon}
                      </Tooltip>
                    ) : (
                      icon
                    )
                  }
                  label={isCollapsed ? null : label}
                  classNames={{
                    root: css.navLink,
                    section: css.navLinkSection,
                    body: css.navLinkBody,
                    label: css.navLinkLabel,
                  }}
                />
              )
            })}
          </div>
        </AppShell.Section>

        <AppShell.Section className={css.navbarSection}>
          <span className={`${css.navbarText} ${isCollapsed ? css.navbarTextCollapsed : ''}`}>
            Navbar footer – always at the bottom
          </span>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
