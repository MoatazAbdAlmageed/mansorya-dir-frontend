import { getDirectories, getCategories } from "@/lib/wp";
import Link from "next/link";

export default async function DirectoryArchive({ searchParams }) {
  const params = await searchParams;
  const category = params.category;
  
  let directories = [];
  let allCategories = [];

  try {
    const results = await Promise.all([
      getDirectories(`?per_page=12${category ? `&directory_category=${category}` : ''}`),
      getCategories()
    ]);
    directories = Array.isArray(results[0]) ? results[0] : [];
    allCategories = Array.isArray(results[1]) ? results[1] : [];
  } catch (error) {
    console.error("Fetch Error:", error);
  }

  // Organize categories into a hierarchy
  const parentCategories = allCategories.filter(cat => cat.parent == 0);
  const getSubcategories = (parentId) => allCategories.filter(cat => cat.parent == parentId);

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          دليل <span className="text-gradient">المنصورية</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          خدمة مجانية لتسهيل الوصول لأصحاب المهن وأرباب الحرف. 
          نجمع لك كافة الخدمات في مكان واحد.
        </p>
        
        {category && (
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '2rem', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0, 150, 136, 0.3)' }}>
              النتائج في: {allCategories.find(c => c.id == category)?.name || category}
            </div>
            <Link href="/" className="btn" style={{ background: '#fff', border: '1px solid var(--glass-border)', color: 'var(--primary)' }}>
              إلغاء التصفية ×
            </Link>
          </div>
        )}
      </header>

      {/* Categories Explorer - Main Grid */}
      <section style={{ marginBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {(category ? getSubcategories(parseInt(category)) : parentCategories).map(cat => {
            const children = getSubcategories(cat.id);
            return (
              <div key={cat.id} className="glass animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
                {/* Icon and Title */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>{cat.name}</h2>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>

                {/* Divider */}
                {children.length > 0 && (
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', position: 'relative', display: 'inline-block', padding: '0 10px', background: '#fff', zIndex: 1 }}>تخصصات فرعية</span>
                    <div style={{ height: '1px', background: '#f1f5f9', width: '100%', marginTop: '-10px' }}></div>
                  </div>
                )}

                {/* Subcategories Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2rem', flex: 1 }}>
                  {children.slice(0, 15).map(child => (
                    <Link 
                      key={child.id} 
                      href={`/?category=${child.id}`} 
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '2rem', 
                        fontSize: '0.85rem', 
                        color: '#475569', 
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                      }}
                      className="category-pill"
                    >
                      {child.name}
                    </Link>
                  ))}
                  {children.length === 0 && !category && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>انقر لعرض المنشآت</p>
                  )}
                </div>

                {/* View All Button */}
                <Link href={`/?category=${cat.id}#results`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {children.length > 0 ? 'عرض الكل' : 'عرض المنشآت'}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Results Section */}
      <section id="results">
        <h2 style={{ marginBottom: '2.5rem', textAlign: category ? 'right' : 'center', fontSize: '2rem' }}>
          {category ? 'النتائج المتوفرة' : 'أحدث القوائم المضافة'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {directories.length > 0 ? directories.map(post => (
            <div key={post.id} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: '#fff' }}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} style={{ fontSize: '1.4rem', marginBottom: '1rem' }} />
              <div 
                dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered }} 
                style={{ margin: '0 0 2rem 0', opacity: 0.8, color: '#475569', fontSize: '0.95rem', flex: 1 }} 
              />
              <Link href={`/directory/${post.slug}`} className="btn" style={{ background: '#f1f5f9', color: 'var(--primary)', fontWeight: 'bold' }}>
                التفاصيل الكاملة ←
              </Link>
            </div>
          )) : (
            <div className="glass" style={{ padding: '4rem', textAlign: 'center', gridColumn: '1/-1', background: '#fff' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>لا توجد منشآت لعرضها في هذا القسم حالياً.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
