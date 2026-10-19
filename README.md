# AmitKT — Indian Politics

This repository contains a modern, lightweight journalism/news-style static website with a browser-based admin UI and multilingual article support.

## What is included

- premium editorial homepage with hero story, feature cards, latest stories, sidebar, ad placeholders
- English and Hindi article support
- admin page to manage site settings and content
- direct publish flow using a GitHub PAT from the browser
- static hosting ready for GitHub Pages

## Open the site

- local preview: http://localhost:8000/index.html
- admin preview: http://localhost:8000/admin.html

## Use the admin page

1. Open `/admin.html`.
2. Enter the default password: `admin`.
3. Create or edit articles.
4. Save site settings, preview content, or download a ZIP.
5. For GitHub publishing, paste a PAT in the Publish panel. The app creates a branch and opens a PR.

## GitHub Pages

Once you merge this branch into the default branch and enable GitHub Pages, the site will be published at:

- https://amitt3069.github.io/amitkt/
- https://amitt3069.github.io/amitkt/admin.html

## Notes

- The UI password is only a browser lock. It does not secure GitHub repo access.
- For publish flows, never store tokens in the repo.
- All content is file-based and lightweight, which makes deployment simple and fast.
