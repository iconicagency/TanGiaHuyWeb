import type {Metadata} from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Eurotile - Kiệt tác gạch men',
  description: 'Eurotile là thương hiệu dẫn đầu về phong cách thiết kế và xu hướng thẩm mỹ trong ngành gạch kiến trúc tại Việt Nam.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className={`${montserrat.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-white text-stone-900">
        {children}
      </body>
    </html>
  );
}
