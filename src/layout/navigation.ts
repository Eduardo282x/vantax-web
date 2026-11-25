import type { IconType } from 'react-icons'
import {
  FiActivity,
  FiAlertTriangle,
  FiArchive,
  FiBarChart2,
  FiBox,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiHome,
  FiPackage,
  FiPieChart,
  FiPlusCircle,
  FiRepeat,
  FiRotateCcw,
  FiSettings,
  FiShield,
  FiShoppingCart,
  FiSliders,
  FiTag,
  FiTrendingUp,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'

export interface NavigationItem {
  to: string
  label: string
  description: string
  icon: IconType
  exact?: boolean
}

export interface NavigationArea {
  to: string
  label: string
  description: string
  icon: IconType
  items: NavigationItem[]
}

export const navigationAreas: NavigationArea[] = [
  {
    to: '/inicio',
    label: 'Inicio',
    description: 'Resumen general del negocio',
    icon: FiHome,
    items: [
      {
        to: '/inicio',
        label: 'Resumen',
        description: 'Indicadores generales',
        icon: FiGrid,
        exact: true,
      },
      {
        to: '/inicio/alertas',
        label: 'Alertas',
        description: 'Avisos y pendientes',
        icon: FiAlertTriangle,
      },
      {
        to: '/inicio/actividad',
        label: 'Actividad',
        description: 'Movimientos recientes',
        icon: FiActivity,
      },
    ],
  },
  {
    to: '/ventas',
    label: 'Ventas',
    description: 'Punto de venta y operaciones',
    icon: FiShoppingCart,
    items: [
      {
        to: '/ventas',
        label: 'Punto de venta',
        description: 'Registrar una venta',
        icon: FiShoppingCart,
        exact: true,
      },
      {
        to: '/ventas/historial',
        label: 'Historial',
        description: 'Ventas realizadas',
        icon: FiClock,
      },
      {
        to: '/ventas/comprobantes',
        label: 'Comprobantes',
        description: 'Documentos de venta',
        icon: FiFileText,
      },
      {
        to: '/ventas/devoluciones',
        label: 'Devoluciones',
        description: 'Gestión de devoluciones',
        icon: FiRotateCcw,
      },
    ],
  },
  {
    to: '/inventario',
    label: 'Inventario',
    description: 'Productos, existencias y precios',
    icon: FiBox,
    items: [
      {
        to: '/inventario',
        label: 'Productos',
        description: 'Catálogo de productos',
        icon: FiPackage,
        exact: true,
      },
      {
        to: '/inventario/movimientos',
        label: 'Movimientos',
        description: 'Entradas y salidas',
        icon: FiRepeat,
      },
      {
        to: '/inventario/existencias',
        label: 'Existencias',
        description: 'Stock disponible',
        icon: FiArchive,
      },
      {
        to: '/inventario/alertas',
        label: 'Alertas de stock',
        description: 'Productos por reponer',
        icon: FiAlertTriangle,
      },
      {
        to: '/inventario/precios',
        label: 'Precios inteligentes',
        description: 'Recomendaciones de precio',
        icon: FiTag,
      },
    ],
  },
  {
    to: '/compras',
    label: 'Compras',
    description: 'Adquisiciones y proveedores',
    icon: FiTruck,
    items: [
      {
        to: '/compras',
        label: 'Registrar compra',
        description: 'Nueva entrada de mercancía',
        icon: FiPlusCircle,
        exact: true,
      },
      {
        to: '/compras/historial',
        label: 'Historial',
        description: 'Compras registradas',
        icon: FiClock,
      },
      {
        to: '/compras/proveedores',
        label: 'Proveedores',
        description: 'Directorio de proveedores',
        icon: FiUsers,
      },
      {
        to: '/compras/entradas',
        label: 'Entradas de mercancía',
        description: 'Recepciones y costos',
        icon: FiTruck,
      },
    ],
  },
  {
    to: '/reportes',
    label: 'Reportes',
    description: 'Análisis y rentabilidad',
    icon: FiBarChart2,
    items: [
      {
        to: '/reportes',
        label: 'Resumen general',
        description: 'Vista consolidada',
        icon: FiPieChart,
        exact: true,
      },
      {
        to: '/reportes/ventas',
        label: 'Ventas',
        description: 'Análisis de ventas',
        icon: FiTrendingUp,
      },
      {
        to: '/reportes/inventario',
        label: 'Inventario',
        description: 'Estado del inventario',
        icon: FiPackage,
      },
      {
        to: '/reportes/compras',
        label: 'Compras',
        description: 'Análisis de compras',
        icon: FiTruck,
      },
      {
        to: '/reportes/rentabilidad',
        label: 'Rentabilidad',
        description: 'Márgenes y resultados',
        icon: FiDollarSign,
      },
      {
        to: '/reportes/analitica',
        label: 'Analítica predictiva',
        description: 'Recomendaciones de precio',
        icon: FiActivity,
      },
    ],
  },
  {
    to: '/configuracion',
    label: 'Configuración',
    description: 'Usuarios, permisos y preferencias',
    icon: FiSettings,
    items: [
      {
        to: '/configuracion/usuarios',
        label: 'Usuarios',
        description: 'Equipo con acceso al sistema',
        icon: FiUsers,
      },
      {
        to: '/configuracion/roles',
        label: 'Roles y permisos',
        description: 'Accesos por rol',
        icon: FiShield,
      },
      {
        to: '/configuracion/datos',
        label: 'Datos comerciales',
        description: 'Información del negocio',
        icon: FiBriefcase,
      },
      {
        to: '/configuracion',
        label: 'Preferencias',
        description: 'Apariencia y entorno',
        icon: FiSliders,
        exact: true,
      },
    ],
  },
]

export function isPathActive(
  pathname: string,
  to: string,
  exact = false,
): boolean {
  if (pathname === to) {
    return true
  }

  return !exact && pathname.startsWith(`${to}/`)
}

export function findAreaByPath(pathname: string): NavigationArea | null {
  return (
    navigationAreas.find((area) => isPathActive(pathname, area.to)) ?? null
  )
}

export function findItemByPath(
  pathname: string,
): { area: NavigationArea; item: NavigationItem } | null {
  for (const area of navigationAreas) {
    const item = area.items.find((entry) =>
      isPathActive(pathname, entry.to, entry.exact),
    )

    if (item) {
      return { area, item }
    }
  }

  return null
}
