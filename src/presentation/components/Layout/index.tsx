import { AppShell, Burger, Group, NavLink, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import styles from './index.module.scss'

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
      className={styles.layout}
      header={{ height: 60 }}
      transitionDuration={Number(styles.layoutTransitionDuration)}
      transitionTimingFunction="cubic-bezier(0.22, 1, 0.36, 1)"
      navbar={{
        width: desktopOpened ? 'var(--layout-navbar-expanded-width)' : 'var(--layout-navbar-collapsed-width)',
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group className={styles.headerGroup}>
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          The burger icon is always visible
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={styles.navbar}>
        <AppShell.Section className={styles.navbarSection}>
          <span className={`${styles.navbarText} ${desktopOpened ? '' : styles.navbarTextCollapsed}`}>
            Header – should some useful tips
          </span>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea} className={styles.navLinks}>
          {navLinks.map((navLink, index) => {
            const Icon = navLink.icon
            const { label } = navLink

            return (
              <NavLink
                href="#"
                key={index}
                onClick={(event) => event.preventDefault()}
                leftSection={<Icon strokeWidth={1.5} />}
                label={label}
                classNames={{
                  root: styles.navLink,
                  section: styles.navLinkSection,
                  body: styles.navLinkBody,
                  label: desktopOpened ? styles.navLinkLabel : styles.navLinkLabelCollapsed,
                }}
              />
            )
          })}
        </AppShell.Section>

        <AppShell.Section className={styles.navbarSection}>
          <span className={`${styles.navbarText} ${desktopOpened ? '' : styles.navbarTextCollapsed}`}>
            Navbar footer – always at the bottom
          </span>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
