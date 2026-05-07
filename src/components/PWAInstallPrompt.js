'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap, CloudOff } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Check if user has already dismissed or installed
      const isDismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!isDismissed) {
        // Show the prompt after a short delay to not annoy the user immediately
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Optionally store dismissal to not show again for a while
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '500px',
          zIndex: 2000,
          direction: 'rtl',
        }}
      >
        <div className="glass" style={{ 
          padding: '1.5rem', 
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 150, 136, 0.2)'
        }}>
          <button 
            onClick={handleDismiss}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 8px 16px rgba(0, 150, 136, 0.2)'
            }}>
              <Smartphone color="white" size={28} />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                تثبيت دليل المنصورية
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                استمتع بتجربة دليل المنصورية الكاملة مباشرة من شاشتك الرئيسية! عند تثبيت التطبيق، ستتمكن من الوصول السريع لجميع الخدمات في منطقتك بضغطة واحدة، حتى في حال عدم توفر اتصال بالإنترنت. التطبيق يوفر لك سرعة تصفح فائقة وإشعارات فورية بكل جديد، دون أن يشغل مساحة من ذاكرة هاتفك.
              </p>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Zap size={14} className="text-gradient" /> <span>تصفح أسرع</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <CloudOff size={14} className="text-gradient" /> <span>يعمل بدون إنترنت</span>
                </div>
              </div>

              <button 
                onClick={handleInstall}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  justifyContent: 'center',
                  fontSize: '1.05rem',
                  padding: '0.9rem'
                }}
              >
                <Download size={20} />
                تثبيت التطبيق الآن
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
