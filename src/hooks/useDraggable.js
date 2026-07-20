import { useRef, useCallback, useState } from 'react';
import { useWindowStore } from '../store/windowStore';

const STATUSBAR_H = 44;

// Window drag via pointer events (covers mouse + touch/tablet with one API).
// Returns { onPointerDown, dragging } - attach the handler to the titlebar.
// `dragging` lets the Window zero out its spring transition during the drag
// so the window tracks the pointer 1:1 instead of elastically chasing it.
export function useDraggable(id, disabled = false) {
  const move = useWindowStore(s => s.move);
  const [dragging, setDragging] = useState(false);
  const dragState = useRef(null);

  const onPointerDown = useCallback((e) => {
    if (disabled) return;
    // Ignore drags starting on titlebar buttons (traffic lights, maximize)
    if (e.target.closest('button')) return;

    const win = useWindowStore.getState().windows[id];
    if (!win) return;

    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: win.position.x,
      originY: win.position.y,
      width: win.size.width,
      height: win.size.height,
    };
    setDragging(true);
    e.preventDefault();

    const onMove = (ev) => {
      const d = dragState.current;
      if (!d) return;
      const rawX = d.originX + (ev.clientX - d.startX);
      const rawY = d.originY + (ev.clientY - d.startY);
      // Clamp to viewport; y never goes under the status bar
      const x = Math.min(Math.max(rawX, 0), Math.max(0, window.innerWidth - d.width));
      const y = Math.min(Math.max(rawY, STATUSBAR_H), Math.max(STATUSBAR_H, window.innerHeight - d.height));
      move(id, { x, y });
    };

    const onUp = () => {
      dragState.current = null;
      setDragging(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [id, disabled, move]);

  return { onPointerDown, dragging };
}
