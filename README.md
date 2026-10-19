# Indian Politics — GitHub Pages starter

A simple, responsive Jekyll website for political articles. It includes article cards, thumbnails, topic pages, individual article URLs, SEO metadata, a sitemap, and an RSS feed.

## Important editing limitation

GitHub Pages is static hosting. There is no secure password-protected editor built into the public website. The simplest GitHub-only workflow is to edit the Markdown article files directly on GitHub while signed in to your own account. Never put a password in HTML or JavaScript; visitors can inspect it.

## 1. Create your GitHub repository

1. Sign in at https://github.com
2. Create a **public** repository named `YOUR-USERNAME.github.io` (replace `YOUR-USERNAME` with your GitHub username). GitHub Free requires a public repository for this setup.
3. Upload all files and folders from this project, preserving their folder structure.
4. In the repository, open **Settings → Pages**.
5. Under the build/deployment section, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
6. Wait for the deployment to finish. Your site address will be `https://YOUR-USERNAME.github.io`.

If you choose a repository with another name, your URL and `baseurl` configuration will be different. The user-site repository name above avoids that extra complication.

## 2. Set your website address

Edit `_config.yml` and replace `https://YOUR-USERNAME.github.io` with your actual site address. Also update the `Sitemap:` line in `robots.txt` to match. Commit both changes.

## 3. Publish a new article

1. Open the `_posts` folder in GitHub.
2. Choose **Add file → Create new file**.
3. Name it with this format: `YYYY-MM-DD-short-article-title.md`, for example `2026-10-20-election-reform.md`.
4. Add this at the top, then write your article below the second `---`:

```yaml
---
title: "Your article headline"
description: "A clear 1–2 sentence summary for search results and article cards."
date: 2026-10-20
categories:
  - elections
image: /assets/images/election-reform.jpg
image_alt: "Describe what is shown in the photograph"
image_caption: "Optional photo caption"
author: Your Name
---
```

5. Write the article using Markdown. Use `## Heading` for section headings, `**bold text**` for bold and `[link text](https://example.com)` for links.
6. Commit the new file. GitHub Pages will rebuild the site automatically.

Use a category slug from the existing categories (`constitution`, `elections`, or `policies`) so the article appears on the matching topic page. If you add a new category, also create a category page under `categories/` and add it to the navigation in `_layouts/default.html`.

## 4. Add or replace an article photo

1. Open the `assets/images` folder in GitHub.
2. Choose **Add file → Upload files** and upload a JPG, PNG or WebP image.
3. In the article's front matter, set `image: /assets/images/your-file.jpg`.
4. Commit the change. The homepage card and article page will use the new image.

Use images you own or have permission to publish. Keep images reasonably compressed for faster loading.

## 5. Edit an existing article

Open the file in `_posts`, click the pencil icon, make your changes and commit them. To replace a photo, upload the new file and update the `image` field in the article. Your changes publish after the GitHub Pages build completes.

## 6. SEO checklist

- Give every article a specific, useful title and an original description.
- Keep the article's filename/URL stable after publishing, when possible.
- Link related articles to one another.
- Use descriptive image alt text.
- Cite reliable sources for political and factual claims.
- After the site is live, add it to Google Search Console and submit `/sitemap.xml`.
- Indexing and ranking are controlled by Google; neither is guaranteed.

## Folder guide

- `_posts/` — articles
- `categories/` — topic landing pages
- `_layouts/` — site templates
- `assets/css/` — design
- `assets/images/` — thumbnails and article photos
- `_config.yml` — website title, description and SEO configuration

## Backups and public visibility

Download a ZIP of your repository occasionally and keep original photos on your computer. A public GitHub repository exposes the website's source files to visitors. Do not put passwords, private information or drafts you want to keep secret in it.
