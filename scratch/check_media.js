const API_URL = 'https://mansorya.wp1.host/wp-json/wp/v2';

async function searchGalleryHtml() {
  const url = `${API_URL}/directory?per_page=50`;
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    data.forEach(post => {
      const content = post.content.rendered;
      if (content.includes('directory-gallery')) {
        console.log(`FOUND 'directory-gallery' in content of: ${post.title.rendered}`);
        // console.log('Content Snippet:', content.substring(content.indexOf('directory-gallery'), content.indexOf('directory-gallery') + 200));
      }
    });
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

searchGalleryHtml();
