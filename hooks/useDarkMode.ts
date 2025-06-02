
import { useState, useEffect, useCallback } from 'react';

export const useDarkMode = (): [boolean, () => void] => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('darkMode');
      if (storedPreference !== null) {
        return JSON.parse(storedPreference);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default for SSR or non-browser environments
  });

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', JSON.stringify(newMode));
      }
      return newMode;
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if no explicit user preference is set
        if (localStorage.getItem('darkMode') === null) {
          setIsDarkMode(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);


  return [isDarkMode, toggleDarkMode];
};
    