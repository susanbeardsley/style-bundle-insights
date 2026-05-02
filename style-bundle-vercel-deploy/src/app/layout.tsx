import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Style Bundle — Gifting Insights Engine',
  description: 'Internal source-of-truth tool for the strategy, marketing and buying teams to navigate gifting occasions, sentiments, personas and bundle archetypes.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-ivory-100 antialiased">
        {children}
      </body>
    </html>
  );
}
