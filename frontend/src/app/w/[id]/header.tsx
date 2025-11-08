'use client';

import { FC } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { applyThemeNow } from '@/theme/useApplyTheme';

interface HeaderProps {
  workspaceId: string;
}

export const Header: FC<HeaderProps> = ({ workspaceId }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6" component="div">
            Workspace {workspaceId}
          </Typography>
        </Box>
        <button
          className="rounded border px-3 py-1"
          onClick={() => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyThemeNow({
              mode: isDark ? 'light' : 'dark',
              primaryColor:
                getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() ||
                '#3b82f6',
              accentColor:
                getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
                '#22c55e',
              radius:
                Number(
                  getComputedStyle(document.documentElement)
                    .getPropertyValue('--radius')
                    .replace('px', ''),
                ) || 10,
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
