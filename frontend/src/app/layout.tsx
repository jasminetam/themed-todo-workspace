import './globals.css';
import { QueryProvider } from '@/lib/query';
import { ThemeProvider } from '@/theme/ThemeProvider';
import Providers from './providers';
export const metadata = { title: 'Themed Todo' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
