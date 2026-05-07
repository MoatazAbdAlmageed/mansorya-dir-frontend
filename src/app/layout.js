import "./globals.css";
import Link from "next/link";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata = {
  title: "دليل المنصورية",
  description: "دليل الخدمات والأعمال الشامل لمنطقة المنصورية",
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
        <nav className="glass" style={{ margin: '1rem', position: 'sticky', top: '1rem', zIndex: 100, background: 'linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%)', border: 'none' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.5rem' }}>
            <Link href="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
              <span style={{ color: 'var(--accent)' }}>دليل</span> المنصورية
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>الأدلة</Link>
              <Link 
                href="/add-business" 
                style={{ 
                  color: 'var(--accent)', 
                  textDecoration: 'none', 
                  fontWeight: '700',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255,193,7,0.3)'
                }}
              >
                أضف عملك
              </Link>
              <a 
                href="https://www.facebook.com/groups/mansorya" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.9rem' }}
              >
                <i className="fa-brands fa-facebook" style={{ fontSize: '1.1rem' }}></i>
                <span>الجروب</span>
              </a>
            </div>
          </div>
        </nav>

        <main>{children}</main>

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
