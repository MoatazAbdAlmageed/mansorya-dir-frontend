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
  const [page1, page2] = await Promise.all([
    fetchAPI('/directory_category?per_page=100&hide_empty=false&page=1'),
    fetchAPI('/directory_category?per_page=100&hide_empty=false&page=2')
  ]);
  
  // Combine results, ensuring they are arrays
  const all = [...(Array.isArray(page1) ? page1 : []), ...(Array.isArray(page2) ? page2 : [])];
  return all;
}
