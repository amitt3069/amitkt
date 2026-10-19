# AmitKT — Indian Politics

This repository now contains a lightweight static site and an admin UI to manage posts.

How to use

1. Review the branch `add-static-admin` and open the admin page at `/admin.html` (once deployed on GitHub Pages use `https://<username>.github.io/amitkt/admin.html`).
2. Unlock the admin UI using the default password `admin` (UI gate only). Change the password in `site-config.json` after first login if desired.
3. To publish posts from the admin UI using the Direct Commit feature, create a GitHub Personal Access Token (PAT) with `public_repo` scope (or `repo` for private repos). Paste it into the admin publish section when committing.
4. The admin supports:
   - Creating posts in English and Hindi (files saved as `posts/<slug>.en.md` and `posts/<slug>.hi.md`).
   - Updating `posts/index.json` which drives the homepage.
   - Updating `site-config.json` for site title, header image, and ad snippet.
   - Downloading a ZIP containing the post and updated index if you prefer manual pushes.

Security notes

- The admin page uses a client-side password only as a UI unlock. It does NOT protect repository access.
- If using Direct Commit, do NOT store PATs in the repository. The admin page uses the PAT only in the browser session to call the GitHub API.

Enable GitHub Pages

1. Go to your repository Settings → Pages and set the source branch to `gh-pages` or `main` (after merging). For now, merge `add-static-admin` into your default branch, then enable Pages to serve from the root.
2. After enabling, visit `https://<username>.github.io/amitkt/` to view the site.

Notes & next steps

- I implemented a lightweight client-side renderer (marked.js) and search (Fuse.js) for fast browsing without a backend.
- If you want pre-rendered per-post HTML files (for better SEO and social sharing), I can add a GitHub Action to generate HTML pages for each post on push.
- I can also add Google AdSense and analytics placeholders where you want them.

If you'd like, I can now open a Pull Request with these changes on branch `add-static-admin` (recommended).