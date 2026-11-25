import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface UiState {
  theme: Theme
  dockCollapsed: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setDockCollapsed: (collapsed: boolean) => void
  toggleDock: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      dockCollapsed: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setDockCollapsed: (dockCollapsed) => set({ dockCollapsed }),
      toggleDock: () =>
        set((state) => ({
          dockCollapsed: !state.dockCollapsed,
        })),
    }),
    {
      name: 'vantax-ui',
      partialize: (state) => ({
        theme: state.theme,
        dockCollapsed: state.dockCollapsed,
      }),
    },
  ),
)
