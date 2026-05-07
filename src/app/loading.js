import React from 'react';

export default function Loading() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="loader"></div>
        <p className="loader-text">جاري التحميل...</p>
      </div>
    </div>
  );
}
