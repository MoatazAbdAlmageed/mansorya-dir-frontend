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

  const parentCategories = allCategories.filter(cat => cat.parent === 0);
  const getSubcategories = (parentId) => allCategories.filter(cat => cat.parent === parentId);

  return (
    <div className="container" style={{ paddingTop: '2rem', color: '#fff' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem' }}>دليل الأعمال</h1>
        {category && <p>عرض النتائج للقسم ID: {category}</p>}
      </header>

      {!category && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem' }}>الأقسام الرئيسية</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {allCategories.length === 0 && <p>جاري تحميل الأقسام أو لا توجد بيانات...</p>}
            {allCategories.map(cat => (
              <Link key={cat.id} href={`/directory?category=${cat.id}`} className="glass" style={{ padding: '1rem', textDecoration: 'none', color: '#fff' }}>
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ marginBottom: '2rem' }}>{category ? 'المنشآت' : 'أحدث القوائم'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {directories.map(post => (
            <div key={post.id} className="glass" style={{ padding: '1.5rem' }}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              <div dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered }} style={{ margin: '1rem 0', opacity: 0.8 }} />
              <Link href={`/directory/${post.slug}`} className="text-gradient">التفاصيل ←</Link>
            </div>
          ))}
          {directories.length === 0 && <p>لا توجد منشآت لعرضها حالياً.</p>}
        </div>
      </section>
    </div>
  );
}
