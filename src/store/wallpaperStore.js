import { create } from 'zustand';

export const useWallpaperStore = create((set) => ({
  activeId: typeof localStorage !== 'undefined' ? (localStorage.getItem('b3astos_wallpaper') || 'default') : 'default',
  pickerOpen: false,
  setWallpaper: (id) => {
    localStorage.setItem('b3astos_wallpaper', id);
    set({ activeId: id, pickerOpen: false });
  },
  openPicker: () => set({ pickerOpen: true }),
  closePicker: () => set({ pickerOpen: false }),
}));
