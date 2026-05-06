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
  return fetchAPI(`/directory${params}`);
}

export async function getDirectory(slug) {
  const posts = await fetchAPI(`/directory?slug=${slug}`);
  return posts[0];
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

