import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from './providers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VR Rookie Downloader',
  description: 'Catálogo organizado de downloads VR',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased flex flex-col min-h-screen`}>
        <Providers>
          <TooltipProvider>
            <Navbar />
            <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
            <Footer />
            <Toaster />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
