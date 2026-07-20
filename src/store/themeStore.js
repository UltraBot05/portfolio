import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = [
  { id: 'default', label: 'Default' },
  { id: 'catppuccin', label: 'Catppuccin' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'dracula', label: 'Dracula' },
];

export const useThemeStore = create(
  persist(
    (set) => ({
      accent: 'default',
      setAccent: (accent) => set({ accent }),
      isPickerOpen: false,
      openPicker: () => set({ isPickerOpen: true }),
      closePicker: () => set({ isPickerOpen: false }),
    }),
    {
      name: 'b3ast-theme',
      partialize: (state) => ({ accent: state.accent }), // Only persist the accent
    }
  )
);
