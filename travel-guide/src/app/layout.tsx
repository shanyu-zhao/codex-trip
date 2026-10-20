import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '旅行攻略 - 中国10大热门景点',
  description: '为您提供中国10大热门旅行景点的详细攻略，包括故宫、长城、西湖、桂林山水等',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang=""zh-CN"">
      <body className='min-h-screen bg-background antialiased'>
        <header className='sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm'>
          <div className='container mx-auto flex h-16 items-center justify-between px-4'>
            <a href='/' className='flex items-center gap-2'>
              <div className='text-2xl'>???</div>
              <span className='text-xl font-bold text-primary'>旅行攻略</span>
            </a>
            <nav className='flex items-center gap-6'>
              <a href='/' className='text-sm font-medium hover:text-primary transition-colors'>
                首页
              </a>
              <a href='/#destinations' className='text-sm font-medium hover:text-primary transition-colors'>
                目的地
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className='border-t bg-white py-8'>
          <div className='container mx-auto px-4 text-center text-sm text-gray-500'>
            <p>? 2026 旅行攻略 - 中国10大热门景点详细攻略</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
