import { AppShell, Burger, FloatingIndicator, Group, NavLink, ScrollArea, Tooltip, Title } from '@mantine/core'
import { useAppShellResize } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BrandLogo } from '@/presentation/components/BrandLogo'
import css from './index.module.scss'

const NAVBAR_MIN_WIDTH = 86
const NAVBAR_MAX_WIDTH = 300
const NAVBAR_TRANSITION_DURATION = 420
const INITIAL_RESIZE_SIZES = { navbar: NAVBAR_MAX_WIDTH }

type NavbarLink = {
  icon: LucideIcon
  labelKey: string
  to?: string
}

type NavbarSection = {
  title: string
  navLinks: readonly NavbarLink[]
}

type LayoutProps = {
  navSections: readonly NavbarSection[]
}

type NavbarNavLinkProps = {
  navLink: NavbarLink
  label: string
  isCollapsed: boolean
  isActive: boolean
  onActiveElementChange: (element: HTMLAnchorElement | null) => void
  onHover: (element: HTMLElement) => void
  onHoverEnd: () => void
  onNavigate: () => void
}

function normalizePathname(pathname: string) {
  return pathname.replace(/^\/(?:en|ru)(?=\/|$)/, '') || '/'
}

function isRouteActive(pathname: string, to: string) {
  const normalizedPathname = normalizePathname(pathname)

  return to === '/' ? normalizedPathname === '/' : normalizedPathname === to || normalizedPathname.startsWith(`${to}/`)
}

function NavbarNavLink({
  navLink,
  label,
  isCollapsed,
  isActive,
  onActiveElementChange,
  onHover,
  onHoverEnd,
  onNavigate,
}: NavbarNavLinkProps) {
  const setElement = useCallback(
    (element: HTMLAnchorElement | null) => {
      if (isActive) onActiveElementChange(element)
    },
    [isActive, onActiveElementChange]
  )
  const Icon = navLink.icon
  const icon = (
    <span className={css.navLinkIcon}>
      <Icon />
    </span>
  )
  const navLinkProps = {
    ref: setElement,
    leftSection: isCollapsed ? (
      <Tooltip label={label} position="right">
        {icon}
      </Tooltip>
    ) : (
      icon
    ),
    label,
    active: isActive,
    'aria-current': isActive ? ('page' as const) : undefined,
    onMouseEnter: (event: { currentTarget: HTMLElement }) => onHover(event.currentTarget),
    onMouseLeave: onHoverEnd,
    classNames: {
      root: css.navLink,
      section: css.navLinkSection,
      body: css.navLinkBody,
      label: `${css.navLinkLabel} ${isCollapsed ? css.navLinkLabelCollapsed : ''}`,
    },
  }

  return navLink.to ? (
    <NavLink component={Link} to={navLink.to} onClick={onNavigate} {...navLinkProps} />
  ) : (
    <NavLink href="#" {...navLinkProps} onClick={(event) => event.preventDefault()} />
  )
}

export function Layout({ navSections }: LayoutProps) {
  const { t } = useTranslation('presentation')
  const { pathname } = useLocation()
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure()
  const [expandedWidth, setExpandedWidth] = useState(NAVBAR_MAX_WIDTH)
  const [currentWidth, setCurrentWidth] = useState(NAVBAR_MAX_WIDTH)
  const [isNavbarAnimating, setIsNavbarAnimating] = useState(false)
  const [hoveredNavLink, setHoveredNavLink] = useState<HTMLElement | null>(null)
  const [activeNavLinkElement, setActiveNavLinkElement] = useState<HTMLAnchorElement | null>(null)
  const [navLinksElement, setNavLinksElement] = useState<HTMLDivElement | null>(null)
  const navLinksRef = useRef<HTMLDivElement>(null)
  const setNavLinksRef = useCallback((element: HTMLDivElement | null) => {
    navLinksRef.current = element
    setNavLinksElement(element)
  }, [])
  const isCollapsed = currentWidth < NAVBAR_MIN_WIDTH + 1
  const indicatorTarget = hoveredNavLink ?? activeNavLinkElement
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
    if (isCollapsed || isNavbarAnimating) {
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
  }, [currentWidth, isCollapsed, isNavbarAnimating, navSections, resize.navbar])

  const toggleDesktop = () => {
    const nextOpened = isCollapsed
    const nextWidth = nextOpened ? expandedWidth : NAVBAR_MIN_WIDTH

    setIsNavbarAnimating(true)
    setCurrentWidth(nextWidth)
    resize.navbar.setSize(nextWidth)
  }

  return (
    <AppShell
      className={css.layout}
      data-navbar-animating={isNavbarAnimating || undefined}
      header={{ height: { base: 48, sm: 60 } }}
      transitionDuration={NAVBAR_TRANSITION_DURATION}
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

      <AppShell.Navbar
        className={css.navbar}
        onTransitionEnd={(event) => {
          if (event.currentTarget === event.target && event.propertyName === 'width') {
            setIsNavbarAnimating(false)
          }
        }}
      >
        <AppShell.Section className={css.navbarSection}>
          <span className={`${css.navbarText} ${isCollapsed ? css.navbarTextCollapsed : ''}`}>
            {t('layout.header')}
          </span>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea} scrollbars="y" className={css.navBar}>
          <div ref={setNavLinksRef} className={css.navLinksRef}>
            <FloatingIndicator
              className={css.navIndicator}
              target={indicatorTarget}
              parent={navLinksElement}
              transitionDuration={260}
              aria-hidden="true"
            />
            {navSections.map((navSection) => {
              return (
                <div className={css.navSection} key={navSection.title}>
                  <Title
                    size="lg"
                    mb={5}
                    className={`${css.navSectionTitle} ${isCollapsed ? css.navSectionTitleCollapsed : ''}`}
                  >
                    {t(navSection.title as never)}
                  </Title>

                  {navSection.navLinks.map((navLink) => {
                    const label = t(navLink.labelKey as never)
                    const isActive = navLink.to ? isRouteActive(pathname, navLink.to) : false
                    return (
                      <NavbarNavLink
                        key={navLink.labelKey}
                        navLink={navLink}
                        label={label}
                        isCollapsed={isCollapsed}
                        isActive={isActive}
                        onActiveElementChange={setActiveNavLinkElement}
                        onHover={setHoveredNavLink}
                        onHoverEnd={() => setHoveredNavLink(null)}
                        onNavigate={closeMobile}
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
