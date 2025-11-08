import './globals.css';
import { QueryProvider } from '@/lib/query';
import { ThemeProvider } from '@/theme/ThemeProvider';

export const metadata = { title: 'Themed Todo' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
