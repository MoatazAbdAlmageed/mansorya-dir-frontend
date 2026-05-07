const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      cache: 'no-store'
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
  const separator = params.includes('?') ? '&' : '?';
  return fetchAPI(`/directory${params}${separator}_embed`);
}

export async function getDirectory(slug) {
  const posts = await fetchAPI(`/directory?slug=${slug}&_embed`);
  return posts[0];
}

export function getFeaturedImage(post) {
  // 1. Check ACF field first
  if (post.acf?.image_url) return post.acf.image_url;
  
  // 2. Check WordPress Featured Image via _embedded
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  
  // 3. Fallback placeholder
  return '/icon-512x512.png'; 
}

export async function getCategories() {
  const page1 = await fetchAPI('/directory_category?per_page=100&hide_empty=false&page=1');
  
  // Only fetch page 2 if page 1 was full
  let page2 = [];
  if (Array.isArray(page1) && page1.length === 100) {
    page2 = await fetchAPI('/directory_category?per_page=100&hide_empty=false&page=2');
  }
  
  return [...page1, ...page2];
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

