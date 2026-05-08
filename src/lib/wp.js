const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

// Revalidate cached data every hour (ISR). Override per-call via options.
const DEFAULT_REVALIDATE = 3600;

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: DEFAULT_REVALIDATE },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      if (res.status === 400 && errorData.code === 'rest_post_invalid_page_number') {
        return [];
      }
      console.error(`[WP API Error] ${res.status} ${res.statusText} at ${url}`, errorData);
      throw new Error(`Failed to fetch API: ${res.statusText} (${res.status})`);
    }

    return res.json();
  } catch (error) {
    console.error(`[WP API Fetch Failure] URL: ${url}`, error);
    throw error;
  }
}

export async function getDirectories(params = '') {
  // Ensure we don't duplicate _embed and handle query separators
  const hasEmbed = params.includes('_embed');
  const separator = params.includes('?') ? '&' : '?';
  const embedParam = hasEmbed ? '' : `${separator}_embed`;
  
  return fetchAPI(`/directory${params}${embedParam}`);
}

export async function getDirectory(slug) {
  // Next.js decodes percent-encoded params (e.g. Arabic slugs).
  // Re-encode so the WP REST API receives the correct encoded slug.
  const encodedSlug = encodeURIComponent(slug);
  const posts = await fetchAPI(`/directory?slug=${encodedSlug}&_embed`);
  return posts[0];
}

export function getFeaturedImage(post, size = 'full') {
  // 1. Check WordPress Featured Image via _embedded (Primary Source)
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  if (featuredMedia) {
    // If a specific size is requested and exists, use it
    if (size !== 'full' && featuredMedia.media_details?.sizes?.[size]) {
      return featuredMedia.media_details.sizes[size].source_url;
    }
    // Fallback to full source_url
    if (featuredMedia.source_url) {
      return featuredMedia.source_url;
    }
  }

  // 2. Check ACF field image_url (Legacy/External Source)
  if (post.acf?.image_url) return post.acf.image_url;
  
  // 3. Check ACF gallery (Another Fallback)
  if (post.acf?.gallery && Array.isArray(post.acf.gallery) && post.acf.gallery.length > 0) {
    const firstItem = post.acf.gallery[0];
    return firstItem.url || firstItem;
  }
  
  // 4. Final fallback placeholder
  return '/icon-512x512.png'; 
}

export async function getCategories() {
  const page1 = await fetchAPI('/directory_category?per_page=100&hide_empty=false&page=1');
  
  // Only fetch page 2 if page 1 was full (parallel if needed)
  let page2 = [];
  if (Array.isArray(page1) && page1.length === 100) {
    page2 = await fetchAPI('/directory_category?per_page=100&hide_empty=false&page=2');
  }
  
  return [...page1, ...page2];
}

// Fetch all directory slugs for generateStaticParams
export async function getAllDirectorySlugs() {
  try {
    const posts = await fetchAPI('/directory?per_page=100&fields=slug&page=1');
    return Array.isArray(posts) ? posts.map(p => p.slug).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export async function getAllCategorySlugs() {
  try {
    const cats = await getCategories();
    return cats.map(c => c.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  const categories = await fetchAPI(`/directory_category?slug=${slug}`);
  return categories[0];
}

export function buildCategoryPath(allCategories, currentCategoryId) {
  const path = [];
  let current = allCategories.find(cat => cat.id === currentCategoryId);
  
  while (current) {
    path.unshift({
      label: current.name,
      href: `/directory_category/${current.slug}`
    });
    
    if (current.parent === 0) break;
    current = allCategories.find(cat => cat.id === current.parent);
  }
  
  return path;
}

export async function createDirectory(data) {
  const response = await fetch(`${API_URL}/directory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization will be handled via a custom header or Application Passwords
      // For now, we assume the server/proxy handles this or the user provides it
      'Authorization': `Basic ${Buffer.from(`${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`).toString('base64')}`
    },
    body: JSON.stringify({
      ...data,
      status: 'pending'
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create directory');
  }

  return response.json();
}

export async function getComments(postId) {
  return fetchAPI(`/comments?post=${postId}&orderby=date&order=asc`);
}

export async function createComment(data) {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to post comment');
  }
  
  return response.json();
}

