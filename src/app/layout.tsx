import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SessionProvider from '@/components/auth/SessionProvider';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'HeyRoomie - Find Your Perfect Roommate in NYC',
  description: 'A roommate matching platform for young professionals in NYC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <SessionProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
