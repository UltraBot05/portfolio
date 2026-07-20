import { useMemo } from 'react';

export const useDeviceDetection = () => {
  return useMemo(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /Android/.test(ua);
    const isMobileWidth = window.innerWidth < 768;

    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    if (isMobileWidth) return 'mobile';
    return 'desktop';
  }, []);
};
