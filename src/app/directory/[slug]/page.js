import { getDirectory } from "@/lib/wp";
import Link from "next/link";
import { notFound } from "next/navigation";

// Helper for social icons
const SocialLink = ({ url, icon, label, color }) => {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="social-pill" style={{ '--brand-color': color }}>
      <i className={`fa-brands fa-${icon}`}></i>
      <span>{label}</span>
    </a>
  );
};

export default async function DirectorySingle({ params }) {
  const { slug } = await params;
  const post = await getDirectory(slug);

  if (!post) notFound();

  const acf = post.acf || {};
  
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/" className="btn" style={{ background: '#f1f5f9', color: 'var(--primary)', border: 'none', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-arrow-right"></i> العودة للدليل
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
        {/* Main Content */}
        <main className="glass animate-fade-in" style={{ padding: '3rem', background: '#fff' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#0f172a' }} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          
          <div className="content-section" style={{ marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1rem', opacity: 0.6 }}>عن النشاط</h3>
            <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#334155' }}>
              {acf.description ? (
                 <p style={{ whiteSpace: 'pre-wrap' }}>{acf.description}</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
              )}
            </div>
          </div>

          {acf.notes && (
            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '1rem', borderRight: '4px solid var(--primary)' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>ملاحظات إضافية</h4>
              <p style={{ margin: 0, color: '#475569' }}>{acf.notes}</p>
            </div>
          )}

          {/* Social Links Grid */}
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ marginBottom: '1.5rem', opacity: 0.6 }}>التواصل الاجتماعي</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <SocialLink url={acf.facebook} icon="facebook" label="Facebook" color="#1877F2" />
              <SocialLink url={acf.instagram} icon="instagram" label="Instagram" color="#E4405F" />
              <SocialLink url={acf.twitter} icon="twitter" label="Twitter" color="#1DA1F2" />
              <SocialLink url={acf.linkedIn} icon="linkedin" label="LinkedIn" color="#0A66C2" />
              <SocialLink url={acf.youtube} icon="youtube" label="YouTube" color="#FF0000" />
              <SocialLink url={acf.telegram} icon="telegram" label="Telegram" color="#26A5E4" />
              <SocialLink url={acf.behance} icon="behance" label="Behance" color="#0057ff" />
            </div>
          </div>
        </main>

        {/* Sidebar Info */}
        <aside className="animate-fade-in" style={{ position: 'sticky', top: '2rem' }}>
          <div className="glass" style={{ padding: '2rem', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#fff', fontSize: '2rem' }}>
                <i className="fa-solid fa-address-card"></i>
              </div>
              <h3 style={{ margin: 0 }}>بيانات الاتصال</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Phone Section */}
              <div className="contact-item">
                <label><i className="fa-solid fa-phone"></i> رقم الهاتف</label>
                <p>{acf.phone || 'غير متوفر'}</p>
                {acf.phone && (
                  <a href={`tel:${acf.phone}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    اتصال هاتفي
                  </a>
                )}
              </div>

              {/* WhatsApp Section */}
              {acf.whatsapp && (
                <div className="contact-item">
                  <label><i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> واتساب</label>
                  <p>{acf.whatsapp}</p>
                  <a href={`https://wa.me/${acf.whatsapp.replace(/\D/g,'')}`} target="_blank" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', background: '#25D366', color: '#fff' }}>
                    إرسال رسالة
                  </a>
                </div>
              )}

              {/* Address Section */}
              <div className="contact-item">
                <label><i className="fa-solid fa-location-dot"></i> العنوان</label>
                <p style={{ fontSize: '0.95rem' }}>{acf.address || 'غير محدد حالياً'}</p>
                {acf.google_map && (
                  <a href={acf.google_map} target="_blank" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', background: '#f1f5f9', color: '#0f172a' }}>
                    فتح في الخريطة
                  </a>
                )}
              </div>

              {/* Digital Assets */}
              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {acf.website && (
                  <a href={acf.website} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <i className="fa-solid fa-globe"></i> زيارة الموقع الإلكتروني
                  </a>
                )}
                {acf.email && (
                  <a href={`mailto:${acf.email}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <i className="fa-solid fa-envelope"></i> مراسلة البريد الإلكتروني
                  </a>
                )}
                {acf.cv && (
                  <a href={acf.cv} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <i className="fa-solid fa-file-pdf"></i> تحميل الملف التعريفي (CV)
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
