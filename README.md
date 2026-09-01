# Billmat LLC — Progressive Insurance Payment Guides

A static, multi-page website covering Progressive Insurance payment methods,
grace periods, one-time payments, and claims/billing interactions. Built with
plain HTML5, CSS3, and vanilla JavaScript — no build step or frameworks
required.

Billmat LLC is an independent publisher and is **not affiliated with,
endorsed by, or sponsored by Progressive Insurance**.

## Site structure

```
.
├── index.html                 Home / landing page
├── payment-methods.html       Comprehensive comparison of all payment methods
├── pay-without-login.html     Quick Bill Pay ("Quick Pay") deep guide
├── one-time-payment.html      One-time payment strategy + cost calculator
├── grace-periods.html         Grace period & late payment policy guide
├── claims-and-payments.html   Claims & payment integration guide
├── about-us.html              Company / authority (EEAT) page
├── contact-us.html            Contact & feedback page
├── privacy-policy.html        Privacy policy & terms of use
├── updates.html               Blog / updates page
├── 404.html                   Custom error page
├── robots.txt                 Crawler directives
├── sitemap.xml                XML sitemap for all pages
├── css/style.css              Shared stylesheet (mobile-first, dark mode)
├── js/main.js                 Shared behavior (nav, dark mode, calculator,
│                               decision tree, grace checker, tables, forms)
├── images/logo.svg            Billmat LLC logo
└── favicon.svg                Site favicon
```

## Features

- **Fully responsive** design (mobile-first, tablet, desktop) with a
  hamburger nav below 820px and touch-friendly (44px+) controls.
- **Dark mode** toggle, persisted via `localStorage` and defaulting to the
  visitor's OS preference.
- **Interactive tools**, all implemented in dependency-free JavaScript:
  - 12-month payment cost calculator (`one-time-payment.html`)
  - "Which payment method is best for you?" decision tree
    (`payment-methods.html`)
  - State grace-period checker (`grace-periods.html`)
  - Sortable comparison tables (any `<table data-sortable>`)
  - FAQ accordions using native `<details>`/`<summary>`
- **SEO**: unique title/meta description per page, self-referencing
  canonical tags, Open Graph tags, JSON-LD structured data
  (`Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `HowTo`,
  `Article`, `AboutPage`, `ContactPage`, `Blog`), `sitemap.xml`, and
  `robots.txt`.
- **Accessibility**: skip-to-content link, semantic landmarks, labelled
  form fields, high-contrast color palette designed for WCAG AA.

## Local development

No build tooling is required. To preview the site locally, serve the
repository root with any static file server, for example:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

Because the site is plain static HTML/CSS/JS, any static host (GitHub
Pages, Netlify, Vercel, S3 + CloudFront, etc.) will work without
modification.

## Deployment guide

1. **Choose a static host.** GitHub Pages is the simplest option for this
   repository:
   - In the repository settings, enable **Pages** and point it at the
     `main` branch, root directory.
   - The site will be served at `https://<org>.github.io/<repo>/`.
2. **Update canonical/OG URLs if the domain changes.** All pages currently
   reference `https://github.com/progressiveguide/progressivequickpay/` in
   canonical tags, Open Graph tags, and `sitemap.xml`/`robots.txt`. If you
   deploy to a different domain (for example a GitHub Pages URL such as
   `https://progressiveguide.github.io/progressivequickpay/`, or a custom
   domain), update the `SITE` constant used when the pages were generated
   (or find-and-replace the domain across the HTML files, `sitemap.xml`,
   and `robots.txt`).
3. **Verify HTTPS is enabled** on your host — required both for the
   "HTTPS Secured" trust badge in the footer and for real-world SEO/trust
   signals.
4. **Submit `sitemap.xml`** to Google Search Console and Bing Webmaster
   Tools once the site is live.
5. **Re-check internal links** after any path changes; every page links
   to several others using relative paths (e.g. `payment-methods.html`),
   so moving files into subdirectories would require updating those
   links.

## Content maintenance

- Each guide page includes a **"Last updated"** date near the top —
  update this whenever the content is revised.
- `updates.html` is the changelog/blog; add a new `<article>` block with
  an `id`, publish date, and summary whenever policy details change.
- `sitemap.xml` includes a `lastmod` per URL — update it alongside
  significant content changes.

## Disclaimer

All payment, discount, fee, and grace-period figures on this site are
illustrative and based on publicly available 2026 information. They can
vary by state, policy, and underwriting company. Always confirm
specifics directly with Progressive Insurance at 1-800-776-4737 or
through the official Progressive website/app before making financial
decisions.
