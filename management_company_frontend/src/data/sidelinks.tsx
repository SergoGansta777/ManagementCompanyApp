import {
  IconAlertTriangle,
  IconLayoutDashboard,
  IconMoneybag,
  IconReport,
  IconUsers
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Статистика',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />
  },
  {
    title: 'Сотрудники',
    label: '',
    href: '/employees',
    icon: <IconUsers size={18} />
  },
  {
    title: 'Аварии',
    label: '',
    href: '/incidents',
    icon: <IconAlertTriangle size={18} />
  },
  {
    title: 'Ремонты',
    label: '',
    href: '/repairs',
    icon: <IconReport size={18} />
  },
  {
    title: 'Финансы',
    label: '',
    href: '/finances',
    icon: <IconMoneybag size={18} />
  }
]
