# Zannatul Naim — Portfolio

A clean, multi-page personal portfolio & blog built with **pure HTML, CSS, and vanilla JavaScript**. No frameworks, no build tools. Deploy directly to GitHub Pages.

---

## 📁 Project Structure

```
naim-portfolio/
├── index.html            ← Home / Landing page
├── about.html            ← About me, education, interests
├── research.html         ← Publications & thesis
├── skills.html           ← Technical skills & coursework
├── blog.html             ← Blog listing with filter + new post form
├── contact.html          ← Contact info & mailto form
│
├── posts/
│   ├── wgan-gp.html              ← Static blog post 1
│   ├── cross-subject-eeg.html    ← Static blog post 2
│   ├── pytorch-timeseries.html   ← Static blog post 3
│   └── dynamic.html              ← Template for localStorage-saved posts
│
├── css/
│   ├── base.css          ← Variables, reset, nav, footer, animations
│   ├── home.css          ← Home page specific styles
│   ├── inner.css         ← About, Research, Skills, Contact styles
│   └── blog.css          ← Blog listing & post reading styles
│
└── js/
    ├── main.js           ← Starfield, nav, scroll reveal, typed cursor
    └── blog.js           ← localStorage blog CRUD, rendering, filtering
```

---

## 🚀 Deploying to GitHub Pages

1. Create a repository named `yourusername.github.io`
2. Upload all files maintaining the folder structure above
3. Go to **Settings → Pages → Source → main branch → / (root)**
4. Your site goes live at `https://yourusername.github.io`

---

## ✍️ Adding Blog Posts

### Option A — Dynamic (localStorage, your device only)
1. Go to `blog.html`
2. Click **"+ New Post"**
3. Fill in title, category, excerpt, and content (Markdown-lite supported)
4. Click **Publish** — post saves to your browser and appears immediately

Posts survive page refresh but only exist on your device. Others visiting your site won't see them.

### Option B — Static (permanent, visible to everyone)
1. Copy `posts/wgan-gp.html` as a template
2. Edit the title, metadata, and body content
3. Add the post entry to `DEFAULT_POSTS` in `js/blog.js`
4. Push to GitHub → live for everyone

### Markdown-lite syntax in dynamic posts
- `## Heading` → `<h2>`
- `> Quote text` → `<blockquote>`
- `- List item` → `<ul><li>`
- `1. Item` → `<ol><li>`
- Blank lines between paragraphs → separate `<p>` tags

---

## 🎨 Design System

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#06080f` | Page background |
| `--cyan` | `#00d4ff` | Primary accent |
| `--gold` | `#ffc857` | Secondary accent (thesis, references) |
| `--white` | `#f0ece3` | Headings & emphasis |
| `--muted` | `#8892a4` | Body text |

**Fonts:** Cormorant Garamond (display) + IBM Plex Mono (code/labels) + DM Sans (body)

---

## 📝 License

© 2025 Zannatul Naim. All rights reserved.
