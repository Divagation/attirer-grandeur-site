# Attirer Grandeur — Deployment Guide

## Overview

Complete, production-ready minimalist single-page website for the Attirer Grandeur brand.

## What's Included

✅ **Centered Hero** with large brand name and social buttons (Ko-fi, Instagram)
✅ **Scrolling Artist Strip** at bottom with clickable Instagram links
✅ **Blog System** with static generation from Markdown
✅ **RSS Feed** at /feed.xml
✅ **Full Accessibility** (WCAG AA, semantic HTML, reduced-motion support)
✅ **SEO Optimized** (meta tags, Open Graph, Twitter cards)
✅ **Performance** (minimal JS, no frameworks, fast load)
✅ **Responsive Design** (mobile-first, touch-friendly)

## Project Structure

```
attirer-grandeur-site/
├── content/posts/              # Markdown blog posts
│   ├── welcome-to-attirer-grandeur.md
│   └── the-art-of-intentional-creation.md
├── src/                        # Source files
│   ├── index.html             # Main page template
│   ├── styles.css             # Global styles
│   └── script.js              # Minimal client JS
├── assets/                     # Static assets (logos, icons)
├── public/                     # Generated output (git-ignored)
│   ├── index.html
│   ├── blog/
│   │   ├── index.html
│   │   └── {slug}.html
│   └── feed.xml
├── build.js                    # Static site generator
├── server.js                   # Dev server
├── package.json
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
cd attirer-grandeur-site
npm install
```

### 2. Build the Site

```bash
npm run build
```

This generates all HTML files in `public/` directory.

### 3. Run Dev Server

```bash
npm run serve
```

Visit http://localhost:3000

### 4. Development Mode

```bash
npm run dev
```

Builds and starts server in one command.

## Adding New Blog Posts

1. Create a new `.md` file in `content/posts/`:

```markdown
---
title: Your Post Title
date: 2025-03-15
excerpt: A compelling excerpt that appears in previews.
---

Your markdown content here...

## Headings work

- Lists work
- **Bold** and *italic* work
- [Links](https://example.com) work

Code blocks work:
\`\`\`javascript
console.log('Hello world');
\`\`\`
```

2. Run `npm run build` to regenerate

3. New post appears on homepage and /blog

## Deployment Options

### Option 1: Netlify (Recommended)

1. Push to Git repository
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `public`
5. Deploy!

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "public"

[[redirects]]
  from = "/blog/:slug"
  to = "/blog/:slug.html"
  status = 200
```

### Option 2: Vercel

1. Import project to Vercel
2. Build command: `npm run build`
3. Output directory: `public`
4. Deploy!

**vercel.json** (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public"
}
```

### Option 3: GitHub Pages

1. Build locally: `npm run build`
2. Push `public/` to `gh-pages` branch:

```bash
git subtree push --prefix public origin gh-pages
```

Or use GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

### Option 4: Any Static Host

Build locally and upload the `public/` folder to:
- AWS S3 + CloudFront
- DigitalOcean Spaces
- Cloudflare Pages
- Render
- Railway
- Etc.

## Customization

### Change Colors

Edit CSS variables in `src/styles.css`:

```css
:root {
  --bg: #f8f9d2;       /* Background */
  --fg: #000000;       /* Text */
  --accent: #d4a574;   /* Accent */
  --muted: #e8e9c4;    /* Muted */
}
```

### Update Site Metadata

Edit constants in `build.js`:

```javascript
const SITE = {
  title: 'Attirer Grandeur',
  description: 'A collective celebrating creative excellence',
  url: 'https://attirergrandeur.com',
  author: 'Attirer Grandeur'
};
```

### Add/Remove Artists

Edit the artist strip section in `src/index.html`:

```html
<a href="https://instagram.com/username"
   class="artist-link"
   target="_blank"
   rel="noopener noreferrer">Artist Name</a>
```

Remember to duplicate in the second set for seamless scrolling!

### Modify Animations

Animation speed is controlled in `src/styles.css`:

```css
.artist-strip-track {
  animation: scroll-left 30s linear infinite; /* Change 30s */
}
```

## Performance Checklist

- ✅ No external dependencies loaded
- ✅ Inlined CSS (~8KB)
- ✅ Minimal JS (~2KB)
- ✅ System fonts (no web font downloads)
- ✅ SVG icons (inline, no image requests)
- ✅ Semantic HTML for fast parsing
- ✅ Lazy loading support built-in
- ✅ Reduced motion support

## Accessibility Features

- ✅ Skip-to-content link
- ✅ Semantic landmarks (main, header, footer, nav)
- ✅ ARIA labels on buttons and links
- ✅ Keyboard navigable
- ✅ Focus visible styles
- ✅ Color contrast WCAG AA compliant
- ✅ Reduced motion preference respected
- ✅ Screen reader friendly
- ✅ rel="noopener" on external links

## SEO Features

- ✅ Meta descriptions
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter cards
- ✅ RSS feed
- ✅ Semantic HTML
- ✅ Mobile-first responsive
- ✅ Fast load times

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari iOS 12+
- Chrome Android

Graceful degradation for older browsers.

## License

© 2025 Attirer Grandeur. All rights reserved.

## Support

Questions or issues? Check the [README.md](README.md) or reach out to the Attirer Grandeur team.
