import { getDirectories, getCategories } from "@/lib/wp";
import Link from "next/link";

// Helper to get all descendant IDs of a category
function getAllDescendantIds(categories, parentId) {
  let ids = [];
  const children = categories.filter(cat => cat.parent === parentId);
  for (const child of children) {
    ids.push(child.id);
    ids = [...ids, ...getAllDescendantIds(categories, child.id)];
  }
  return ids;
}

export default async function DirectoryArchive({ searchParams }) {
  const params = await searchParams;
  const categoryId = params.category;
  
  let directories = [];
  let allCategories = [];
  let currentCategory = null;

  try {
    // 1. Fetch all categories
    allCategories = await getCategories();
    allCategories = Array.isArray(allCategories) ? allCategories : [];

    // 2. Build the directory filter
    let filterParams = "?per_page=12&_embed";
    if (categoryId) {
      const id = parseInt(categoryId);
      currentCategory = allCategories.find(c => c.id === id);
      
      // Include current category + all its descendants to match WP behavior
      const descendantIds = getAllDescendantIds(allCategories, id);
      const allFilterIds = [id, ...descendantIds].join(',');
      filterParams += `&directory_category=${allFilterIds}`;
    }

    // 3. Fetch directories
    directories = await getDirectories(filterParams);
    directories = Array.isArray(directories) ? directories : [];

  } catch (error) {
    console.error("Fetch Error:", error);
  }

  // Organize categories into a hierarchy - only show those with posts
  const parentCategories = allCategories.filter(cat => cat.parent === 0 && cat.count > 0);
  const currentChildren = categoryId ? allCategories.filter(cat => cat.parent === parseInt(categoryId) && cat.count > 0) : [];

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        {currentCategory ? (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <Link href="/" className="btn" style={{ background: '#f1f5f9', color: 'var(--primary)', border: 'none', padding: '0.5rem 1rem' }}>
                ← العودة إلى كافة التصنيفات
              </Link>
            </div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
              قسم <span className="text-gradient">{currentCategory.name}</span>
            </h1>
            {currentCategory.description && (
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
                {currentCategory.description}
              </p>
            )}

            {/* Sub-categories Pills - Show if current category has children */}
            {currentChildren.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center', marginTop: '2rem' }}>
                <span style={{ width: '100%', display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>تصفح الأقسام الفرعية:</span>
                {currentChildren.map(child => (
                  <Link 
                    key={child.id} 
                    href={`/directory_category/${child.slug}`}
                    style={{ 
                      padding: '0.6rem 1.2rem', 
                      background: '#fff', 
                      border: '1px solid var(--primary)', 
                      borderRadius: '2rem', 
                      fontSize: '0.95rem', 
                      color: 'var(--primary)', 
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      fontWeight: '600'
                    }}
                    className="category-pill-active"
                  >
                    {child.name} ({child.count})
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
              دليل <span className="text-gradient">المنصورية</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
              خدمة مجانية لتسهيل الوصول لأصحاب المهن وأرباب الحرف. 
              نجمع لك كافة الخدمات في مكان واحد.
            </p>
          </>
        )}
      </header>

      {/* Categories Explorer - ONLY show when NO category is selected */}
      {!categoryId && (
        <section style={{ marginBottom: '6rem' }}>
          <h2 style={{ marginBottom: '2.5rem', textAlign: 'center', fontSize: '1.8rem', opacity: 0.8 }}>
            استكشف الدليل حسب القسم
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {parentCategories.map(cat => {
              const children = allCategories.filter(c => c.parent === cat.id && c.count > 0);
              return (
                <div key={cat.id} className="glass animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>{cat.name}</h2>
                    <i className="fa-solid fa-folder-open" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
                  </div>

                  {children.length > 0 && (
                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', position: 'relative', display: 'inline-block', padding: '0 10px', background: '#fff', zIndex: 1 }}>تخصصات فرعية</span>
                      <div style={{ height: '1px', background: '#f1f5f9', width: '100%', marginTop: '-10px' }}></div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2rem', flex: 1 }}>
                    {children.slice(0, 10).map(child => (
                      <Link 
                        key={child.id} 
                        href={`/directory_category/${child.slug}`} 
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
                    {children.length === 0 && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>تصفح المنشآت في هذا القسم</p>
                    )}
                  </div>

                  <Link href={`/directory_category/${cat.slug}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    {children.length > 0 ? 'عرض الكل' : 'عرض المنشآت'}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Results Section */}
      <section id="results" style={{ paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>
            {categoryId ? `النتائج في ${currentCategory?.name}` : 'أحدث القوائم المضافة'}
          </h2>
          {categoryId && directories.length > 0 && (
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              تم العثور على {directories.length} منشأة
            </span>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {directories.length > 0 ? directories.map(post => (
            <div key={post.id} className="glass animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: '#fff' }}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} style={{ fontSize: '1.4rem', marginBottom: '1rem' }} />
              <div 
                dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered }} 
                style={{ margin: '0 0 2rem 0', opacity: 0.8, color: '#475569', fontSize: '0.95rem', flex: 1 }} 
              />
              <Link href={`/directory/${post.slug}`} className="btn" style={{ background: '#f1f5f9', color: 'var(--primary)', fontWeight: 'bold', width: 'fit-content' }}>
                التفاصيل الكاملة ←
              </Link>
            </div>
          )) : (
            <div className="glass animate-fade-in" style={{ padding: '5rem 2rem', textAlign: 'center', gridColumn: '1/-1', background: '#fff' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>لا توجد منشآت منشورة في هذا القسم حالياً.</p>
              <Link href="/" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                العودة لتصفح كافة الأقسام
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
