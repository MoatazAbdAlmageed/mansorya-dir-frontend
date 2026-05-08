import { getDirectory, getCategories, buildCategoryPath, getFeaturedImage, getAllDirectorySlugs } from "@/lib/wp";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ListingInteractions from "@/components/ListingInteractions";
import PhotoGallery from "@/components/PhotoGallery";
import VideoGallery from "@/components/VideoGallery";

// ISR: re-generate page at most once per hour
export const revalidate = 3600;

// Pre-render all known directory pages at build time
export async function generateStaticParams() {
  const slugs = await getAllDirectorySlugs();
  return slugs.map((slug) => ({ slug }));
}

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

  // 🚀 Fetch post + all categories in parallel
  const [post, allCategories] = await Promise.all([
    getDirectory(slug),
    getCategories(),
  ]);

  if (!post) notFound();

  const acf = post.acf || {};

  // --- 1. Resolve Photo Gallery Images ---
  let galleryImages = [];

  if (post.pb_directory_gallery && post.pb_directory_gallery.length > 0) {
    const pbItems = Array.isArray(post.pb_directory_gallery) ? post.pb_directory_gallery : [post.pb_directory_gallery];
    galleryImages = [...pbItems];
  }

  if (galleryImages.length === 0 && acf.gallery) {
    const acfItems = Array.isArray(acf.gallery) ? acf.gallery : [acf.gallery];
    galleryImages = [...acfItems];
  }

  // Handle ID resolution if images are returned as numeric IDs
  if (galleryImages.length > 0 && typeof galleryImages[0] === 'number') {
    try {
      const resolvedImages = await Promise.all(
        galleryImages.map(async (id) => {
          if (typeof id !== 'number') return id;
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/media/${id}`,
            { next: { revalidate: 3600 } }
          );
          if (res.ok) {
            const media = await res.json();
            return { url: media.source_url, alt: media.alt_text };
          }
          return null;
        })
      );
      galleryImages = resolvedImages.filter(img => img !== null);
    } catch (e) {
      console.error("Failed to resolve gallery IDs", e);
    }
  }

  // --- 2. Resolve Video Gallery ---
  let resolvedVideos = [];

  if (post.pb_video_gallery && post.pb_video_gallery.length > 0) {
    const pbVideos = Array.isArray(post.pb_video_gallery) ? post.pb_video_gallery : [post.pb_video_gallery];
    resolvedVideos = [...pbVideos];
  }

  if (resolvedVideos.length === 0 && acf.videos && Array.isArray(acf.videos)) {
    resolvedVideos = acf.videos.map(item => {
      if (typeof item === 'string') return item;
      if (item.video) return item.video.url || item.video;
      return item;
    }).filter(Boolean);
  }

  // Build Breadcrumbs
  const categoryId = post.directory_category?.[0];
  const categoryPath = categoryId ? buildCategoryPath(allCategories, categoryId) : [];

  const imageUrl = getFeaturedImage(post);

  return (
    <div className="container section-padding">
      <header style={{ marginBottom: '3rem' }}>
        <Breadcrumbs items={categoryPath} />
      </header>

      <div className="single-grid">
        {/* Main Content */}
        <main className="glass animate-fade-in responsive-padding" style={{ background: '#fff' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#0f172a' }} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

          {imageUrl && (
            <div style={{ marginBottom: '2.5rem', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', position: 'relative', width: '100%', maxHeight: '500px', minHeight: '300px' }}>
              <Image
                src={imageUrl}
                alt={post.title.rendered.replace(/<[^>]+>/g, '')}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
                priority
              />
            </div>
          )}

          <div className="content-section" style={{ marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1rem', opacity: 0.6 }}>عن النشاط</h3>
            <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#334155' }}>
              {acf.description && (
                <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>{acf.description}</p>
              )}
              <div
                className="wp-content"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </div>

          {acf.notes && (
            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '1rem', borderRight: '4px solid var(--primary)', marginBottom: '3rem' }}>
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

          {/* Photo Gallery Section */}
          <PhotoGallery images={galleryImages} title="معرض الصور" />

          {/* Video Gallery Section */}
          <VideoGallery
            videos={resolvedVideos}
            youtubeUrl={acf.youtube}
            title="معرض الفيديو"
          />

          <ListingInteractions postId={post.id} />
        </main>

        {/* Sidebar Info */}
        <aside className="animate-fade-in sticky-sidebar">
          <div className="glass responsive-padding" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
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
                    <i className="fa-solid fa-phone"></i> اتصال هاتفي
                  </a>
                )}
              </div>

              {/* WhatsApp Section */}
              {acf.whatsapp && (
                <div className="contact-item">
                  <label><i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> واتساب</label>
                  <p>{acf.whatsapp}</p>
                  <a href={`https://wa.me/${acf.whatsapp.replace(/\D/g,'')}`} target="_blank" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', background: '#25D366', color: '#fff' }}>
                    <i className="fa-brands fa-whatsapp"></i> إرسال رسالة
                  </a>
                </div>
              )}

              {/* Address Section */}
              <div className="contact-item">
                <label><i className="fa-solid fa-location-dot"></i> العنوان</label>
                <p style={{ fontSize: '0.95rem' }}>{acf.address || 'غير محدد حالياً'}</p>
                {acf.google_map && (
                  <a href={acf.google_map} target="_blank" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', background: '#f1f5f9', color: '#0f172a' }}>
                    <i className="fa-solid fa-map-location-dot"></i> فتح في الخريطة
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
