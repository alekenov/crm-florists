// Hook for switching between localStorage and API modes
import { useState, useEffect } from 'react';

export type AppMode = 'localStorage' | 'api';

const APP_MODE_KEY = 'flowerShop_appMode';

export function useAppMode() {
  const [mode, setMode] = useState<AppMode>(() => {
    // Check if API mode is available (environment variable set)
    const apiUrl = process.env.REACT_APP_API_URL;
    const savedMode = localStorage.getItem(APP_MODE_KEY) as AppMode;
    
    // If API URL is not configured, force localStorage mode
    if (!apiUrl) {
      return 'localStorage';
    }
    
    // Return saved mode or default to localStorage
    return savedMode || 'localStorage';
  });

  useEffect(() => {
    localStorage.setItem(APP_MODE_KEY, mode);
  }, [mode]);

  const switchToAPI = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      console.warn('API URL not configured. Cannot switch to API mode.');
      return false;
    }
    setMode('api');
    return true;
  };

  const switchToLocalStorage = () => {
    setMode('localStorage');
  };

  const isAPIAvailable = () => {
    return !!process.env.REACT_APP_API_URL;
  };

  return {
    mode,
    isAPIMode: mode === 'api',
    isLocalStorageMode: mode === 'localStorage',
    switchToAPI,
    switchToLocalStorage,
    isAPIAvailable,
  };
}