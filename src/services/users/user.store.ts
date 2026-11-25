import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  search: string
  selectedUserId: number | null
  setSearch: (search: string) => void
  selectUser: (id: number | null) => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      search: '',
      selectedUserId: null,
      setSearch: (search) => set({ search }),
      selectUser: (selectedUserId) => set({ selectedUserId }),
      reset: () => set({ search: '', selectedUserId: null }),
    }),
    {
      name: 'vantax-users',
      partialize: (state) => ({ search: state.search }),
    },
  ),
)
