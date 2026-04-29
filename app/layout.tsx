import type {Metadata} from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Tân Gia Huy | Tinh hoa vật liệu hoàn thiện',
  description: 'Tân Gia Huy - Giải pháp gạch ốp lát khổ lớn và thiết bị vệ sinh cao cấp cho không gian sống hiện đại.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className={`${montserrat.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
