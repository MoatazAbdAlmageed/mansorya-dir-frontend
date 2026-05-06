import { getDirectories, getCategories, getCategoryBySlug, buildCategoryPath } from "@/lib/wp";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

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

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  // 1. Fetch current category by slug
  const currentCategory = await getCategoryBySlug(slug);
  
  if (!currentCategory) {
    notFound();
  }

  let directories = [];
  let allCategories = [];
  let currentChildren = [];

  try {
    // 2. Fetch all categories (needed for hierarchy logic)
    allCategories = await getCategories();
    allCategories = Array.isArray(allCategories) ? allCategories : [];

    // 3. Build the directory filter
    const id = currentCategory.id;
    const descendantIds = getAllDescendantIds(allCategories, id);
    const allFilterIds = [id, ...descendantIds].join(',');
    
    let filterParams = `?per_page=100&_embed&directory_category=${allFilterIds}`;

    // 4. Fetch directories
    directories = await getDirectories(filterParams);
    directories = Array.isArray(directories) ? directories : [];

    // 5. Get children categories for the sidebar/header
    currentChildren = allCategories.filter(cat => cat.parent === id && cat.count > 0);

  } catch (error) {
    console.error("Fetch Error:", error);
  }

  // Build Breadcrumbs
  const categoryPath = buildCategoryPath(allCategories, currentCategory.id);
  // Last item should not have a link
  const breadcrumbItems = categoryPath.map((item, idx) => 
    idx === categoryPath.length - 1 ? { ...item, href: null } : item
  );

  return (
    <div className="container section-padding">
      <header style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'right', marginBottom: '2.5rem' }}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          قسم <span className="text-gradient">{currentCategory.name}</span>
        </h1>
        
        {currentCategory.description && (
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
            {currentCategory.description}
          </p>
        )}

        {/* Sub-categories Pills */}
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
      </header>

      {/* Results Section */}
      <section id="results" style={{ paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>
            النتائج في {currentCategory.name}
          </h2>
          {directories.length > 0 && (
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              تم العثور على {directories.length} منشأة
            </span>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {directories.length > 0 ? directories.map(post => (
            <div key={post.id} className="glass animate-fade-in listing-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', transition: 'transform 0.3s' }}>
              {post.acf?.image_url && (
                <Link href={`/directory/${post.slug}`} style={{ display: 'block', height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img src={post.acf.image_url} alt={post.title.rendered} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="card-image" />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <i className="fa-solid fa-star" style={{ color: 'var(--accent)', marginLeft: '5px' }}></i>
                    مميز
                  </div>
                </Link>
              )}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Link href={`/directory/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#0f172a', transition: 'color 0.2s' }} className="title-link" />
                </Link>
                <div 
                  dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered }} 
                  style={{ margin: '0 0 2rem 0', opacity: 0.8, color: '#475569', fontSize: '0.95rem', flex: 1 }} 
                />
                <Link href={`/directory/${post.slug}`} className="btn" style={{ background: '#f1f5f9', color: 'var(--primary)', fontWeight: 'bold', width: 'fit-content' }}>
                  التفاصيل الكاملة ←
                </Link>
              </div>
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
