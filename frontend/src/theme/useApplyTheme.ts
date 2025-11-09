'use client';
import { useEffect } from 'react';

export type Theme = {
  mode?: 'light' | 'dark';
  primaryColor?: string;
  accentColor?: string;
  navColor?: string;
  radius?: number;
};

export function applyThemeNow(
  theme: Pick<Theme, 'mode' | 'primaryColor' | 'accentColor' | 'navColor' | 'radius'>,
) {
  const root = document.documentElement;
  if (theme.primaryColor) root.style.setProperty('--primary', theme.primaryColor);
  if (theme.accentColor) root.style.setProperty('--accent', theme.accentColor);
  if (theme.navColor) root.style.setProperty('--nav', theme.navColor);
  if (typeof theme.radius === 'number') root.style.setProperty('--radius', `${theme.radius}px`);
  if (theme.mode) root.setAttribute('data-theme', theme.mode === 'dark' ? 'dark' : 'light');
}

export function useApplyTheme(theme?: Theme) {
  useEffect(() => {
    if (!theme) return;
    applyThemeNow(theme);
  }, [theme?.mode, theme?.primaryColor, theme?.accentColor, theme?.navColor, theme?.radius]);
}
