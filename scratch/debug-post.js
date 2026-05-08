const slug = '%d9%85%d8%b3%d8%aa%d8%b4%d9%81%d9%89-%d8%a7%d9%84%d8%b3%d9%84%d9%85%d9%89-%d8%a7%d9%84%d8%aa%d8%ae%d8%b5%d8%b5%d9%8a';
const url = `https://mansorya.wp1.host/wp-json/wp/v2/directory?slug=${slug}&_embed`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.length === 0) {
      console.log("No post found for slug:", decodeURIComponent(slug));
      return;
    }
    const post = data[0];
    console.log("Post Title:", post.title.rendered);
    console.log("ACF Fields:", JSON.stringify(post.acf, null, 2));
  })
  .catch(err => console.error("Error fetching post:", err));
