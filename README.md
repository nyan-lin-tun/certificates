# Certificates

My certificates and course completions, newest first. Built with Next.js, TypeScript, and Tailwind CSS, using the same layout as [works](https://github.com/nyan-lin-tun/works). Production builds use the same Google Analytics property (`G-JXLXCN5680`); development mode does not load analytics.

## Run locally

Requires Node.js 22.14 or newer.

```sh
npm ci
npm run dev
```

Open [localhost:4323/certificates](http://127.0.0.1:4323/certificates/).

## Add a certificate

1. Put the PDF or JPEG in `public/certificates/`.
2. Add a Markdown file in `content/certificates/` with the same name.

Use lowercase, hyphenated names: `YYYY-MM-DD-issuer-credential`. For example:

```text
public/certificates/2024-11-01-cncf-cka.pdf
content/certificates/2024-11-01-cncf-cka.md
```

The Markdown file contains the details shown on the site:

```markdown
---
title: Certified Kubernetes Administrator
issuer: Cloud Native Computing Foundation
mark: CKA
category: Kubernetes
issued: '2024-11-01'
file: /certificates/2024-11-01-cncf-cka.pdf
---

Completed the Certified Kubernetes Administrator program.
```

- If only the year is known, use `issued: '2020'` and a name like `2020-harvard-cs50x`.
- Add `validThrough` when the expiry date is known.
- Add `verificationUrl` for a direct credential or badge page, not a lookup form. A badge without a document needs only this URL; omit `file`.
- Set `draft: true` to hide an entry. Documents in `public/` are still published.

Edit `content/README.md` for the introduction and footer.

## Check and preview

```sh
npm run lint
npm run format:check
npm run check
npm run build
npm test
npm run preview
```

Open [localhost:4324/certificates](http://127.0.0.1:4324/certificates/) to review the built site. Run `npm run format` to format changes.

## Deploy

After reviewing locally:

1. Push to `main`.
2. In repository **Settings → Pages**, select **GitHub Actions**.
3. Run **Validate certificates and optionally deploy** on `main` with **deploy** checked.

Pushes run checks only. Publishing requires the manual workflow.
