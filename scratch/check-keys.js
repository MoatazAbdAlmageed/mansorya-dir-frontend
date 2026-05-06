const API_URL = 'https://mansorya.wp1.host/wp-json/wp/v2';
async function run() {
  const slug = encodeURIComponent('مستشفى-السلمى-التخصصي');
  const res = await fetch(`https://mansorya.wp1.host/wp-json/wp/v2/directory?slug=${slug}`);
  const posts = await res.json();
  if (posts.length > 0) {
    console.log('Title:', posts[0].title.rendered);
    console.log('ACF Gallery:', posts[0].acf.gallery);
    console.log('ACF Keys:', Object.keys(posts[0].acf));
  } else {
    console.log('Post not found');
  }
}
run();
