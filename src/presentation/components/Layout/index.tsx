import { AppShell, Burger, Group, NavLink, ScrollArea } from '@mantine/core'
import { useAppShellResize } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import css from './index.module.scss'

const NAVBAR_MIN_WIDTH = 112
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
  const [desktopOpened, setDesktopOpened] = useState(true)
  const [expandedWidth, setExpandedWidth] = useState(NAVBAR_MAX_WIDTH)
  const resize = useAppShellResize({
    navbar: {
      min: NAVBAR_MIN_WIDTH,
      max: NAVBAR_MAX_WIDTH,
      collapseThreshold: NAVBAR_MIN_WIDTH + 1,
      label: 'Изменить ширину навигационной панели',
    },
    initialSizes: INITIAL_RESIZE_SIZES,
    onResize: ({ navbar }) => {
      if (navbar !== undefined && navbar > NAVBAR_MIN_WIDTH + 1) {
        setExpandedWidth(navbar)
      }
    },
    onCollapseChange: (section, collapsed) => {
      if (section === 'navbar') {
        setDesktopOpened(!collapsed)
      }
    },
  })

  const toggleDesktop = () => {
    const nextOpened = !desktopOpened
    setDesktopOpened(nextOpened)
    resize.navbar.setSize(nextOpened ? expandedWidth : NAVBAR_MIN_WIDTH)
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
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          The burger icon is always visible
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={css.navbar}>
        <AppShell.Section className={css.navbarSection}>
          <span className={`${css.navbarText} ${desktopOpened ? '' : css.navbarTextCollapsed}`}>
            Header – should some useful tips
          </span>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea} className={css.navLinks}>
          {navLinks.map((navLink, index) => {
            const Icon = navLink.icon
            const { label } = navLink

            return (
              <NavLink
                href="#"
                key={index}
                onClick={(event) => event.preventDefault()}
                leftSection={<Icon />}
                label={label}
                classNames={{
                  root: css.navLink,
                  section: css.navLinkSection,
                  body: css.navLinkBody,
                  label: desktopOpened ? css.navLinkLabel : css.navLinkLabelCollapsed,
                }}
              />
            )
          })}
        </AppShell.Section>

        <AppShell.Section className={css.navbarSection}>
          <span className={`${css.navbarText} ${desktopOpened ? '' : css.navbarTextCollapsed}`}>
            Navbar footer – always at the bottom
          </span>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
