import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import CropSquareRounded from '@mui/icons-material/CropSquareRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useWindowStore } from '../../store/windowStore';
import { useDraggable } from '../../hooks/useDraggable';

const STATUSBAR_H = 44;
const MIN_W = 340;
const MIN_H = 240;
const SPRING = { type: 'spring', stiffness: 380, damping: 30 };
const INSTANT = { duration: 0 };

const MotionPaper = motion.create(Paper);

export default function Window({ windowData, children }) {
  const { id, title, zIndex, maximized, position, size } = windowData;
  const { close, focus, minimize, toggleMaximize, resize } = useWindowStore();
  const { onPointerDown: onDragStart, dragging } = useDraggable(id, maximized);
  const [resizing, setResizing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current?.querySelector('input, button, textarea, select, a[href], [tabindex]');
    el?.focus?.();
  }, []);

  const onResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const start = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
    setResizing(true);
    const onMove = (ev) => resize(id, {
      width: Math.max(MIN_W, start.w + (ev.clientX - start.x)),
      height: Math.max(MIN_H, start.h + (ev.clientY - start.y)),
    });
    const onUp = () => {
      setResizing(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [id, size, resize]);

  const geometry = maximized
    ? { left: 0, top: STATUSBAR_H, width: '100vw', height: `calc(100vh - ${STATUSBAR_H}px)` }
    : { left: position.x, top: position.y, width: size.width, height: size.height };
  const geoT = (dragging || resizing) ? INSTANT : SPRING;

  return (
    <MotionPaper
      elevation={8}
      onPointerDown={() => focus(id)}
      role="dialog"
      aria-label={title}
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0, ...geometry }}
      exit={{ opacity: 0, scale: 0.9, y: 8, transition: { duration: 0.14 } }}
      transition={{ ...SPRING, left: geoT, top: geoT, width: geoT, height: geoT }}
      sx={{
        position: 'absolute',
        zIndex,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        // px string on purpose: numeric sx radii multiply shape.borderRadius
        // (12), which made this 48px and clipped the title-bar buttons
        borderRadius: maximized ? 0 : '16px',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'surface.low',
      }}
    >
      {/* Title bar */}
      <Box
        onPointerDown={onDragStart}
        onDoubleClick={() => toggleMaximize(id)}
        sx={{
          height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1, pl: 2, pr: 0.5,
          bgcolor: 'surface.high', borderBottom: 1, borderColor: 'divider',
          cursor: 'grab', userSelect: 'none', touchAction: 'none',
        }}
      >
        <Typography variant="body2" sx={{ flex: 1, fontFamily: 'var(--font-mono)', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </Typography>
        <IconButton size="small" aria-label="Minimize" onClick={() => minimize(id)}><RemoveRounded fontSize="small" /></IconButton>
        <IconButton size="small" aria-label="Maximize" onClick={() => toggleMaximize(id)}><CropSquareRounded sx={{ fontSize: 16 }} /></IconButton>
        <IconButton size="small" aria-label="Close" onClick={() => close(id)} sx={{ '&:hover': { color: 'error.main' } }}><CloseRounded fontSize="small" /></IconButton>
      </Box>

      {/* Content */}
      <Box ref={contentRef} sx={{ flex: 1, overflow: 'auto', position: 'relative', bgcolor: 'background.paper' }}>
        {children}
      </Box>

      {!maximized && (
        <Box
          onPointerDown={onResizeStart}
          aria-hidden
          sx={{
            position: 'absolute', right: 0, bottom: 0, width: 16, height: 16,
            cursor: 'nwse-resize', touchAction: 'none',
            background: (t) => `linear-gradient(135deg, transparent 50%, ${t.vars.palette.surface.outlineVariant} 50%)`,
          }}
        />
      )}
    </MotionPaper>
  );
}
