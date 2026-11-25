import type { IconType } from 'react-icons'
import { FiGrid, FiSettings, FiUsers } from 'react-icons/fi'

export interface NavigationItem {
  to: string
  label: string
  description: string
  icon: IconType
}

export const navigation: NavigationItem[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    description: 'Resumen general',
    icon: FiGrid,
  },
  {
    to: '/users',
    label: 'Usuarios',
    description: 'Gestión del equipo',
    icon: FiUsers,
  },
  {
    to: '/settings',
    label: 'Ajustes',
    description: 'Preferencias',
    icon: FiSettings,
  },
]
