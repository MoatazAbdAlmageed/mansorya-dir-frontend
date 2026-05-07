import "./globals.css";
import Link from "next/link";
import { Cairo } from "next/font/google";

import ScrollToTop from "@/components/ScrollToTop";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata = {
  title: "دليل المنصورية",
  description: "دليل الخدمات والأعمال الشامل لمنطقة المنصورية",
  manifest: '/manifest.json',
  themeColor: '#009688',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'المنصورية',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className={cairo.className}>
        <nav className="glass" style={{ 
          margin: '1.5rem 1rem', 
          position: 'sticky', 
          top: '1.5rem', 
          zIndex: 100, 
          background: 'linear-gradient(135deg, #00796b 0%, #004d40 100%)', 
          border: 'none',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.8rem' }}>
            <Link href="/" style={{ textDecoration: 'none', fontSize: '1.6rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--accent)', textShadow: '0 2px 10px rgba(255, 193, 7, 0.3)' }}>دليل</span> المنصورية
            </Link>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <Link 
                href="/add-business" 
                style={{ 
                  color: 'var(--accent)', 
                  textDecoration: 'none', 
                  fontWeight: '700',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '1rem',
                  fontSize: '0.95rem',
                  border: '1px solid rgba(255,193,7,0.4)',
                  transition: 'all 0.3s ease'
                }}
                className="nav-btn"
              >
                أضف عملك
              </Link>
              <a 
                href="https://www.facebook.com/groups/mansorya" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  textDecoration: 'none', 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '0.6rem 1.2rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease'
                }}
                className="nav-btn"
              >
                <i className="fa-brands fa-facebook" style={{ fontSize: '1.2rem' }}></i>
                <span>الجروب</span>
              </a>
            </div>
          </div>
        </nav>

        <main>{children}</main>
        
        <ScrollToTop />
        <PWAInstallPrompt />

        <a 
          href="https://wa.me/201150064746" 
          className="whatsapp-balloon" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="تواصل معنا عبر واتساب"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>

        <footer className="container-fluid" style={{ margin: '4rem 0 0 0', padding: '5rem 2rem', background: '#002e2a', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
          <div className="container">
            <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.8rem' }}>دليل المنصورية</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginBottom: '2.5rem' }}>
              <a href="https://www.facebook.com/groups/mansorya" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
                <i className="fa-brands fa-facebook"></i> فيسبوك
              </a>
              <a href="https://wa.me/201150064746" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
                <i className="fa-brands fa-whatsapp"></i> واتساب
              </a>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2.5rem' }}>
              <p>© 2026 دليل المنصورية. جميع الحقوق محفوظة.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.5 }}>خدمة مجانية لخدمة أهالي المنصورية</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
