import React from 'react';

export default function Spinner({ size = 'medium', text = 'جاري التحميل...' }) {
  const sizes = {
    small: '30px',
    medium: '50px',
    large: '80px'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="loader-visual" style={{ width: sizes[size], height: sizes[size] }}>
        <div className="prism-loader" style={{ width: `calc(${sizes[size]} * 0.6)`, height: `calc(${sizes[size]} * 0.6)` }}></div>
        <div className="loader-rings">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {text && <p className="loader-text" style={{ fontSize: size === 'small' ? '0.9rem' : '1.1rem' }}>{text}</p>}
    </div>
  );
}
