export default function manifest() {
  return {
    name: 'دليل المنصورية',
    short_name: 'المنصورية',
    description: 'دليل الخدمات والأعمال الشامل لمنطقة المنصورية',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#009688',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
