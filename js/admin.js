// admin.js - minimal admin UI with download and GitHub commit
const CONFIG_PATH = '/site-config.json';
const POSTS_INDEX = '/posts/index.json';
let siteConfig = {};
let postsIndex = [];
let editing = null;

async function loadConfigAndIndex(){
  try{ siteConfig = await (await fetch(CONFIG_PATH)).json(); }catch(e){ siteConfig = {}; }
  try{ postsIndex = await (await fetch(POSTS_INDEX)).json(); }catch(e){ postsIndex = []; }
  renderSettings(); renderPostsList();
}

function renderSettings(){ document.getElementById('cfg-title').value = siteConfig.siteTitle || ''; document.getElementById('cfg-author').value = siteConfig.defaultAuthor || ''; document.getElementById('cfg-header-image').value = siteConfig.headerImage || ''; document.getElementById('cfg-ad').value = siteConfig.ad_code || ''; document.getElementById('cfg-uploads').value = siteConfig.allow_image_uploads? 'true':'false'; }

function renderPostsList(){ const wrap = document.getElementById('posts-admin-list'); wrap.innerHTML=''; postsIndex.forEach(p=>{ const row = document.createElement('div'); row.className='post-row'; row.innerHTML = `<div><strong>${p.title_en||p.slug}</strong> <div class="muted">${p.date} • ${p.tags? p.tags.join(', '):''}</div></div>`;
  const actions = document.createElement('div'); const edit = document.createElement('button'); edit.textContent='Edit'; edit.className='btn'; edit.addEventListener('click',()=> openEditor(p.slug)); actions.appendChild(edit);
  row.appendChild(actions); wrap.appendChild(row);
  }) }

function openEditor(slug){ editing = postsIndex.find(x=>x.slug===slug); document.getElementById('editor-section').hidden=false; document.getElementById('editor-title').textContent = 'Edit ' + slug; document.getElementById('post-slug').value = editing.slug; document.getElementById('post-title-en').value = editing.title_en||''; document.getElementById('post-title-hi').value = editing.title_hi||''; document.getElementById('post-thumb').value = editing.thumbnail||''; document.getElementById('post-date').value = editing.date||''; document.getElementById('post-tags').value = (editing.tags||[]).join(','); document.getElementById('post-excerpt-en').value = editing.excerpt_en||''; document.getElementById('post-excerpt-hi').value = editing.excerpt_hi||'';
  // load bodies
  fetch(`/posts/${slug}.en.md`).then(r=>r.text()).then(t=>document.getElementById('post-body-en').value = t).catch(()=>{});
  fetch(`/posts/${slug}.hi.md`).then(r=>r.text()).then(t=>document.getElementById('post-body-hi').value = t).catch(()=>{});
}

function newPost(){ editing = null; document.getElementById('editor-section').hidden=false; document.getElementById('editor-title').textContent='New post'; ['post-slug','post-title-en','post-title-hi','post-thumb','post-date','post-tags','post-excerpt-en','post-excerpt-hi','post-body-en','post-body-hi'].forEach(id=>document.getElementById(id).value=''); }

function collectPost(){ const slug = document.getElementById('post-slug').value.trim(); if(!slug) throw new Error('Slug required'); const obj = { slug, title_en: document.getElementById('post-title-en').value.trim(), title_hi: document.getElementById('post-title-hi').value.trim(), thumbnail: document.getElementById('post-thumb').value.trim(), date: document.getElementById('post-date').value.trim() || new Date().toISOString().slice(0,10), tags: document.getElementById('post-tags').value.split(',').map(s=>s.trim()).filter(Boolean), excerpt_en: document.getElementById('post-excerpt-en').value.trim(), excerpt_hi: document.getElementById('post-excerpt-hi').value.trim() };
  return obj;
}

async function previewPost(){ const p = collectPost(); const en = document.getElementById('post-body-en').value; const hi = document.getElementById('post-body-hi').value; document.getElementById('preview-area').innerHTML = `<h3>${p.title_en}</h3>` + marked.parse(en || hi || ''); }

