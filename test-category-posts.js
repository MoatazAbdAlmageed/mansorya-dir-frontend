// c:\Users\HP\Local Sites\dir\app\public\mansorya-dir-frontend\test-category-posts.js

async function verifyCategoryPosts() {
  const API_URL = 'http://dir.local/wp-json/wp/v2';
  
  // 1. First, let's get the first category
  const catRes = await fetch(`${API_URL}/directory_category?per_page=1`);
  const categories = await catRes.json();
  
  if (categories.length === 0) {
    console.log("❌ No categories found to test with.");
    return;
  }

  const testCat = categories[0];
  console.log(`Testing Category: ${testCat.name} (ID: ${testCat.id})`);

  // 2. Query posts for this specific category
  const postUrl = `${API_URL}/directory?directory_category=${testCat.id}&_embed`;
  console.log(`Testing API Link: ${postUrl}`);

  try {
    const res = await fetch(postUrl);
    const posts = await res.json();

    if (Array.isArray(posts)) {
      console.log(`✅ Success! Found ${posts.length} directory posts in this category.`);
      if (posts.length > 0) {
        console.log(`First Post Title: ${posts[0].title.rendered}`);
      }
    } else {
      console.log("❌ Error: API did not return an array. Check your functions.php filter.");
      console.log("Response:", posts);
    }
  } catch (err) {
    console.error("❌ Fetch failed. Make sure your local WP site is running.", err);
  }
}

verifyCategoryPosts();
