/* ============================================================
   BLOG.JS — Blog post management with localStorage
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'naim_blog_posts';

  /* ── DEFAULT / HARDCODED POSTS ── */
  const DEFAULT_POSTS = [
    {
      id:       'mnist-from-scratch',
      slug:     'posts/mnist-from-scratch.html',
      title:    'I Taught a Computer to Read Handwriting Using Only Math',
      date:     '2026-02-19',
      dateStr:  'Feb 2026',
      category: 'Tutorial',
      readtime: '15 min read',
      excerpt:  'A step-by-step guide to building a neural network from scratch — no TensorFlow, no PyTorch, just NumPy and math. Achieve 97%+ accuracy on MNIST handwritten digits.',
      dynamic:  false
    },
    {
      id:       'wgan-gp',
      slug:     'posts/wgan-gp.html',
      title:    'Why WGAN-GP Changed the Way I Think About Generative Models',
      date:     '2025-11-15',
      dateStr:  'Nov 2025',
      category: 'GAN',
      readtime: '6 min read',
      excerpt:  'Training GANs is notoriously unstable. I reflect on how the Wasserstein distance and gradient penalty transformed my thesis work on SSVEP data augmentation.',
      dynamic:  false
    },
    {
      id:       'cross-subject-eeg',
      slug:     'posts/cross-subject-eeg.html',
      title:    'Reflections on Cross-Subject EEG Generalization',
      date:     '2025-10-20',
      dateStr:  'Oct 2025',
      category: 'Research',
      readtime: '5 min read',
      excerpt:  'One of the hardest problems in BCI research is making models that work across different people. Here\'s what I learned building a subject-independent neural architecture.',
      dynamic:  false
    },
    {
      id:       'pytorch-timeseries',
      slug:     'posts/pytorch-timeseries.html',
      title:    'Getting Started with PyTorch for Time-Series Deep Learning',
      date:     '2025-09-10',
      dateStr:  'Sep 2025',
      category: 'Tutorial',
      readtime: '7 min read',
      excerpt:  'A practical guide to building 1D convolutional networks for time-series classification in PyTorch, with lessons from EEG signal processing.',
      dynamic:  false
    }
  ];

  /* ── STORAGE HELPERS ── */
  function getDynamicPosts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveDynamicPosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function getAllPosts() {
    const dynamic = getDynamicPosts();
    return [...dynamic, ...DEFAULT_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function getPostById(id) {
    const dynamic = getDynamicPosts();
    return dynamic.find(p => p.id === id) || null;
  }

  function deletePost(id) {
    const dynamic = getDynamicPosts().filter(p => p.id !== id);
    saveDynamicPosts(dynamic);
  }

  function slugify(str) {
    return str.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  }

  function estimateReadTime(content) {
    const wpm = 220;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wpm)) + ' min read';
  }

  /* ── BLOG LISTING PAGE ── */
  function initBlogListing() {
    const grid        = document.getElementById('blogGrid');
    const drawer      = document.getElementById('addPostDrawer');
    const toggleBtn   = document.getElementById('toggleDrawer');
    const cancelBtn   = document.getElementById('cancelPost');
    const submitBtn   = document.getElementById('submitPost');
    const filterBtns  = document.querySelectorAll('.filter-btn');

    if (!grid) return;

    let activeFilter = 'all';

    // Render posts
    function render() {
      const posts = getAllPosts();
      const filtered = activeFilter === 'all'
        ? posts
        : posts.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

      grid.innerHTML = '';

      if (!filtered.length) {
        grid.innerHTML = `
          <div class="blog-empty">
            <div class="blog-empty__icon">📭</div>
            <div class="blog-empty__title">No posts in this category yet</div>
            <div class="blog-empty__desc">Try a different filter or add your first post.</div>
          </div>`;
        return;
      }

      filtered.forEach((post, i) => {
        const card = document.createElement('a');
        card.className = 'post-card reveal' + (post.dynamic ? ' post-card--dynamic' : '');
        card.href = post.dynamic ? `posts/dynamic.html?id=${post.id}` : post.slug;

        card.innerHTML = `
          <div class="post-card__top">
            <div class="post-card__meta">
              <span class="post-card__date">${post.dateStr}</span>
              <span class="post-card__cat">${post.category}</span>
            </div>
            <div class="post-card__title">${post.title}</div>
            <div class="post-card__excerpt">${post.excerpt}</div>
          </div>
          <div class="post-card__footer">
            <span class="post-card__read">Read post →</span>
            <span class="post-card__time">${post.readtime}</span>
          </div>`;

        grid.appendChild(card);

        // Trigger reveal
        setTimeout(() => card.classList.add('visible'), i * 80 + 100);

        // Delete button for dynamic posts
        if (post.dynamic) {
          const delBtn = document.createElement('button');
          delBtn.textContent = '✕';
          delBtn.title = 'Delete post';
          delBtn.style.cssText = `position:absolute;top:1rem;right:1rem;background:rgba(255,0,0,0.1);border:1px solid rgba(255,0,0,0.2);color:#ff6b6b;border-radius:3px;padding:0.2rem 0.5rem;font-size:0.65rem;cursor:pointer;font-family:'IBM Plex Mono',monospace;`;
          card.style.position = 'relative';
          delBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm(`Delete "${post.title}"?`)) {
              deletePost(post.id);
              render();
            }
          });
          card.appendChild(delBtn);
        }
      });
    }

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        render();
      });
    });

    // Drawer toggle
    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        const open = drawer.classList.toggle('open');
        toggleBtn.textContent = open ? '✕ Close' : '+ New Post';
      });
    }

    if (cancelBtn && drawer) {
      cancelBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        if (toggleBtn) toggleBtn.textContent = '+ New Post';
      });
    }

    // Submit
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const title    = document.getElementById('pTitle')?.value.trim();
        const category = document.getElementById('pCategory')?.value;
        const excerpt  = document.getElementById('pExcerpt')?.value.trim();
        const content  = document.getElementById('pContent')?.value.trim();

        if (!title || !excerpt || !content) {
          alert('Please fill in all required fields (title, excerpt, content).');
          return;
        }

        const now      = new Date().toISOString().split('T')[0];
        const id       = slugify(title) + '-' + Date.now();
        const dynamic  = getDynamicPosts();

        dynamic.unshift({
          id,
          slug:     `posts/dynamic.html?id=${id}`,
          title,
          date:     now,
          dateStr:  formatDate(now),
          category,
          readtime: estimateReadTime(content),
          excerpt,
          content,
          dynamic:  true
        });

        saveDynamicPosts(dynamic);

        // Reset form
        ['pTitle','pExcerpt','pContent'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });

        if (drawer) drawer.classList.remove('open');
        if (toggleBtn) toggleBtn.textContent = '+ New Post';

        render();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    render();
  }

  /* ── DYNAMIC POST VIEW PAGE ── */
  function initDynamicPost() {
    const container = document.getElementById('dynamicPostContainer');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');

    if (!id) {
      container.innerHTML = '<p style="color:var(--muted)">Post not found.</p>';
      return;
    }

    const post = getPostById(id);

    if (!post) {
      container.innerHTML = `
        <div class="post-header">
          <a href="../blog.html" class="post-header__back">← Back to Blog</a>
          <h1 class="post-header__title" style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:var(--white)">Post Not Found</h1>
          <p style="color:var(--muted);margin-top:1rem;">This post may have been deleted or the link is invalid.</p>
        </div>`;
      return;
    }

    // Update page title
    document.title = `${post.title} — Zannatul Naim`;

    // Render post
    const contentHtml = post.content
      ? post.content
          .split('\n\n')
          .filter(p => p.trim())
          .map(p => {
            if (p.startsWith('## ')) return `<h2>${p.slice(3)}</h2>`;
            if (p.startsWith('# '))  return `<h2>${p.slice(2)}</h2>`;
            if (p.startsWith('> '))  return `<blockquote>${p.slice(2)}</blockquote>`;
            if (p.match(/^\d+\./))   return `<ol><li>${p.replace(/^\d+\.\s*/,'').split('\n').join('</li><li>')}</li></ol>`;
            if (p.startsWith('- '))  return `<ul><li>${p.replace(/^- /,'').split('\n- ').join('</li><li>')}</li></ul>`;
            return `<p>${p.replace(/\n/g, '<br>')}</p>`;
          }).join('\n')
      : '<p>No content.</p>';

    container.innerHTML = `
      <div class="post-header">
        <a href="../blog.html" class="post-header__back">← Back to Blog</a>
        <div class="post-header__meta">
          <span class="post-header__cat">${post.category}</span>
          <span class="post-header__date">${post.dateStr}</span>
          <span class="post-header__readtime">${post.readtime}</span>
        </div>
        <h1 class="post-header__title">${post.title}</h1>
        <p class="post-header__excerpt">${post.excerpt}</p>
      </div>
      <div class="post-body">${contentHtml}</div>
      <div class="post-nav" style="display:flex;justify-content:flex-start;margin-top:4rem;padding-top:2rem;border-top:1px solid var(--border);">
        <a href="../blog.html" class="post-nav__item" style="display:inline-flex;align-items:center;gap:0.5rem;font-family:'IBM Plex Mono',monospace;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan);border:1px solid rgba(0,212,255,0.3);padding:0.8rem 1.5rem;border-radius:3px;transition:all 0.3s;">
          ← All Posts
        </a>
      </div>`;
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    initBlogListing();
    initDynamicPost();
  });

})();
