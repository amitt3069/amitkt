<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin | AmitKT</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/site.css" />
  <style>
    body { background: var(--bg); }
    .admin-shell {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 16px 60px;
    }
    .admin-panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 22px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .admin-header {
      padding: 24px 24px 14px;
      border-bottom: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .admin-header h1 { margin: 0; font-size: clamp(1.8rem, 2vw, 2.4rem); }
    .admin-body {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 0;
    }
    .sidebar-nav {
      background: var(--panel-alt);
      border-right: 1px solid var(--line);
      padding: 18px;
    }
    .nav-section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 12px; }
    .nav-item {
      display: block;
      padding: 12px 12px;
      border-radius: 12px;
      color: var(--secondary);
      font-weight: 600;
      margin-bottom: 8px;
      cursor: pointer;
      background: transparent;
      border: 1px solid transparent;
    }
    .nav-item.active {
      background: var(--panel);
      border-color: var(--line);
      color: var(--primary);
    }
    .content-area { padding: 22px; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    .field { display: flex; flex-direction: column; gap: 8px; }
    .field.full { grid-column: 1 / -1; }
    label { font-size: 0.85rem; color: var(--muted); font-weight: 700; }
    input, textarea, select {
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--panel);
      color: var(--primary);
      padding: 12px 14px;
      width: 100%;
    }
    textarea { min-height: 115px; resize: vertical; }
    .btn-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; }
    .btn {
      border: none;
      border-radius: 999px;
      padding: 11px 16px;
      background: #0f172a;
      color: white;
      cursor: pointer;
      font-weight: 600;
    }
    .btn.secondary { background: var(--panel-alt); color: var(--primary); border: 1px solid var(--line); }
    .btn.danger { background: #b91c1c; }
    .muted { color: var(--muted); font-size: 0.87rem; }
    .post-list { margin-top: 12px; display: grid; gap: 12px; }
    .post-item {
      display: flex; justify-content: space-between; align-items: center; gap: 10px;
      border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; background: var(--panel-alt);
    }
    .preview-box {
      background: var(--panel-alt);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 18px;
      margin-top: 18px;
    }
    .preview-box h3 { margin-top: 0; }
    @media (max-width: 820px) {
      .admin-body { grid-template-columns: 1fr; }
      .sidebar-nav { border-right: none; border-bottom: 1px solid var(--line); }
      .form-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="admin-shell">
    <div class="admin-panel">
      <div class="admin-header">
        <h1>AmitKT Admin</h1>
        <button class="btn secondary" id="logout-btn">Logout</button>
      </div>

      <div class="admin-body">
        <aside class="sidebar-nav">
          <div class="nav-section-title">Navigation</div>
          <button class="nav-item active" data-panel="settings-panel">Site settings</button>
          <button class="nav-item" data-panel="posts-panel">Posts</button>
          <button class="nav-item" data-panel="publish-panel">Publish</button>
        </aside>

        <div class="content-area">
          <section id="settings-panel" class="panel-section">
            <div class="form-grid">
              <div class="field">
                <label for="cfg-title">Site title</label>
                <input id="cfg-title" type="text" />
              </div>
              <div class="field">
                <label for="cfg-subtitle">Subtitle</label>
                <input id="cfg-subtitle" type="text" />
              </div>
              <div class="field">
                <label for="cfg-author">Default author</label>
                <input id="cfg-author" type="text" />
              </div>
              <div class="field">
                <label for="cfg-header-image">Header image URL</label>
                <input id="cfg-header-image" type="text" />
              </div>
              <div class="field full">
                <label for="cfg-ad">Ad code / snippet</label>
                <textarea id="cfg-ad"></textarea>
              </div>
              <div class="field">
                <label for="cfg-password">Admin password</label>
                <input id="cfg-password" type="text" />
              </div>
              <div class="field">
                <label for="cfg-language">Default language</label>
                <select id="cfg-language">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>
            <div class="btn-row">
              <button class="btn" id="save-settings">Save settings</button>
              <button class="btn secondary" id="download-settings">Download settings</button>
            </div>
          </section>

          <section id="posts-panel" class="panel-section hidden">
            <div class="btn-row" style="margin-top:0;">
              <button class="btn" id="new-post">New post</button>
            </div>
            <div id="post-list" class="post-list"></div>
          </section>

          <section id="publish-panel" class="panel-section hidden">
            <div class="form-grid">
              <div class="field">
                <label for="gh-user">GitHub username</label>
                <input id="gh-user" type="text" />
              </div>
              <div class="field">
                <label for="gh-token">Personal Access Token</label>
                <input id="gh-token" type="password" />
              </div>
            </div>
            <div class="muted" style="margin-top:12px;">Use a token with repo or public_repo access. The app creates a branch and opens a PR for safer publishing.</div>
            <div class="btn-row">
              <button class="btn" id="commit-github">Commit and open PR</button>
            </div>
          </section>

          <section id="editor-panel" class="panel-section hidden" style="margin-top: 20px;">
            <h2 id="editor-title">Edit article</h2>
            <div class="form-grid">
              <div class="field">
                <label>Slug</label>
                <input id="post-slug" type="text" />
              </div>
              <div class="field">
                <label>Category</label>
                <select id="post-category">
                  <option value="National">National</option>
                  <option value="Elections">Elections</option>
                  <option value="Policy">Policy</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Opinion">Opinion</option>
                </select>
              </div>
              <div class="field">
                <label>Title (English)</label>
                <input id="post-title-en" type="text" />
              </div>
              <div class="field">
                <label>Title (Hindi)</label>
                <input id="post-title-hi" type="text" />
              </div>
              <div class="field">
                <label>Thumbnail URL</label>
                <input id="post-thumb" type="text" />
              </div>
              <div class="field">
                <label>Date</label>
                <input id="post-date" type="text" placeholder="YYYY-MM-DD" />
              </div>
              <div class="field full">
                <label>Excerpt (English)</label>
                <textarea id="post-excerpt-en"></textarea>
              </div>
              <div class="field full">
                <label>Excerpt (Hindi)</label>
                <textarea id="post-excerpt-hi"></textarea>
              </div>
              <div class="field full">
                <label>Body (English Markdown)</label>
                <textarea id="post-body-en"></textarea>
              </div>
              <div class="field full">
                <label>Body (Hindi Markdown)</label>
                <textarea id="post-body-hi"></textarea>
              </div>
            </div>
            <div class="btn-row">
              <button class="btn" id="preview-post">Preview</button>
              <button class="btn secondary" id="download-post">Download ZIP</button>
              <button class="btn danger" id="delete-post">Delete</button>
            </div>
            <div id="preview-box" class="preview-box"></div>
          </section>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://stuk.github.io/jszip/dist/jszip.min.js"></script>
  <script src="/js/admin.js"></script>
</body>
</html>
