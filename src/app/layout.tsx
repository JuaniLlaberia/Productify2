import NextTopLoader from 'nextjs-toploader';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Productify',
  description:
    'We are a project management plataform focus in making your team more productive when working together. Create custome task boards to track your progress and comunicate with your team at any time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang='en'>
        <body className={GeistSans.className}>
          <NextTopLoader showSpinner={false} />
          <Toaster />
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            <main className='h-screen bg-background text-primary'>
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
