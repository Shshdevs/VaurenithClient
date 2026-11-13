import { AppShell, Burger, Group, NavLink, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import css from './index.module.scss'

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
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

  return (
    <AppShell
      className={css.layout}
      header={{ height: 60 }}
      transitionDuration={320}
      transitionTimingFunction="cubic-bezier(0.22, 1, 0.36, 1)"
      navbar={{
        width: desktopOpened ? 300 : 112,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
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
