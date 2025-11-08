'use client';

import { PropsWithChildren } from 'react';

export function ThemeProvider({ children }: PropsWithChildren) {
  return <div className="min-h-screen">{children}</div>;
}
