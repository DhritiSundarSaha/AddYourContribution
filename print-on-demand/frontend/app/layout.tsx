import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Print on Demand Studio',
  description: 'Full-stack POD app with AI designer'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex flex-wrap items-center gap-3">
          <Link href="/" className="rounded bg-slate-800 px-3 py-2">Catalog</Link>
          <Link href="/studio" className="rounded bg-slate-800 px-3 py-2">Design Studio</Link>
          <Link href="/checkout" className="rounded bg-slate-800 px-3 py-2">Checkout</Link>
          <Link href="/admin" className="rounded bg-slate-800 px-3 py-2">Admin</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
