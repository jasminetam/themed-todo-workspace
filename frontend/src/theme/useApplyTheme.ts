'use client';
import { useEffect } from 'react';

function getContrastingTextColor(hex?: string): string {
  if (!hex) return '#111827'; // default

  // strip leading #
  const h = hex.replace('#', '');
  if (h.length !== 6) return '#111827';

  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return '#111827';
  }

  // relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // darker backgrounds → white text, lighter → dark text
  return luminance < 0.5 ? '#ffffff' : '#111827';
}

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

  if (theme.primaryColor) {
    root.style.setProperty('--primary', theme.primaryColor);
  }
  if (theme.accentColor) {
    root.style.setProperty('--accent', theme.accentColor);
  }
  if (theme.navColor) {
    root.style.setProperty('--nav', theme.navColor);

    // compute and set contrasting text color for nav areas (e.g. header)
    const navFg = getContrastingTextColor(theme.navColor);
    root.style.setProperty('--nav-foreground', navFg);
  }

  if (typeof theme.radius === 'number') {
    root.style.setProperty('--radius', `${theme.radius}px`);
  }

  if (theme.mode) {
    root.setAttribute('data-theme', theme.mode === 'dark' ? 'dark' : 'light');
  }
}

export function useApplyTheme(theme?: Theme) {
  useEffect(() => {
    if (!theme) return;
    applyThemeNow({
      mode: theme.mode,
      primaryColor: theme.primaryColor,
      accentColor: theme.accentColor,
      navColor: theme.navColor,
      radius: theme.radius,
    });
  }, [theme?.mode, theme?.primaryColor, theme?.accentColor, theme?.navColor, theme?.radius]);
}
