import { getDirectory } from "@/lib/wp";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DirectorySingle({ params }) {
  const { slug } = await params;
  const post = await getDirectory(slug);

  if (!post) {
    notFound();
  }

  // ACF fields usually come in post.acf if the plugin is configured to show in REST
  const acf = post.acf || {};

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <Link href="/directory" style={{ color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', display: 'block' }}>
        ← العودة إلى كافة الأدلة
      </Link>
      
      <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem' }} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem' }}>
          <div>
            <div 
              style={{ fontSize: '1.1rem', color: 'var(--foreground)' }}
              dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
            />
          </div>
          
          <aside>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>تفاصيل العمل</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>رقم الهاتف</label>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{acf.phone_numbers || 'غير متوفر'}</p>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>العنوان</label>
                  <p style={{ fontSize: '1.1rem' }}>{acf.address || 'لا يوجد عنوان'}</p>
                </div>

                {acf.full_name && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>الشخص المسؤول</label>
                    <p style={{ fontSize: '1.1rem' }}>{acf.full_name}</p>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                اتصل الآن
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
