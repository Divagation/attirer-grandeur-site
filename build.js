#!/usr/bin/env node

/**
 * Static Site Generator for Attirer Grandeur
 * Builds HTML from markdown posts and generates RSS feed
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base path for GitHub Pages (e.g., '/attirer-grandeur-site' or '' for root domain)
const BASE_PATH = process.env.BASE_PATH || '';

// Paths
const CONTENT_DIR = path.join(__dirname, 'content', 'posts');
const SRC_DIR = path.join(__dirname, 'src');
const PUBLIC_DIR = path.join(__dirname, 'public');
const ASSETS_DIR = path.join(__dirname, 'assets');
const BLOG_DIR = path.join(PUBLIC_DIR, 'blog');

// Site metadata
const SITE = {
  title: 'Attirer Grandeur',
  description: 'A collective celebrating creative excellence',
  url: 'https://attirergrandeur.com',
  author: 'Attirer Grandeur'
};

/**
 * Add base path to URL
 */
function url(path) {
  return BASE_PATH + path;
}

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

/**
 * Copy file from src to dest
 */
async function copyFile(src, dest) {
  await fs.copyFile(src, dest);
}

/**
 * Read and parse all blog posts
 */
async function getPosts() {
  const files = await fs.readdir(CONTENT_DIR);
  const posts = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(CONTENT_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: body } = matter(content);

    const slug = file.replace(/\.md$/, '');
    const html = marked.parse(body);

    posts.push({
      slug,
      title: data.title || 'Untitled',
      date: data.date ? new Date(data.date) : new Date(),
      excerpt: data.excerpt || '',
      body: html,
      ...data
    });
  }

  // Sort by date descending
  return posts.sort((a, b) => b.date - a.date);
}

/**
 * Format date for display
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date for RSS
 */
function formatRSSDate(date) {
  return date.toUTCString();
}

/**
 * Escape XML special characters
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate main index.html
 */
async function generateIndex(posts) {
  const template = await fs.readFile(path.join(SRC_DIR, 'index.html'), 'utf-8');
  const styles = await fs.readFile(path.join(SRC_DIR, 'styles.css'), 'utf-8');
  const script = await fs.readFile(path.join(SRC_DIR, 'script.js'), 'utf-8');

  // Generate blog preview section
  const recentPosts = posts.slice(0, 3);
  const blogPreview = recentPosts.length > 0 ? `
    <section class="journal-preview" id="journal">
      <h2>Journal</h2>
      <div class="posts-grid">
        ${recentPosts.map(post => `
          <article class="post-card">
            <time datetime="${post.date.toISOString()}">${formatDate(post.date)}</time>
            <h3><a href="${url(`/blog/${post.slug}.html`)}">${post.title}</a></h3>
            <p>${post.excerpt}</p>
          </article>
        `).join('')}
      </div>
      <a href="${url('/blog/')}" class="view-all">View all posts →</a>
    </section>
  ` : '';

  // Inject styles, script, and blog preview
  let html = template
    .replace('</head>', `<style>${styles}</style></head>`)
    .replace('</body>', `${blogPreview}<script>${script}</script></body>`);

  await fs.writeFile(path.join(PUBLIC_DIR, 'index.html'), html);
  console.log('✓ Generated index.html');
}

/**
 * Generate blog index page
 */
async function generateBlogIndex(posts) {
  const styles = await fs.readFile(path.join(SRC_DIR, 'styles.css'), 'utf-8');
  const script = await fs.readFile(path.join(SRC_DIR, 'script.js'), 'utf-8');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Journal — Attirer Grandeur</title>
  <meta name="description" content="Thoughts and updates from the Attirer Grandeur collective">
  <link rel="canonical" href="${SITE.url}/blog">
  <link rel="alternate" type="application/rss+xml" title="${SITE.title} RSS Feed" href="${SITE.url}/feed.xml">
  <style>${styles}</style>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <header class="blog-header">
    <h1><a href="${url('/')}">Attirer Grandeur</a></h1>
    <p>Journal</p>
  </header>

  <main id="main" class="blog-index">
    <div class="posts-list">
      ${posts.map(post => `
        <article class="post-card">
          <time datetime="${post.date.toISOString()}">${formatDate(post.date)}</time>
          <h2><a href="${url(`/blog/${post.slug}.html`)}">${post.title}</a></h2>
          <p>${post.excerpt}</p>
        </article>
      `).join('')}
    </div>
  </main>

  <footer class="site-footer">
    <p><a href="${url('/')}">← Back to home</a></p>
  </footer>

  <script>${script}</script>
</body>
</html>`;

  await ensureDir(BLOG_DIR);
  await fs.writeFile(path.join(BLOG_DIR, 'index.html'), html);
  console.log('✓ Generated blog/index.html');
}

/**
 * Generate individual blog post pages
 */
async function generatePosts(posts) {
  const styles = await fs.readFile(path.join(SRC_DIR, 'styles.css'), 'utf-8');
  const script = await fs.readFile(path.join(SRC_DIR, 'script.js'), 'utf-8');

  await ensureDir(BLOG_DIR);

  for (const post of posts) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} — Attirer Grandeur</title>
  <meta name="description" content="${post.excerpt}">
  <link rel="canonical" href="${SITE.url}/blog/${post.slug}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.excerpt}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${SITE.url}/blog/${post.slug}">
  <meta property="article:published_time" content="${post.date.toISOString()}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.excerpt}">
  <style>${styles}</style>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <header class="blog-header">
    <h1><a href="${url('/')}">Attirer Grandeur</a></h1>
  </header>

  <main id="main" class="post-content">
    <article>
      <header class="post-header">
        <time datetime="${post.date.toISOString()}">${formatDate(post.date)}</time>
        <h1>${post.title}</h1>
      </header>
      <div class="prose">
        ${post.body}
      </div>
    </article>
  </main>

  <footer class="site-footer">
    <p><a href="${url('/blog/')}">← Back to journal</a></p>
  </footer>

  <script>${script}</script>
</body>
</html>`;

    await fs.writeFile(path.join(BLOG_DIR, `${post.slug}.html`), html);
    console.log(`✓ Generated blog/${post.slug}.html`);
  }
}

/**
 * Generate RSS feed
 */
async function generateRSS(posts) {
  const items = posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE.url}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${formatRSSDate(post.date)}</pubDate>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.title}</title>
    <link>${SITE.url}</link>
    <description>${SITE.description}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRSSDate(new Date())}</lastBuildDate>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  await fs.writeFile(path.join(PUBLIC_DIR, 'feed.xml'), rss);
  console.log('✓ Generated feed.xml');
}

/**
 * Copy static assets
 */
async function copyAssets() {
  await ensureDir(path.join(PUBLIC_DIR, 'assets'));

  try {
    const assets = await fs.readdir(ASSETS_DIR);
    for (const asset of assets) {
      await copyFile(
        path.join(ASSETS_DIR, asset),
        path.join(PUBLIC_DIR, 'assets', asset)
      );
    }
    console.log('✓ Copied assets');
  } catch (err) {
    console.log('⚠ No assets to copy');
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('🏗️  Building Attirer Grandeur site...\n');

  try {
    // Ensure output directory exists
    await ensureDir(PUBLIC_DIR);

    // Get all posts
    const posts = await getPosts();
    console.log(`📝 Found ${posts.length} posts\n`);

    // Generate all pages
    await generateIndex(posts);
    await generateBlogIndex(posts);
    await generatePosts(posts);
    await generateRSS(posts);
    await copyAssets();

    console.log('\n✨ Build complete! Output in public/');
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

// Run build
build();
