'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function NotFound() {
  const canvasRef = useRef(null);

  // Animated particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 150, 136, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulsGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(0,150,136,0.3), 0 0 80px rgba(0,150,136,0.1); }
          50% { box-shadow: 0 0 60px rgba(0,150,136,0.6), 0 0 120px rgba(0,150,136,0.2); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(0,150,136,0.4); }
          50% { text-shadow: 0 0 60px rgba(0,150,136,0.8), 0 0 100px rgba(0,150,136,0.3); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .nf-canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .nf-wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 30% 20%, rgba(0,150,136,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 80%, rgba(0,77,64,0.12) 0%, transparent 60%),
                      #f8fafc;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .nf-orb-1 {
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,150,136,0.12) 0%, transparent 70%);
          border-radius: 50%;
          top: -150px; right: -150px;
          pointer-events: none;
          animation: pulsGlow 4s ease-in-out infinite;
        }
        .nf-orb-2 {
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,77,64,0.1) 0%, transparent 70%);
          border-radius: 50%;
          bottom: -100px; left: -100px;
          pointer-events: none;
        }
        .nf-content { position: relative; z-index: 1; max-width: 640px; width: 100%; }
        .nf-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,150,136,0.1);
          border: 1px solid rgba(0,150,136,0.25);
          color: #009688;
          padding: 0.45rem 1.2rem;
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 2rem;
          animation: slideUp 0.5s ease-out forwards;
          letter-spacing: 0.05em;
        }
        .nf-badge-dot {
          width: 7px; height: 7px;
          background: #009688;
          border-radius: 50%;
          animation: blink 1.4s ease-in-out infinite;
        }
        .nf-number-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          animation: slideUp 0.6s ease-out 0.1s both;
        }
        .nf-ring-outer {
          position: absolute;
          width: 220px; height: 220px;
          border: 2px dashed rgba(0,150,136,0.25);
          border-radius: 50%;
          animation: spinSlow 18s linear infinite;
        }
        .nf-ring-inner {
          position: absolute;
          width: 170px; height: 170px;
          border: 1.5px dashed rgba(0,150,136,0.15);
          border-radius: 50%;
          animation: spinReverse 12s linear infinite;
        }
        .nf-number {
          font-size: clamp(7rem, 20vw, 10rem);
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, #009688 0%, #00796b 40%, #4db6ac 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textGlow 3s ease-in-out infinite, floatY 5s ease-in-out infinite;
          letter-spacing: -0.04em;
          position: relative;
          z-index: 2;
        }
        .nf-compass {
          margin: 0 auto 2.5rem;
          animation: floatY 6s ease-in-out infinite 1s, slideUp 0.7s ease-out 0.2s both;
        }
        .nf-compass-ring { animation: spinSlow 20s linear infinite; transform-origin: center; }
        .nf-compass-needle { animation: spinReverse 3s ease-in-out infinite; transform-origin: 50px 50px; }
        .nf-title {
          font-size: clamp(1.6rem, 5vw, 2.2rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
          animation: slideUp 0.7s ease-out 0.3s both;
        }
        .nf-desc {
          font-size: 1.05rem;
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 2.5rem;
          animation: slideUp 0.7s ease-out 0.4s both;
        }
        .nf-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: slideUp 0.7s ease-out 0.5s both;
        }
        .nf-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, #009688, #00796b);
          color: #fff;
          border-radius: 1rem;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 8px 25px rgba(0,150,136,0.35);
          border: none;
          cursor: pointer;
        }
        .nf-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,150,136,0.45);
        }
        .nf-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 2rem;
          background: #fff;
          color: #009688;
          border-radius: 1rem;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,150,136,0.2);
        }
        .nf-btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          border-color: #009688;
        }
        .nf-divider {
          width: 60px; height: 3px;
          background: linear-gradient(90deg, transparent, #009688, transparent);
          border-radius: 2px;
          margin: 0 auto 2rem;
          animation: slideUp 0.7s ease-out 0.35s both;
        }
        @media (max-width: 480px) {
          .nf-actions { flex-direction: column; align-items: center; }
          .nf-btn-primary, .nf-btn-secondary { width: 100%; justify-content: center; }
          .nf-ring-outer { width: 160px; height: 160px; }
          .nf-ring-inner { width: 120px; height: 120px; }
        }
      `}</style>

      <canvas ref={canvasRef} className="nf-canvas" />

      <div className="nf-wrap">
        <div className="nf-orb-1" />
        <div className="nf-orb-2" />

        <div className="nf-content">
          {/* Badge */}
          <div className="nf-badge">
            <span className="nf-badge-dot" />
            خطأ في الصفحة
          </div>

          {/* Giant 404 with rings */}
          <div className="nf-number-wrap">
            <div className="nf-ring-outer" />
            <div className="nf-ring-inner" />
            <span className="nf-number">404</span>
          </div>

          {/* Animated Compass SVG */}
          <svg
            className="nf-compass"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer ring */}
            <circle cx="50" cy="50" r="46" stroke="rgba(0,150,136,0.2)" strokeWidth="1.5" />
            {/* Spinning dashed ring */}
            <circle
              className="nf-compass-ring"
              cx="50" cy="50" r="40"
              stroke="rgba(0,150,136,0.35)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            {/* Tick marks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 50 + 36 * Math.cos(rad);
              const y1 = 50 + 36 * Math.sin(rad);
              const x2 = 50 + 42 * Math.cos(rad);
              const y2 = 50 + 42 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,150,136,0.4)" strokeWidth="1.5" strokeLinecap="round" />;
            })}
            {/* N/S/E/W Labels */}
            <text x="50" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#009688">N</text>
            <text x="50" y="88" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#009688" dominantBaseline="hanging" dy="-2">S</text>
            <text x="86" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#009688">E</text>
            <text x="14" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#009688">W</text>
            {/* Spinning needle */}
            <g className="nf-compass-needle">
              {/* North needle (teal) */}
              <polygon points="50,20 46,50 50,46 54,50" fill="#009688" opacity="0.9" />
              {/* South needle (gray) */}
              <polygon points="50,80 46,50 50,54 54,50" fill="#94a3b8" opacity="0.7" />
            </g>
            {/* Center dot */}
            <circle cx="50" cy="50" r="4" fill="#009688" />
            <circle cx="50" cy="50" r="2" fill="#fff" />
          </svg>

          <div className="nf-divider" />

          <h1 className="nf-title">عذراً، لم نعثر على هذه الصفحة!</h1>
          <p className="nf-desc">
            يبدو أن البوصلة أضاعت الطريق 🧭<br />
            الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.
          </p>

          <div className="nf-actions">
            <Link href="/" className="nf-btn-primary">
              <i className="fa-solid fa-house" />
              العودة للرئيسية
            </Link>
            <Link href="/?s=" className="nf-btn-secondary">
              <i className="fa-solid fa-magnifying-glass" />
              تصفح الدليل
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
