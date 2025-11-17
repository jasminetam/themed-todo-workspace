'use client';

import { FC } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton } from '@mui/material';
import { useSession, signIn, signOut } from 'next-auth/react';
import { applyThemeNow } from '@/theme/useApplyTheme';

interface HeaderProps {
  workspaceId?: string | null;
}

export const Header: FC<HeaderProps> = ({ workspaceId }) => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const title = workspaceId ? `Workspace ${workspaceId}` : 'Your Workspaces';

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'var(--nav)',
        color: 'var(--nav-foreground)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Dark / Light toggle */}
            <button
              className="px-3 py-1"
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 0,
                borderRadius: 'var(--radius)',
              }}
              onClick={() => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const cs = getComputedStyle(document.documentElement);
                applyThemeNow({
                  mode: isDark ? 'light' : 'dark',
                  primaryColor: cs.getPropertyValue('--primary').trim() || '#3b82f6',
                  accentColor: cs.getPropertyValue('--accent').trim() || '#22c55e',
                  radius: Number(cs.getPropertyValue('--radius').replace('px', '')) || 10,
                } as any);
              }}
            >
              Toggle
            </button>

            {status === 'authenticated' ? (
              <>
                <IconButton sx={{ p: 0 }}>
                  <Avatar
                    sx={{ width: 32, height: 32 }}
                    src={user?.image ?? undefined}
                    alt={user?.name ?? 'User'}
                  />
                </IconButton>
                <button
                  className="px-3 py-1"
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 0,
                    borderRadius: 'var(--radius)',
                  }}
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                className="px-3 py-1"
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 0,
                  borderRadius: 'var(--radius)',
                }}
                onClick={() => signIn()}
              >
                Sign in
              </button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
