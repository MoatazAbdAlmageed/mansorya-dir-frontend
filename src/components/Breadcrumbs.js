import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '2.5rem' }}>
      <ol style={{ 
        listStyle: 'none', 
        padding: 0, 
        display: 'flex', 
        flexWrap: 'wrap',
        alignItems: 'center', 
        gap: '0.8rem', 
        fontSize: '1rem',
        color: 'var(--text-muted)'
      }}>
        <li>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <i className="fa-solid fa-house" style={{ fontSize: '0.9rem' }}></i>
            الرئيسية
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <i className="fa-solid fa-chevron-left" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
            {item.href ? (
              <Link href={item.href} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} className="breadcrumb-link">
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--primary)', fontWeight: 'bold', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
