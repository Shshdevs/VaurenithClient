import { AppShell, Burger, Group, NavLink, ScrollArea, Tooltip, Title } from '@mantine/core'
import { useAppShellResize } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { BrandLogo } from '@/presentation/components/BrandLogo'
import css from './index.module.scss'

const NAVBAR_MIN_WIDTH = 86
const NAVBAR_MAX_WIDTH = 300
const INITIAL_RESIZE_SIZES = { navbar: NAVBAR_MAX_WIDTH }

type NavbarLink = {
  icon: LucideIcon
  labelKey: string
}

type NavbarSection = {
  title: string
  navLinks: readonly NavbarLink[]
}

type LayoutProps = {
  navSections: readonly NavbarSection[]
}

export function Layout({ navSections }: LayoutProps) {
  const { t } = useTranslation('presentation')
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [expandedWidth, setExpandedWidth] = useState(NAVBAR_MAX_WIDTH)
  const [currentWidth, setCurrentWidth] = useState(NAVBAR_MAX_WIDTH)
  const navLinksRef = useRef<HTMLDivElement>(null)
  const isCollapsed = currentWidth < NAVBAR_MIN_WIDTH + 1
  const resize = useAppShellResize({
    navbar: {
      min: NAVBAR_MIN_WIDTH,
      max: NAVBAR_MAX_WIDTH,
      label: t('layout.resizeNavbar'),
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
  }, [currentWidth, isCollapsed, navSections, resize.navbar])

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
      classNames={{ header: css.header, resizeHandle: css.resizeHandle }}
    >
      <AppShell.Header>
        <Group className={css.headerGroup}>
          <Burger
            className={css.burger}
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
            aria-label={t('layout.burgerLabel')}
          />
          <Burger
            className={css.burger}
            opened={!isCollapsed}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
            aria-label={t('layout.burgerLabel')}
          />
          <BrandLogo header />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={css.navbar}>
        <AppShell.Section className={css.navbarSection}>
          <span className={`${css.navbarText} ${isCollapsed ? css.navbarTextCollapsed : ''}`}>
            {t('layout.header')}
          </span>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea} className={css.navBar}>
          <div ref={navLinksRef} className={css.navLinksRef}>
            {navSections.map((navSection) => {
              return (
                <div className={css.navSection} key={navSection.title}>
                  <Title
                    size="lg"
                    ml="sm"
                    className={`${css.navSectionTitle} 
                    ${isCollapsed ? css.navbarTextCollapsed : ''}`}
                  >
                    {t(navSection.title as never)}
                  </Title>

                  {navSection.navLinks.map((navLink) => {
                    const Icon = navLink.icon
                    const label = t(navLink.labelKey as never)
                    const icon = (
                      <span className={css.navLinkIcon}>
                        <Icon />
                      </span>
                    )

                    return (
                      <NavLink
                        href="#"
                        key={navLink.labelKey}
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
              )
            })}
          </div>
        </AppShell.Section>

        <AppShell.Section className={css.navbarSection}>
          <span className={`${css.navbarText} ${isCollapsed ? css.navbarTextCollapsed : ''}`}>
            {t('layout.footer')}
          </span>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
