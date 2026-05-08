'use client';

import { motion } from 'framer-motion';

export default function VideoGallery({ videos, youtubeUrl, title = "معرض الفيديو" }) {
  const hasVideos = (videos && Array.isArray(videos) && videos.length > 0);
  const hasYoutube = !!youtubeUrl;

  if (!hasVideos && !hasYoutube) return null;

  const parseYoutubeEmbed = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const youtubeEmbedUrl = parseYoutubeEmbed(youtubeUrl);

  return (
    <section className="video-gallery-section" style={{ marginTop: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ 
          width: '45px', 
          height: '45px', 
          background: 'rgba(255, 0, 0, 0.1)', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#FF0000'
        }}>
          <i className="fa-solid fa-circle-play" style={{ fontSize: '1.2rem' }}></i>
        </div>
        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h3>
      </div>

      <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {youtubeEmbedUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="video-card"
          >
            <div className="video-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <iframe
                src={youtubeEmbedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
              ></iframe>
            </div>
            <div className="video-info" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <i className="fa-brands fa-youtube" style={{ color: '#FF0000' }}></i>
               <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>فيديو من اليوتيوب</span>
            </div>
          </motion.div>
        )}

        {hasVideos && videos.map((video, idx) => {
          const url = typeof video === 'string' ? video : (video.url || video.source_url);
          if (!url) return null;

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (idx + 1) * 0.1 }}
              className="video-card"
            >
              <div className="video-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: '#000' }}>
                <video controls style={{ width: '100%', aspectRatio: '16/9' }}>
                  <source src={url} />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="video-info" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <i className="fa-solid fa-file-video" style={{ color: 'var(--primary)' }}></i>
                 <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                   {video.title || (typeof video === 'string' ? "فيديو محلي" : "فيديو")}
                 </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {!youtubeEmbedUrl && youtubeUrl && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a 
            href={youtubeUrl} 
            target="_blank" 
            className="btn" 
            style={{ background: '#FF0000', color: '#fff', padding: '1rem 2rem' }}
          >
            <i className="fa-brands fa-youtube"></i> زيارة القناة لمشاهدة الفيديوهات
          </a>
        </div>
      )}

    </section>
  );
}
