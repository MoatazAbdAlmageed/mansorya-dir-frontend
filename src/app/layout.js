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
      <body className={cairo.className}>
        <nav className="glass" style={{ margin: '1rem', position: 'sticky', top: '1rem', zIndex: 100, background: 'linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%)', border: 'none' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.5rem' }}>
            <Link href="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
              <span style={{ color: 'var(--accent)' }}>دليل</span> المنصورية
            </Link>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>الأدلة</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="container-fluid" style={{ margin: '4rem 0 0 0', padding: '4rem 2rem', background: '#002e2a', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
          <div className="container">
            <p style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#fff' }}>دليل المنصورية</p>
            <p>© 2026 جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
