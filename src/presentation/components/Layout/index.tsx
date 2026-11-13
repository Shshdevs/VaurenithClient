import { AppShell, Burger, Group, NavLink, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

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
      header={{ height: 60 }}
      transitionDuration={320}
      transitionTimingFunction="cubic-bezier(0.22, 1, 0.36, 1)"
      navbar={{
        width: desktopOpened ? 300 : 88,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          The burger icon is always visible
        </Group>
      </AppShell.Header>
      <AppShell.Navbar
        p="md"
        style={{
          transitionProperty: 'width, transform, top, height',
          transitionDuration: 'var(--app-shell-transition-duration)',
          transitionTimingFunction: 'var(--app-shell-transition-timing-function)',
        }}
      >
        <AppShell.Section p="lg">
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              visibility: desktopOpened ? 'visible' : 'hidden',
            }}
          >
            Header – should some useful tips
          </span>
        </AppShell.Section>

        <AppShell.Section grow my="lg" component={ScrollArea} px="sm" style={{ padding: 5 }}>
          {navLinks.map((navLink, index) => {
            const Icon = navLink.icon
            const { label } = navLink

            return (
              <NavLink
                href="#"
                key={index}
                onClick={(event) => event.preventDefault()}
                leftSection={<Icon size={32} />}
                label={label}
                styles={{
                  root: {
                    width: '100%',
                    minHeight: 56,
                    paddingBlock: 12,
                    paddingInline: 8,
                    overflow: 'hidden',
                  },
                  label: {
                    whiteSpace: 'nowrap',
                    opacity: desktopOpened ? 1 : 0,
                    transition: 'opacity 160ms ease',
                  },
                }}
              />
            )
          })}
        </AppShell.Section>

        <AppShell.Section p="lg">
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              visibility: desktopOpened ? 'visible' : 'hidden',
            }}
          >
            Navbar footer – always at the bottom
          </span>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
