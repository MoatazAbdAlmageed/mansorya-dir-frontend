'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoGallery({ images, title = "معرض الصور" }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Normalize images to an array
  let normalizedImages = [];
  if (Array.isArray(images)) {
    normalizedImages = images;
  } else if (images) {
    normalizedImages = [images];
  }

  if (normalizedImages.length === 0) return null;

  return (
    <section className="photo-gallery-section" style={{ marginTop: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ 
          width: '45px', 
          height: '45px', 
          background: 'var(--primary-light)', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--primary)'
        }}>
          <i className="fa-solid fa-images" style={{ fontSize: '1.2rem' }}></i>
        </div>
        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h3>
      </div>

      <div className="gallery-grid">
        {normalizedImages.map((img, idx) => {
          let url = '';
          if (typeof img === 'string') {
            url = img;
          } else if (typeof img === 'number') {
            // If it's an ID, we ideally need the URL. 
            // For now, we'll try to use a common placeholder or check if it's an object elsewhere.
            // But we'll skip IDs for now as we can't resolve them without an API call here.
            return null;
          } else if (img && typeof img === 'object') {
            url = img.url || img.source_url || img.guid?.rendered;
          }
          
          if (!url) return null;

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="gallery-item-wrapper"
              onClick={() => setSelectedImage(url)}
            >
              <div className="gallery-item">
                <img src={url} alt={`Gallery ${idx + 1}`} loading="lazy" />
                <div className="gallery-overlay">
                  <i className="fa-solid fa-expand"></i>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button 
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="Full view" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
