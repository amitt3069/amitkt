// site.js - client rendering for posts and basic UI
const CONFIG_PATH = '/site-config.json';
const POSTS_INDEX = '/posts/index.json';
let siteConfig = {};
let postsIndex = [];
let currentLang = localStorage.getItem('lang') || 'en';

async function loadConfig(){
  try{ const res = await fetch(CONFIG_PATH); siteConfig = await res.json(); document.getElementById('site-title').textContent = siteConfig.siteTitle || 'Site'; document.getElementById('footer-title').textContent = siteConfig.siteTitle || 'Site';
    document.getElementById('header-image').style.backgroundImage = `url(${siteConfig.headerImage || '/assets/placeholder.svg'})`; }
  catch(e){console.warn('No site-config.json',e)}
}

async function loadIndex(){
  const res = await fetch(POSTS_INDEX); postsIndex = await res.json(); renderList(postsIndex);
}

function readingTime(text){ const words = text.split(/\s+/).length; return Math.max(1, Math.round(words/200)); }

function renderList(posts){
  const list = document.getElementById('posts-list'); list.innerHTML='';
  posts.sort((a,b)=> new Date(b.date)-new Date(a.date));
  posts.forEach(p=>{
    const card = document.createElement('article'); card.className='post-card';
    const img = document.createElement('img'); img.loading='lazy'; img.alt = p.title || p.title_en || '';
    img.src = p.thumbnail || '/assets/placeholder.svg'; card.appendChild(img);
    const body = document.createElement('div'); body.className='card-body';
    const h3 = document.createElement('h3'); h3.className='card-title'; h3.textContent = p.title || p.title_en || p.slug; body.appendChild(h3);
    const meta = document.createElement('div'); meta.className='card-meta'; meta.textContent = `${p.date} • ${p.tags? p.tags.join(', '):''}`; body.appendChild(meta);
    card.appendChild(body);
    card.addEventListener('click',()=> openPost(p.slug));
    list.appendChild(card);
  })
}

async function openPost(slug){
  const postArea = document.getElementById('post-view');
  const meta = postsIndex.find(x=>x.slug===slug); if(!meta) return;
  const lang = currentLang || siteConfig.default_language || 'en';
  const path = `/posts/${slug}.${lang}.md`;
  const fallback = `/posts/${slug}.en.md`;
  let md='';
  try{ const r = await fetch(path); if(!r.ok) throw new Error('no'); md = await r.text(); }
  catch(e){ const r2 = await fetch(fallback); md = await r2.text(); }
  document.getElementById('post-title').textContent = meta.title || meta.title_en || meta.slug;
  document.getElementById('post-meta').textContent = `${meta.date} • ${readingTime(md)} min read`;
  const hero = document.getElementById('post-hero'); hero.src = meta.thumbnail || '/assets/placeholder.svg'; hero.alt = meta.title || meta.slug;
  document.getElementById('post-content').innerHTML = marked.parse(md);
  history.replaceState(null,'', `?post=${slug}`);
  document.getElementById('posts-list').hidden = true; postArea.hidden = false;
  window.scrollTo(0,0);
}

function showList(){ document.getElementById('posts-list').hidden = false; document.getElementById('post-view').hidden = true; history.replaceState(null,'','/'); }

function setupLangToggle(){ const btn = document.getElementById('lang-toggle'); btn.addEventListener('click',()=>{ currentLang = (currentLang==='en')?'hi':'en'; localStorage.setItem('lang',currentLang); btn.textContent = currentLang.toUpperCase() + ' / हिन्दी'; loadIndex(); }); btn.textContent = (currentLang==='en')? 'EN / हिन्दी' : 'EN / हिन्दी'; }

function setupSearch(){ const input = document.getElementById('search'); input.addEventListener('input', ()=>{ const q = input.value.trim(); if(!q) return renderList(postsIndex); const fuse = new Fuse(postsIndex, {keys:['title_en','title_hi','excerpt_en','excerpt_hi','tags'], threshold:0.4}); const results = fuse.search(q).map(r=>r.item); renderList(results); }); }

function setupBackLink(){ document.getElementById('back-to-list').addEventListener('click',(e)=>{ e.preventDefault(); showList(); }); }

function setupDarkMode(){ const btn = document.getElementById('dark-toggle'); btn.addEventListener('click',()=>{ document.documentElement.classList.toggle('dark'); }); }

function readingProgress(){ const prog = document.getElementById('reading-progress'); if(!prog) return; window.addEventListener('scroll', ()=>{ const h = document.documentElement; const st = h.scrollTop || document.body.scrollTop; const sh = h.scrollHeight - h.clientHeight; const pct = (st/sh)*100; prog.firstElementChild.style.width = pct + '%'; }); }

// init
(async function(){ await loadConfig(); await loadIndex(); setupLangToggle(); setupSearch(); setupBackLink(); setupDarkMode(); readingProgress(); // route
  const params = new URLSearchParams(location.search); const p = params.get('post'); if(p) openPost(p);
})();
