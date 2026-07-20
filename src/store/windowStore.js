import { create } from 'zustand';

let nextId = 1;

export const useWindowStore = create((set, get) => ({
  windows: {},
  zCounter: 10,

  open: (appId, props = {}) => {
    // If already open and not minimized, just focus it
    const existing = Object.values(get().windows).find(
      w => w.appId === appId && !w.minimized
    );
    if (existing) { get().focus(existing.id); return; }

    // If open but minimized, restore it instead of spawning a duplicate
    const minimized = Object.values(get().windows).find(
      w => w.appId === appId && w.minimized
    );
    if (minimized) { get().unminimize(minimized.id); return; }

    const id = `win-${nextId++}`;
    const z = get().zCounter + 1;
    const offset = Object.keys(get().windows).length;

    set(s => ({
      zCounter: z,
      windows: {
        ...s.windows,
        [id]: {
          id, appId, props,
          title: props.title || appId,
          zIndex: z,
          minimized: false,
          maximized: false,
          position: {
            x: 100 + (offset * 28) % 180,
            y: 48 + (offset * 22) % 120,
          },
          size: props.defaultSize || { width: 700, height: 500 },
        }
      }
    }));
  },

  close: (id) => set(s => {
    const { [id]: _, ...rest } = s.windows;
    return { windows: rest };
  }),

  focus: (id) => {
    const z = get().zCounter + 1;
    set(s => ({
      zCounter: z,
      windows: { ...s.windows, [id]: { ...s.windows[id], zIndex: z } }
    }));
  },

  minimize: (id) => set(s => ({
    windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } }
  })),

  unminimize: (id) => {
    const z = get().zCounter + 1;
    set(s => ({
      zCounter: z,
      windows: { ...s.windows, [id]: { ...s.windows[id], minimized: false, zIndex: z } }
    }));
  },

  toggleMaximize: (id) => set(s => ({
    windows: {
      ...s.windows,
      [id]: { ...s.windows[id], maximized: !s.windows[id].maximized }
    }
  })),

  move: (id, position) => set(s => ({
    windows: { ...s.windows, [id]: { ...s.windows[id], position } }
  })),

  resize: (id, size) => set(s => ({
    windows: { ...s.windows, [id]: { ...s.windows[id], size } }
  })),
}));
