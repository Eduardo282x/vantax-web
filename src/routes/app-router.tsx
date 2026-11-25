import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@/layout/app-layout'

async function loadPlaceholder() {
  const { ModulePlaceholderPage } = await import(
    '@/pages/module-placeholder-page'
  )
  return { Component: ModulePlaceholderPage }
}

async function loadDashboard() {
  const { DashboardPage } = await import('@/pages/dashboard/dashboard-page')
  return { Component: DashboardPage }
}

async function loadUsers() {
  const { UsersPage } = await import('@/pages/users/users-page')
  return { Component: UsersPage }
}

async function loadSettings() {
  const { SettingsPage } = await import('@/pages/settings/settings-page')
  return { Component: SettingsPage }
}

export const appRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/inicio" replace />,
      },
      {
        path: 'inicio',
        lazy: loadDashboard,
      },
      {
        path: 'inicio/alertas',
        lazy: loadPlaceholder,
      },
      {
        path: 'inicio/actividad',
        lazy: loadPlaceholder,
      },
      {
        path: 'ventas/*',
        lazy: loadPlaceholder,
      },
      {
        path: 'inventario/*',
        lazy: loadPlaceholder,
      },
      {
        path: 'compras/*',
        lazy: loadPlaceholder,
      },
      {
        path: 'reportes/*',
        lazy: loadPlaceholder,
      },
      {
        path: 'configuracion',
        lazy: loadSettings,
      },
      {
        path: 'configuracion/usuarios',
        lazy: loadUsers,
      },
      {
        path: 'configuracion/roles',
        lazy: loadPlaceholder,
      },
      {
        path: 'configuracion/datos',
        lazy: loadPlaceholder,
      },
      {
        path: 'dashboard',
        element: <Navigate to="/inicio" replace />,
      },
      {
        path: 'users',
        element: <Navigate to="/configuracion/usuarios" replace />,
      },
      {
        path: 'settings',
        element: <Navigate to="/configuracion" replace />,
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundPage } = await import('@/pages/not-found-page')
      return { Component: NotFoundPage }
    },
  },
])
