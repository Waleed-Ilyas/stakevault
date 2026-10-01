import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StakeVault',
  description: 'Devnet-only staking dashboard prototype for a SPL token vault.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
