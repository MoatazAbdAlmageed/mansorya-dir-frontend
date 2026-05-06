async function test() {
  const url = 'http://dir.local/wp-json/wp/v2/taxonomies/directory_category';
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Taxonomy Rest Base:', data.rest_base);
    console.log('Associated Types:', data.types);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
test();
