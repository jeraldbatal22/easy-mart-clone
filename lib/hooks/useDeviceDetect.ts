import { useState, useEffect } from 'react';

interface DeviceType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isSafari: boolean;
}

export const useDeviceDetect = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>({
    isMobile: false,
    isTablet: false,
    isDesktop: true, // Default to desktop
    isAndroid: false,
    isIOS: false,
    isSafari: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      // Client-side only
      if (typeof window === 'undefined') return;

      const userAgent = window.navigator.userAgent;

      // Regular expressions for device detection
      const mobileRegex =
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const tabletRegex = /iPad|Tablet|Kindle|PlayBook|Nexus 7|Nexus 10/i;
      const androidRegex = /Android/i;
      const iosRegex = /iPhone|iPad|iPod/i;
      const safariRegex = /^((?!chrome|android).)*safari/i;

      const isMobile =
        mobileRegex.test(userAgent) && !tabletRegex.test(userAgent);
      const isTablet = tabletRegex.test(userAgent);
      const isDesktop = !isMobile && !isTablet;
      const isAndroid = androidRegex.test(userAgent);
      const isIOS = iosRegex.test(userAgent);
      const isSafari = safariRegex.test(userAgent);

      setDeviceType({
        isMobile,
        isTablet,
        isDesktop,
        isAndroid,
        isIOS,
        isSafari,
      });
    };

    detectDevice();

    // Re-detect on window resize as a fallback (e.g., if user rotates device)
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};

export default useDeviceDetect;
