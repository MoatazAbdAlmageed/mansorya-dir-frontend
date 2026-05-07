import React from 'react';

export default function Spinner({ size = 'medium', text = 'جاري التحميل...' }) {
  const sizes = {
    small: '32px',
    medium: '48px',
    large: '64px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div 
        className="loader" 
        style={{ 
          width: sizes[size], 
          height: sizes[size],
          borderWidth: size === 'small' ? '3px' : '5px'
        }} 
      />
      {text && (
        <p className="loader-text" style={{ 
          marginTop: '1rem', 
          fontSize: size === 'small' ? '0.85rem' : '1rem'
        }}>
          {text}
        </p>
      )}
    </div>
  );
}
