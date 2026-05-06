import { getDirectories, getCategories } from "@/lib/wp";
import Link from "next/link";

export default async function DirectoryArchive() {
  let directories = [];
  let allCategories = [];

  try {
    const [cats, posts] = await Promise.all([
      getCategories(),
      getDirectories("?per_page=12&_embed")
    ]);
    
    allCategories = Array.isArray(cats) ? cats : [];
    directories = Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.error("Fetch Error:", error);
  }

  const parentCategories = allCategories.filter(cat => cat.parent === 0 && cat.count > 0);

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          استكشف <span className="text-gradient">الدليل</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          تصفح كافة الخدمات والأعمال في المنصورية مقسمة حسب التخصص والنشاط.
        </p>
      </header>

      {/* Categories Cards Explorer */}
      <section style={{ marginBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {parentCategories.map(cat => {
            const children = allCategories.filter(c => c.parent === cat.id && c.count > 0);
            return (
              <div key={cat.id} className="glass animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>{cat.name}</h2>
                  <i className="fa-solid fa-folder-open" style={{ color: 'var(--primary)', fontSize: '1.3rem' }}></i>
                </div>

                {children.length > 0 && (
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', position: 'relative', display: 'inline-block', padding: '0 10px', background: '#fff', zIndex: 1 }}>الأقسام الفرعية</span>
                    <div style={{ height: '1px', background: '#f1f5f9', width: '100%', marginTop: '-8px' }}></div>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2.5rem', flex: 1 }}>
                  {children.map(child => (
                    <Link 
                      key={child.id} 
                      href={`/directory_category/${child.slug}`} 
                      style={{ 
                        padding: '0.5rem 0.9rem', 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '2rem', 
                        fontSize: '0.9rem', 
                        color: '#475569', 
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                      }}
                      className="category-pill"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>

                <Link href={`/directory_category/${cat.slug}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                  عرض قسم {cat.name}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest Listings */}
      <section style={{ paddingBottom: '6rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>أحدث ما تم إضافته للدليل</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {directories.map(post => (
            <div key={post.id} className="glass animate-fade-in" style={{ padding: '2rem', background: '#fff' }}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} style={{ fontSize: '1.4rem', marginBottom: '1rem' }} />
              <div 
                dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered }} 
                style={{ margin: '0 0 2rem 0', opacity: 0.8, color: '#475569', fontSize: '0.95rem' }} 
              />
              <Link href={`/directory/${post.slug}`} className="btn" style={{ background: '#f1f5f9', color: 'var(--primary)', fontWeight: 'bold' }}>
                عرض التفاصيل ←
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
