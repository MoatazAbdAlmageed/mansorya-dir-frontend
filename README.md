# Headless WordPress Directory (Next.js)

This is a premium frontend for your WordPress site at `http://dir.local/`.

## 🚀 Getting Started

1. **WordPress Configuration**:
   - Ensure the **ACF** plugin is active.
   - For each field group (Phonebook and Directory), go to **ACF -> Field Groups -> [Group Name] -> Settings** and toggle **"Show in REST API"** to ON.
   - Ensure your permalinks are set to something other than "Plain" (e.g., "Post name").

2. **Run the App**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **View the site**:
   Open [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack
- **Next.js 15+** (App Router)
- **WordPress REST API**
- **Vanilla CSS** (Premium Design System)
- **Lucide React** (Icons)
- **Framer Motion** (Animations)

## 📁 Structure
- `src/lib/wp.js`: API client for fetching data from WordPress.
- `src/app/globals.css`: Modern design system with glassmorphism.
- `src/app/directory/`: Archive and single pages for Business Directories.
- `src/app/phonebook/`: Listing page for Phonebook entries.
