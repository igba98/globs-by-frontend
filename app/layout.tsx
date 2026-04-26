import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/storefront/cart/CartContext';
import CartModal from '@/components/storefront/cart/CartModal';

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
      <body className="font-body font-normal antialiased">
        <CartProvider>
          {children}
          <CartModal />
        </CartProvider>
      </body>
    </html>
  );
}
