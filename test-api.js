async function test() {
  const url = 'http://dir.local/wp-json/wp/v2/directory_category';
  console.log(`Testing fetch to: ${url}`);
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log(`Data length: ${Array.isArray(data) ? data.length : 'Not an array'}`);
    if (Array.isArray(data) && data.length > 0) {
      console.log(`First item: ${data[0].name}`);
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
test();
