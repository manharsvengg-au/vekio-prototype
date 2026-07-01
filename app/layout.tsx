import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vekio — Professional Identity',
  description: 'One professional identity. Trusted everywhere.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
