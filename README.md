# Attirer Grandeur Website

A minimalist single-page website for the Attirer Grandeur brand, featuring a centered hero, social links, scrolling artist roster, and a simple blog with RSS feed.

## Features

- **Minimalist Design**: Clean aesthetic using brand colors (cream #f8f9d2, black #000000)
- **Centered Hero**: Large logo with Ko-fi and Instagram buttons
- **Artist Roster**: Continuously scrolling bottom strip with Instagram links
- **Blog/Journal**: Static-generated posts from Markdown with RSS feed
- **Accessibility**: WCAG AA compliant, semantic HTML, reduced-motion support
- **Performance**: Fast-loading, minimal JavaScript, no frameworks

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

## Project Structure

```
attirer-grandeur-site/
├── content/
│   └── posts/           # Markdown blog posts
├── assets/
│   └── logo.svg         # Brand logo
├── src/
│   ├── index.html       # Main page template
│   ├── styles.css       # Global styles
│   └── script.js        # Minimal client JS
├── public/              # Generated output
│   ├── index.html
│   ├── blog/
│   │   ├── index.html
│   │   └── [slug].html
│   ├── feed.xml
│   └── assets/
├── build.js             # Static site generator
└── package.json
```

## Adding Blog Posts

1. Create a new `.md` file in `content/posts/`
2. Add frontmatter:
   ```markdown
   ---
   title: Your Post Title
   date: 2025-01-15
   excerpt: A brief description of your post.
   ---

   Your post content here...
   ```
3. Run `npm run build` to regenerate

## Deployment

### Netlify
1. Connect your Git repo
2. Build command: `npm run build`
3. Publish directory: `public`

### Vercel
1. Import project
2. Build command: `npm run build`
3. Output directory: `public`

### GitHub Pages
1. Run `npm run build`
2. Push `public/` directory to `gh-pages` branch

## Color Palette

```css
--bg: #f8f9d2;       /* Cream background */
--fg: #000000;       /* Black text */
--accent: #d4a574;   /* Warm accent */
--muted: #e8e9c4;    /* Muted cream */
```

## Artist Links

- BXHD: https://instagram.com/bxhd.music
- Hocs: https://instagram.com/hocswrites
- baa.haus: https://instagram.com/baa.haus
- amcena: https://instagram.com/producedbyamcena
- Swurvey: https://instagram.com/swurveycreations

## License

© 2025 Attirer Grandeur. All rights reserved.
