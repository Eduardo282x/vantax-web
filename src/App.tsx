import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'

import { Toaster } from '@/components/ui/sonner'
import { appRouter } from '@/routes/app-router'
import { queryClient } from '@/services/query-client'
import { useUiStore } from '@/services/ui/ui.store'

function App() {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
      <Toaster theme={theme} richColors position="top-right" />
    </QueryClientProvider>
  )
}

export default App
