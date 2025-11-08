'use client';

import { useEffect } from 'react';
import type { Theme } from '@/lib/api';

export function applyThemeNow(
  theme: Pick<Theme, 'mode' | 'primaryColor' | 'accentColor' | 'radius'>,
) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primaryColor);
  root.style.setProperty('--accent', theme.accentColor);
  root.style.setProperty('--radius', `${theme.radius}px`);
  root.setAttribute('data-theme', theme.mode === 'dark' ? 'dark' : 'light');
}

export function useApplyTheme(theme?: Theme) {
  useEffect(() => {
    if (!theme) return;
    applyThemeNow(theme);
  }, [theme]);
}
