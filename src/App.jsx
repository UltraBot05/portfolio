import { useDeviceDetection } from './hooks/useDeviceDetection';
import Desktop from './components/os/Desktop';
import MobileOS from './components/mobile/MobileOS';
import WritePage from './components/write/WritePage';

// The rootkit egg and konami unlock must be re-earned every visit:
// sessionStorage survives reloads within a tab, so clear the flags at page
// load (module scope runs exactly once per load, before any terminal command
// can check them).
if (typeof sessionStorage !== 'undefined') {
  sessionStorage.removeItem('rootkit_unlocked');
  sessionStorage.removeItem('konami_unlocked');
}

export default function App() {
  // Hidden admin route: /write renders the blog editor, nothing else.
  // Not linked anywhere in the UI — access by typing the URL directly.
  if (window.location.pathname === '/write') {
    return <WritePage />;
  }

  const device = useDeviceDetection();

  if (device === 'ios' || device === 'android' || device === 'mobile') {
    return <MobileOS device={device} />;
  }
  return <Desktop />;
}
