// Modern site loader + article renderer
const CONFIG_PATH = '/site-config.json';
const POSTS_INDEX = '/posts/index.json';
let posts = [];
let activeCategory = 'all';
let currentLang = localStorage.getItem('lang') || 'en';
let currentSearch = '';

async function loadConfig() {
  try {
    const config = await fetch(CONFIG_PATH).then(r => r.json());
    document.getElementById('site-title').textContent = config.siteTitle || 'AmitKT';
    document.getElementById('site-subtitle').textContent = config.siteSubtitle || 'Indian Politics';
    const headerImage = config.headerImage || '/assets/placeholder.svg';
    document.querySelector('.brand-name').textContent = config.siteTitle || 'AmitKT';
    document.getElementById('footer-copy').textContent = '© ' + (new Date().getFullYear()) + ' ' + (config.siteTitle || 'AmitKT');
    document.documentElement.style.setProperty('--featured-banner', `url(${headerImage})`);
  } catch (e) {
    console.warn('Config not found, using defaults.', e);
  }
}

async function loadPosts() {
  try {
    const res = await fetch(POSTS_INDEX);
    posts = await res.json();
    renderFeatured();
    renderStories();
    renderTrending();
  } catch (e) {
    console.error('Unable to load posts', e);
  }
}

function filteredPosts() {
  let items = [...posts];
  if (activeCategory !== 'all') {
    items = items.filter(item => (item.category || 'National') === activeCategory);
  }
  if (currentSearch) {
    const fuse = new Fuse(items, {
      keys: ['title_en', 'title_hi', 'excerpt_en', 'excerpt_hi', 'tags', 'category'],
      threshold: 0.38
    });
    items = fuse.search(currentSearch).map(res => res.item);
  }
  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderFeatured() {
  const featuredArea = document.getElementById('featured-area');
  if (!posts.length) return;

  const feature = posts.find(item => item.featured) || posts[0];
  const image = feature.thumbnail || '/assets/placeholder.svg';
  const category = feature.category || 'National';
  const title = currentLang === 'hi' ? (feature.title_hi || feature.title_en) : (feature.title_en || feature.title_hi);
  const html = `
    <article class="hero-feature" data-slug="${feature.slug}">
      <div class="hero-media" style="background-image:url('${image}')">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-kicker">${category}</div>
          <h1 class="hero-title">${title}</h1>
          <div class="meta-row">
            <span>${feature.date}</span>
            <span>${feature.author || 'AmitKT'}</span>
            <span>${estimateReadTime(feature.excerpt_en || feature.excerpt_hi || '')} min read</span>
          </div>
        </div>
      </div>
    </article>
    <div class="side-stack">
      ${posts.slice(1, 3).map(item => {
        const cardTitle = currentLang === 'hi' ? (item.title_hi || item.title_en) : (item.title_en || item.title_hi);
        return `
          <article class="side-card" data-slug="${item.slug}">
            <img src="${item.thumbnail || '/assets/placeholder.svg'}" alt="${cardTitle}" />
            <div class="side-card-body">
              <div class="meta-row">
                <span>${item.category || 'National'}</span>
                <span>${item.date}</span>
              </div>
              <h3>${cardTitle}</h3>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;

  featuredArea.innerHTML = html;
  featuredArea.querySelectorAll('[data-slug]').forEach(el => {
    el.addEventListener('click', () => openPost(el.dataset.slug));
  });
}

function renderStories() {
  const list = document.getElementById('post-list');
  const items = filteredPosts().slice(0, 8);
  list.innerHTML = items.map(item => {
    const title = currentLang === 'hi' ? (item.title_hi || item.title_en) : (item.title_en || item.title_hi);
    const excerpt = currentLang === 'hi' ? (item.excerpt_hi || item.excerpt_en) : (item.excerpt_en || item.excerpt_hi);
    return `
      <article class="story-card" data-slug="${item.slug}">
        <img src="${item.thumbnail || '/assets/placeholder.svg'}" alt="${title}" loading="lazy" />
        <div class="story-card-body">
          <div class="tag">${item.category || 'National'}</div>
          <h3>${title}</h3>
          <p>${excerpt || ''}</p>
          <div class="story-meta">
            <span>${item.date}</span>
            <span>${estimateReadTime(excerpt)} min read</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  list.querySelectorAll('[data-slug]').forEach(el => {
    el.addEventListener('click', () => openPost(el.dataset.slug));
  });
}

function renderTrending() {
  const list = document.getElementById('trending-list');
  const items = filteredPosts().slice(0, 5);
  list.innerHTML = items.map((item, idx) => {
    const title = currentLang === 'hi' ? (item.title_hi || item.title_en) : (item.title_en || item.title_hi);
    return `
      <li>
        <div class="trending-rank">${idx + 1}</div>
        <strong>${title}</strong>
      </li>
    `;
  }).join('');
}

async function openPost(slug) {
  const post = posts.find(item => item.slug === slug);
  if (!post) return;

  const articleBody = document.getElementById('article-body');
  const articleTitle = document.getElementById('article-title');
  const articleMeta = document.getElementById('article-meta');
  const articleKicker = document.getElementById('article-kicker');
  const articleHero = document.getElementById('article-hero');

  const langFile = currentLang === 'hi' ? `${slug}.hi.md` : `${slug}.en.md`;
  let markdown = '';
  try {
    const response = await fetch(`/posts/${langFile}`);
    if (!response.ok) throw new Error('fallback');
    markdown = await response.text();
  } catch (e) {
    const fallback = await fetch(`/posts/${slug}.en.md`).then(r => r.text());
    markdown = fallback;
  }

  const fileTitle = currentLang === 'hi' ? (post.title_hi || post.title_en) : (post.title_en || post.title_hi);
  articleTitle.textContent = fileTitle;
  articleMeta.textContent = `${post.date} • ${post.author || 'AmitKT'} • ${estimateReadTime(markdown)} min read`;
  articleHero.src = post.thumbnail || '/assets/placeholder.svg';
  articleHero.alt = fileTitle;
  articleKicker.textContent = post.category || 'National';
  articleBody.innerHTML = marked.parse(markdown);

  document.getElementById('post-list').classList.add('hidden');
  document.getElementById('featured-area').classList.add('hidden');
  document.getElementById('post-view').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePost() {
  document.getElementById('post-view').classList.add('hidden');
  document.getElementById('featured-area').classList.remove('hidden');
  document.getElementById('post-list').classList.remove('hidden');
  window.history.replaceState({}, '', '/');
}

function estimateReadTime(text) {
  const words = (text || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 190));
}

function bindEvents() {
  document.getElementById('back-to-list').addEventListener('click', closePost);

  document.getElementById('search').addEventListener('input', (event) => {
    currentSearch = event.target.value.trim();
    renderStories();
    renderTrending();
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(btn => btn.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category;
      renderStories();
      renderTrending();
    });
  });

  document.getElementById('lang-toggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('lang', currentLang);
    renderFeatured();
    renderStories();
    renderTrending();
  });

  document.getElementById('dark-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

(async function init() {
  await loadConfig();
  await loadPosts();
  bindEvents();
})();
