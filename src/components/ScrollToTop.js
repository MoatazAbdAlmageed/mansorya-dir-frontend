'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label="العودة للأعلى"
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '2rem', // Opposite of WhatsApp balloon (which is right: 2rem)
            width: '50px',
            height: '50px',
            borderRadius: '1rem',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            transition: 'background 0.3s',
          }}
          whileHover={{ y: -5, background: 'var(--primary-hover)' }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fa-solid fa-chevron-up"></i>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
