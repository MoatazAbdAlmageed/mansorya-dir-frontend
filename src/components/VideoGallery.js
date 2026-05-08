'use client';

import { motion } from 'framer-motion';

// ── URL Parsers ──────────────────────────────────────────────

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  // Handles: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
}

function getFacebookEmbedUrl(url) {
  if (!url) return null;
  if (!url.includes('facebook.com') && !url.includes('fb.watch')) return null;
  // Facebook's official oEmbed iframe format
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560&autoplay=false`;
}

function detectVideoType(url) {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return 'direct';
  return 'unknown';
}

// ── Video Card Component ─────────────────────────────────────

function VideoCard({ url, title, idx }) {
  const type = detectVideoType(url);

  const wrapperStyle = {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    background: '#000',
    aspectRatio: '16/9',
    position: 'relative',
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
    position: 'absolute',
    inset: 0,
  };

  if (type === 'youtube') {
    const embedUrl = getYoutubeEmbedUrl(url);
    if (!embedUrl) return <ExternalLink url={url} label="مشاهدة على يوتيوب" icon="fa-youtube" color="#FF0000" />;
    return (
      <VideoWrapper idx={idx} type="youtube" title={title}>
        <div style={{ ...wrapperStyle }}>
          <iframe
            src={embedUrl}
            title={title || `يوتيوب ${idx + 1}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={iframeStyle}
            loading="lazy"
          />
        </div>
      </VideoWrapper>
    );
  }

  if (type === 'facebook') {
    const embedUrl = getFacebookEmbedUrl(url);
    if (!embedUrl) return <ExternalLink url={url} label="مشاهدة على فيسبوك" icon="fa-facebook" color="#1877F2" />;
    return (
      <VideoWrapper idx={idx} type="facebook" title={title}>
        <div style={{ ...wrapperStyle }}>
          <iframe
            src={embedUrl}
            title={title || `فيسبوك ${idx + 1}`}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            scrolling="no"
            style={iframeStyle}
            loading="lazy"
          />
        </div>
      </VideoWrapper>
    );
  }

  if (type === 'direct') {
    return (
      <VideoWrapper idx={idx} type="direct" title={title}>
        <div style={{ ...wrapperStyle }}>
          <video controls style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            <source src={url} />
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        </div>
      </VideoWrapper>
    );
  }

  // Fallback: open as link
  return <ExternalLink url={url} label="فتح الفيديو" icon="fa-circle-play" color="var(--primary)" />;
}

function VideoWrapper({ children, idx, type, title }) {
  const iconMap = {
    youtube: { icon: 'fa-youtube', color: '#FF0000', label: 'يوتيوب' },
    facebook: { icon: 'fa-facebook', color: '#1877F2', label: 'فيسبوك' },
    direct: { icon: 'fa-file-video', color: 'var(--primary)', label: 'فيديو' },
  };
  const meta = iconMap[type] || iconMap.direct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(idx * 0.1, 0.4) }}
      className="video-card"
    >
      {children}
      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className={`fa-brands ${meta.icon}`} style={{ color: meta.color, fontSize: '1rem' }}></i>
        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#475569' }}>
          {title || meta.label}
        </span>
      </div>
    </motion.div>
  );
}

function ExternalLink({ url, label, icon, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
        style={{ background: color, color: '#fff', gap: '0.5rem' }}
      >
        <i className={`fa-brands ${icon}`}></i> {label}
      </a>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

export default function VideoGallery({ videos, youtubeUrl, title = "معرض الفيديو" }) {
  // Normalize all videos into { url, title } objects
  const allVideos = [];

  // 1. From pb_video_gallery / acf.videos array
  if (Array.isArray(videos) && videos.length > 0) {
    videos.forEach(v => {
      const url = typeof v === 'string' ? v : (v?.url || v?.source_url);
      const label = typeof v === 'object' ? (v?.title || '') : '';
      if (url) allVideos.push({ url, title: label });
    });
  }

  // 2. From ACF youtube channel URL (fallback single video)
  if (youtubeUrl && !allVideos.some(v => v.url === youtubeUrl)) {
    allVideos.push({ url: youtubeUrl, title: 'يوتيوب' });
  }

  if (allVideos.length === 0) return null;

  return (
    <section style={{ marginTop: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '42px', height: '42px',
          background: 'rgba(255,0,0,0.1)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FF0000'
        }}>
          <i className="fa-solid fa-circle-play" style={{ fontSize: '1.1rem' }}></i>
        </div>
        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{title}</h3>
        <span style={{
          background: 'rgba(255,0,0,0.08)', color: '#FF0000',
          borderRadius: '2rem', padding: '0.2rem 0.75rem',
          fontSize: '0.85rem', fontWeight: 700
        }}>{allVideos.length}</span>
      </div>

      {/* Grid */}
      <div className="video-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {allVideos.map((video, idx) => (
          <VideoCard key={idx} url={video.url} title={video.title} idx={idx} />
        ))}
      </div>
    </section>
  );
}