async function downloadZIP(){ const p = collectPost(); const en = document.getElementById('post-body-en').value; const hi = document.getElementById('post-body-hi').value; const zip = new JSZip(); zip.file(`posts/${p.slug}.en.md`, en || ''); zip.file(`posts/${p.slug}.hi.md`, hi || ''); // update index
  const updatedIndex = updateIndexFor(p, false);
  zip.file('posts/index.json', JSON.stringify(updatedIndex, null, 2)); zip.file('site-config.json', JSON.stringify(collectSiteConfig(), null, 2)); const content = await zip.generateAsync({type:'blob'}); const url = URL.createObjectURL(content); const a = document.createElement('a'); a.href = url; a.download = `${p.slug}-post.zip`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function collectSiteConfig(){ return { siteTitle: document.getElementById('cfg-title').value.trim(), defaultAuthor: document.getElementById('cfg-author').value.trim(), headerImage: document.getElementById('cfg-header-image').value.trim(), ad_code: document.getElementById('cfg-ad').value, allow_image_uploads: document.getElementById('cfg-uploads').value==='true' } }

function updateIndexFor(post, replaceExisting=true){ const idx = postsIndex.slice(); const found = idx.find(i=>i.slug===post.slug); const meta = {
  slug: post.slug,
  title_en: post.title_en || '',
  title_hi: post.title_hi || '',
  thumbnail: post.thumbnail || '',
  date: post.date,
  tags: post.tags || [],
  excerpt_en: post.excerpt_en || '',
  excerpt_hi: post.excerpt_hi || ''
};
  if(found){ Object.assign(found, meta); }
  else { idx.push(meta); }
  // save to local for download/commit
  postsIndex = idx; renderPostsList(); return idx;
}

async function commitToGitHub(){
  const token = document.getElementById('gh-token').value.trim(); const user = document.getElementById('gh-user').value.trim(); if(!token || !user) return alert('Provide GitHub username and token');
  const owner = 'amitt3069'; const repo = 'amitkt';
  const branchName = `posts-update-${Date.now()}`;
  // get default branch sha
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {headers: {Authorization: 'token '+token}});
  if(!repoRes.ok) return alert('Failed to fetch repo info: '+await repoRes.text());
  const repoJson = await repoRes.json(); const base = repoJson.default_branch;
  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${base}`, {headers: {Authorization: 'token '+token}});
  const refJson = await refRes.json(); const baseSha = refJson.object.sha;
  // create branch
  const createRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {method:'POST', headers:{Authorization: 'token '+token,'Content-Type':'application/json'}, body: JSON.stringify({ref:`refs/heads/${branchName}`, sha: baseSha})});
  if(!createRef.ok) return alert('Failed to create branch: '+await createRef.text());
  // collect files to commit
  const p = collectPost(); const en = document.getElementById('post-body-en').value; const hi = document.getElementById('post-body-hi').value; updateIndexFor(p,true);
  const files = [];
  files.push({path:`posts/${p.slug}.en.md`, content: btoa(unescape(encodeURIComponent(en || '')))});
  files.push({path:`posts/${p.slug}.hi.md`, content: btoa(unescape(encodeURIComponent(hi || '')))});
  files.push({path:`posts/index.json`, content: btoa(unescape(encodeURIComponent(JSON.stringify(postsIndex, null, 2))))});
  files.push({path:`site-config.json`, content: btoa(unescape(encodeURIComponent(JSON.stringify(collectSiteConfig(), null, 2))))});

  // create or update files via PUT with branch
  for(const f of files){
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(f.path)}`;
    // check existing
    const getRes = await fetch(url+'?ref='+base, {headers:{Authorization: 'token '+token}});
    if(getRes.ok){ const getJson = await getRes.json(); const sha = getJson.sha; const putRes = await fetch(url, {method:'PUT', headers:{Authorization: 'token '+token,'Content-Type':'application/json'}, body: JSON.stringify({message:`Update ${f.path}`, content: f.content, branch: branchName, sha})}); if(!putRes.ok) return alert('Failed to update '+f.path+': '+await putRes.text()); }
    else{
      const putRes = await fetch(url, {method:'PUT', headers:{Authorization: 'token '+token,'Content-Type':'application/json'}, body: JSON.stringify({message:`Add ${f.path}`, content: f.content, branch: branchName})}); if(!putRes.ok) return alert('Failed to create '+f.path+': '+await putRes.text()); }
  }

  // create PR
  const pr = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {method:'POST', headers:{Authorization: 'token '+token,'Content-Type':'application/json'}, body: JSON.stringify({title:`Add/Update post ${p.slug}`, head:branchName, base: base, body:`Created by admin UI`})});
  if(!pr.ok) return alert('Failed to create PR: '+await pr.text());
  alert('Created branch '+branchName+' and opened a PR.');
}

// basic delete post (local index update only)
function deletePost(){ if(!editing) return alert('Select a post'); if(!confirm('Delete post? This will remove it from index.json on next commit.')) return; postsIndex = postsIndex.filter(p=>p.slug!==editing.slug); renderPostsList(); document.getElementById('editor-section').hidden=true; }

// image upload to repo (requires token) - optional
async function uploadImageToRepo(file, token){ const owner='amitt3069', repo='amitkt', path=`assets/uploads/${Date.now()}-${file.name}`; const data = await file.arrayBuffer(); const b64 = btoa(String.fromCharCode(...new Uint8Array(data))); const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {method:'PUT', headers:{Authorization:'token '+token,'Content-Type':'application/json'}, body: JSON.stringify({message:`upload ${file.name}`, content: b64, branch: (await (await fetch(`https://api.github.com/repos/${owner}/${repo}`, {headers:{Authorization:'token '+token}})).json()).default_branch})}); if(!res.ok) throw new Error(await res.text()); const j = await res.json(); return j.content.download_url || `/${path}`; }

// event wiring
document.getElementById('unlock').addEventListener('click', ()=>{ const pass = document.getElementById('admin-pass').value; (async()=>{ await loadConfigAndIndex(); const allowed = siteConfig.admin_password || 'admin'; if(pass===allowed){ document.getElementById('locked-ui').hidden=true; document.getElementById('admin-ui').hidden=false; } else alert('Wrong password'); })(); });
document.getElementById('new-post').addEventListener('click', newPost);
document.getElementById('preview-post').addEventListener('click', previewPost);
document.getElementById('download-zip').addEventListener('click', downloadZIP);
document.getElementById('commit-github').addEventListener('click', commitToGitHub);
document.getElementById('save-settings').addEventListener('click', ()=>{ const cfg = collectSiteConfig(); const zip = new JSZip(); zip.file('site-config.json', JSON.stringify(cfg, null, 2)); zip.generateAsync({type:'blob'}).then(blob=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='site-config.json'; document.body.appendChild(a); a.click(); a.remove(); }); });
document.getElementById('delete-post').addEventListener('click', deletePost);

// initial load
loadConfigAndIndex();
