'use client';

import { FC } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { applyThemeNow } from '@/theme/useApplyTheme';

interface HeaderProps {
  workspaceId: string;
}

export const Header: FC<HeaderProps> = ({ workspaceId }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'var(--nav)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6" component="div">
            Workspace {workspaceId}
          </Typography>
        </Box>
        <button
          className="rounded-skin bg-primary ml-4 px-3 py-1 text-white"
          onClick={() => {
            const root = document.documentElement;
            const css = getComputedStyle(root);
            const isDark = root.getAttribute('data-theme') === 'dark';
            applyThemeNow({
              mode: isDark ? 'light' : 'dark',
              primaryColor: css.getPropertyValue('--primary').trim() || '#3b82f6',
              accentColor: css.getPropertyValue('--accent').trim() || '#22c55e',
              navColor: css.getPropertyValue('--nav').trim() || '#111827',
              radius: Number(css.getPropertyValue('--radius').replace('px', '')) || 10,
            });
          }}
        >
          Toggle
        </button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
