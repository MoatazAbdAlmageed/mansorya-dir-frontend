'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('s') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set('s', query.trim());
      // Clear category if searching globally
      params.delete('category');
    } else {
      params.delete('s');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '2.5rem auto', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن منشأة، تخصص، أو قسم..."
          dir="rtl"
          style={{ 
            width: '100%', 
            padding: '1.2rem 4rem 1.2rem 1.5rem', 
            borderRadius: '1.5rem', 
            border: '2px solid transparent',
            background: '#fff',
            fontSize: '1.1rem',
            outline: 'none',
            boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
            transition: 'all 0.3s'
          }}
          className="glass search-input"
        />
        <div style={{ 
          position: 'absolute', 
          right: '1.5rem', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: 'var(--primary)',
          fontSize: '1.3rem'
        }}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        
        {query && (
          <button 
            type="button"
            onClick={() => setQuery('')}
            style={{ 
              position: 'absolute', 
              left: '1.5rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
      
      <button type="submit" className="btn btn-primary" style={{ 
        marginTop: '1rem', 
        width: '100%', 
        justifyContent: 'center',
        display: 'none' // Hidden for now, search works on enter
      }}>
        بحث
      </button>
    </form>
  );
}
