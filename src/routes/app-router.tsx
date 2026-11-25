import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@/layout/app-layout'

export const appRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        lazy: async () => {
          const { DashboardPage } = await import(
            '@/pages/dashboard/dashboard-page'
          )
          return { Component: DashboardPage }
        },
      },
      {
        path: 'users',
        lazy: async () => {
          const { UsersPage } = await import('@/pages/users/users-page')
          return { Component: UsersPage }
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { SettingsPage } = await import(
            '@/pages/settings/settings-page'
          )
          return { Component: SettingsPage }
        },
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
