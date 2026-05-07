'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap, CloudOff } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed/in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    }

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
      localStorage.setItem('pwa-prompt-dismissed', 'true');
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Save to localStorage so we don't ask again
    localStorage.setItem('pwa-prompt-dismissed', 'true');

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
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        pointerEvents: 'none'
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'auto'
          }}
          onClick={handleDismiss}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            width: '100%',
            maxWidth: '480px',
            position: 'relative',
            zIndex: 2001,
            direction: 'rtl',
            pointerEvents: 'auto'
          }}
        >
          <div className="glass" style={{ 
            padding: '2rem', 
            background: 'rgba(255, 255, 255, 0.98)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(0, 150, 136, 0.2)',
            borderRadius: '2rem'
          }}>
            <button 
              onClick={handleDismiss}
              style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.25rem',
                background: 'rgba(0,0,0,0.05)',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                width: '70px',
                height: '70px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 12px 24px rgba(0, 150, 136, 0.3)',
                transform: 'rotate(-5deg)'
              }}>
                <Smartphone color="white" size={36} />
              </div>

              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: '800' }}>
                دليل المنصورية في جيبك
              </h3>
              <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.7' }}>
                استمتع بتجربة دليل المنصورية الكاملة مباشرة من شاشتك الرئيسية! وصول سريع، تصفح بدون إنترنت، وإشعارات فورية بكل جديد في منطقتك.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px' }}>
                    <Zap size={20} className="text-gradient" />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>أسرع</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px' }}>
                    <CloudOff size={20} className="text-gradient" />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>بدون نت</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px' }}>
                    <Smartphone size={20} className="text-gradient" />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>خفيف</span>
                </div>
              </div>

              <button 
                onClick={handleInstall}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  padding: '1.1rem',
                  borderRadius: '1.25rem',
                  boxShadow: '0 10px 20px rgba(0, 150, 136, 0.2)'
                }}
              >
                <Download size={22} />
                تثبيت التطبيق الآن
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
