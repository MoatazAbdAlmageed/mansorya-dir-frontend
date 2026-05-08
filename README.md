# Mansorya Directory — Frontend

A modern, high-performance business directory web app for the **Mansorya** region, built with **Next.js 16** and powered by a **WordPress REST API** backend.

Live: [mansorya-dir-frontend.vercel.app](https://mansorya-dir-frontend.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (ES2024) |
| Styling | Vanilla CSS (custom design system) |
| Animations | Framer Motion |
| Icons | Font Awesome 6 |
| CMS Backend | WordPress + ACF (Advanced Custom Fields) |
| PWA | next-pwa |
| Deployment | Vercel (ISR) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.js                  # Root layout, nav, footer, PWA, FA icons
│   ├── page.js                    # Homepage — category explorer + listing grid
│   ├── loading.js                 # Global top-bar loading indicator
│   ├── not-found.js               # Custom 404 page
│   ├── globals.css                # Full design system (tokens, components, responsive)
│   ├── directory/
│   │   └── [slug]/page.js         # Single listing detail page
│   └── directory_category/
│       └── [slug]/page.js         # Category archive page
├── components/
│   ├── Breadcrumbs.js             # Hierarchical breadcrumb navigation
│   ├── ListingInteractions.js     # Comments + star rating system (client)
│   ├── PhotoGallery.js            # Horizontal scroll gallery with lightbox (client)
│   ├── VideoGallery.js            # YouTube / Facebook / direct video embeds (client)
│   ├── PWAInstallPrompt.js        # Install-to-homescreen modal (client)
│   ├── ScrollToTop.js             # Floating scroll-to-top button (client)
│   ├── SearchBar.js               # Live search bar (client)
│   └── Spinner.js                 # Top-bar loading indicator
└── lib/
    └── wp.js                      # All WordPress REST API helpers
```

---

## Features

- **ISR (Incremental Static Regeneration)** — pages revalidate every hour; all 500+ listings are pre-rendered at build time
- **Full directory listing pages** with contact info, social links, photo gallery, and video gallery
- **Category hierarchy** — parent/child category navigation with breadcrumbs
- **Comments & star ratings** — submitted directly to the WordPress REST API
- **PWA** — installable as a mobile app with a custom install prompt
- **RTL layout** — fully Arabic-first design using the Cairo font
- **Responsive** — mobile, tablet, and desktop breakpoints
- **Top-bar page loader** — slim animated progress bar instead of a blocking spinner

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# WordPress REST API base URL (required)
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json/wp/v2

# WordPress credentials for the "Add Business" submission endpoint
WP_USER=your_wp_username
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

> `WP_APP_PASSWORD` is a WordPress **Application Password** (Settings → Users → Application Passwords).

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start the production server locally
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## WordPress Setup Requirements

The backend WordPress site must have the following configured:

1. **Custom Post Type** — `directory` registered and exposed to the REST API
2. **Custom Taxonomy** — `directory_category` registered and exposed to the REST API
3. **ACF Fields** exposed to REST API — including:
   - `phone`, `whatsapp`, `address`, `google_map`
   - `email`, `website`, `cv`
   - `facebook`, `instagram`, `twitter`, `youtube`, `telegram`, `linkedin`, `behance`
   - `description`, `notes`, `image_url`, `gallery`, `videos`
4. **Custom REST API fields** (added in `functions.php`):
   - `pb_directory_gallery` — photo gallery image array
   - `pb_video_gallery` — video URL array
5. **Comments enabled** on the `directory` post type
6. **CORS headers** configured to allow requests from your frontend domain

---

## Deployment (Vercel)

1. Push to your GitHub repository
2. Import the project in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel project settings
4. Deploy — Vercel will run `npm run build`, pre-rendering all 500+ listing pages via `generateStaticParams`

> Pages not pre-rendered at build time are served via ISR on first request and cached automatically.

---

## Key Architecture Notes

### Arabic Slug Handling
WordPress stores Arabic slugs in percent-encoded form (e.g. `%d9%85%d8%b9%d8%aa%d8%b2-...`). Next.js automatically decodes URL params, so the page component receives decoded Unicode text (e.g. `معتز-محمدي-عبدالمجيد`). The API helper in `wp.js` re-encodes slugs with `encodeURIComponent` before passing them to the WP REST API query string. `generateStaticParams` receives decoded slugs to avoid double-encoding on Vercel.

### External Images
Listing featured images come from user-supplied ACF `image_url` fields, which can point to any domain (Behance, Facebook CDN, Dropbox, etc.). Plain `<img>` tags are used intentionally instead of `next/image` to avoid the `remotePatterns` whitelist problem.

### ISR Revalidation
All pages use `export const revalidate = 3600` (1 hour). Individual `fetch()` calls also pass `{ next: { revalidate: 3600 } }` to enable granular cache control at the data layer.

---

## License

Private project. All rights reserved.
