import type { Metadata } from 'next';
import { DM_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/storefront/cart/CartContext';
import CartModal from '@/components/storefront/cart/CartModal';

const outfit = Outfit({ subsets: ['latin'], weight: ['100', '300', '400'], variable: '--font-body' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'Globs-By Limited – Your Premium Stationery Partner',
  description: 'Office, school, and art supplies delivered across Tanzania.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${dmSans.variable} font-body font-normal antialiased`}>
        <CartProvider>
          {children}
          <CartModal />
        </CartProvider>
      </body>
    </html>
  );
}
