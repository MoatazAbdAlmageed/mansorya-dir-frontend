async function test() {
  const categoryId = '10211';
  const url = `http://dir.local/wp-json/wp/v2/directory?directory_category=${categoryId}`;
  console.log(`Testing fetch to: ${url}`);
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log(`Data length: ${Array.isArray(data) ? data.length : 'Not an array'}`);
    if (Array.isArray(data) && data.length > 0) {
      console.log(`First item title: ${data[0].title.rendered}`);
    } else {
      console.log('No data found. Response:', JSON.stringify(data));
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
test();
