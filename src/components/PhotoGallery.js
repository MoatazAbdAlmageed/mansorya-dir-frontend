'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoGallery({ images, title = "معرض الصور" }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const scrollRef = useRef(null);

  // Normalize images
  const normalizedImages = (() => {
    const list = Array.isArray(images) ? images : (images ? [images] : []);
    return list.map(img => {
      if (typeof img === 'string') return { url: img, alt: '' };
      if (img && typeof img === 'object') {
        const url = img.url || img.source_url || img.guid?.rendered;
        return url ? { url, alt: img.alt || img.alt_text || '' } : null;
      }
      return null;
    }).filter(Boolean);
  })();

  if (normalizedImages.length === 0) return null;

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    setLightboxIndex(i => (i - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);
  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    setLightboxIndex(i => (i + 1) % normalizedImages.length);
  }, [normalizedImages.length]);

  // Track hover state to enable strip scrolling via keyboard
  const [isHovering, setIsHovering] = useState(false);

  // Keyboard: ESC closes lightbox, arrows navigate lightbox OR scroll strip
  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex !== null) {
        // Lightbox open → navigate images
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') { e.preventDefault(); nextImage(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); prevImage(); }
      } else if (isHovering) {
        // Strip hovered → scroll horizontally
        if (e.key === 'ArrowLeft') { e.preventDefault(); scroll(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); scroll(1); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, prevImage, nextImage, isHovering]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  return (
    <section
      style={{ marginTop: '4rem' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px', height: '42px',
            background: 'var(--primary-light)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <i className="fa-solid fa-images" style={{ fontSize: '1.1rem' }}></i>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{title}</h3>
          <span style={{
            background: 'var(--primary-light)', color: 'var(--primary)',
            borderRadius: '2rem', padding: '0.2rem 0.75rem',
            fontSize: '0.85rem', fontWeight: 700
          }}>{normalizedImages.length}</span>
        </div>

        {/* Scroll Arrows */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => scroll(-1)} style={arrowBtnStyle} title="السابق">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
          <button onClick={() => scroll(1)} style={arrowBtnStyle} title="التالي">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>
      </div>

      {/* Scrollable Strip */}
      <div style={{ position: 'relative' }}>
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--primary) #f1f5f9',
          }}
        >
          {normalizedImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.06, 0.4) }}
              onClick={() => openLightbox(idx)}
              style={{
                flex: '0 0 220px',
                scrollSnapAlign: 'start',
                cursor: 'zoom-in',
                position: 'relative',
                borderRadius: '1rem',
                overflow: 'hidden',
                aspectRatio: '1',
                background: '#f1f5f9',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                border: '2px solid transparent',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 12px 30px rgba(0,150,136,0.2)',
              }}
            >
              <img
                src={img.url}
                alt={img.alt || `صورة ${idx + 1}`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Hover overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,150,136,0.7) 0%, transparent 60%)',
                opacity: 0,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                paddingBottom: '1rem',
                color: '#fff', fontSize: '1.4rem',
                transition: 'opacity 0.3s',
              }}
                className="gallery-hover-overlay"
              >
                <i className="fa-solid fa-expand"></i>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: 'rgba(10, 15, 30, 0.97)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Close */}
            <button onClick={closeLightbox} style={lightboxBtnStyle('top', '1.5rem', 'left', '1.5rem')}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Counter */}
            <div style={{
              position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
              color: '#fff', fontSize: '0.9rem', fontWeight: 600,
              background: 'rgba(255,255,255,0.1)', borderRadius: '2rem',
              padding: '0.4rem 1.2rem', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              {lightboxIndex + 1} / {normalizedImages.length}
            </div>

            {/* Prev */}
            {normalizedImages.length > 1 && (
              <button onClick={prevImage} style={lightboxNavStyle('right', '1rem')}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '88vh', position: 'relative' }}
            >
              <img
                src={normalizedImages[lightboxIndex].url}
                alt={normalizedImages[lightboxIndex].alt || `صورة ${lightboxIndex + 1}`}
                style={{
                  maxWidth: '90vw', maxHeight: '88vh',
                  objectFit: 'contain',
                  borderRadius: '1rem',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                  display: 'block',
                }}
              />
            </motion.div>

            {/* Next */}
            {normalizedImages.length > 1 && (
              <button onClick={nextImage} style={lightboxNavStyle('left', '1rem')}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            )}

            {/* Thumbnail Strip */}
            {normalizedImages.length > 1 && (
              <div style={{
                position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: '0.5rem', maxWidth: '90vw', overflowX: 'auto',
                padding: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '1rem',
                backdropFilter: 'blur(8px)',
              }}>
                {normalizedImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={e => { e.stopPropagation(); setLightboxIndex(idx); }}
                    style={{
                      width: '52px', height: '52px', flexShrink: 0,
                      borderRadius: '0.5rem', overflow: 'hidden', cursor: 'pointer',
                      border: idx === lightboxIndex ? '2px solid var(--primary)' : '2px solid transparent',
                      opacity: idx === lightboxIndex ? 1 : 0.55,
                      transition: 'all 0.2s',
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-hover-overlay { opacity: 0; transition: opacity 0.3s; }
        [style*="zoom-in"]:hover .gallery-hover-overlay { opacity: 1; }
        div[style*="overflowX: auto"]::-webkit-scrollbar { height: 5px; }
        div[style*="overflowX: auto"]::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }
      `}</style>
    </section>
  );
}

const arrowBtnStyle = {
  width: '38px', height: '38px',
  background: '#f1f5f9', border: '1px solid #e2e8f0',
  borderRadius: '50%', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#475569', fontSize: '0.85rem',
  transition: 'all 0.2s',
};

const lightboxBtnStyle = (vProp, vVal, hProp, hVal) => ({
  position: 'absolute', [vProp]: vVal, [hProp]: hVal,
  width: '46px', height: '46px', zIndex: 10,
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '50%', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', fontSize: '1.2rem',
  backdropFilter: 'blur(8px)',
  transition: 'background 0.2s',
});

const lightboxNavStyle = (side, val) => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', [side]: val,
  width: '52px', height: '52px', zIndex: 10,
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '50%', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', fontSize: '1.3rem',
  backdropFilter: 'blur(8px)',
  transition: 'background 0.2s, transform 0.2s',
});
