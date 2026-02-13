import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  backgroundBlur: number;
  setBackgroundBlur: (blur: number) => void;
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  backgroundImage: null,
  setBackgroundImage: () => null,
  backgroundBlur: 0,
  setBackgroundBlur: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    () => localStorage.getItem('background-image') || null
  );

  const [backgroundBlur, setBackgroundBlur] = useState<number>(
    () => parseInt(localStorage.getItem('background-blur') || '0', 10)
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      // Ensure we listen for system theme changes if user selected 'system'
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
          root.classList.remove('light', 'dark');
          root.classList.add(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    backgroundImage,
    setBackgroundImage: (url: string | null) => {
      if (url) {
        localStorage.setItem('background-image', url);
      } else {
        localStorage.removeItem('background-image');
      }
      setBackgroundImage(url);
    },
    backgroundBlur,
    setBackgroundBlur: (blur: number) => {
      localStorage.setItem('background-blur', blur.toString());
      setBackgroundBlur(blur);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};