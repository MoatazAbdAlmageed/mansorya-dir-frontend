import React from 'react';

export default function Loading() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="loader-visual">
          <div className="prism-loader"></div>
          <div className="loader-rings">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p className="loader-text">جاري التحميل...</p>
      </div>
    </div>
  );
}
