# ATELIERGROUPE — Static Astro Website Plan

## 1. Project Summary
A minimal, precise, robust static website for ATELIERGROUPE, a young architectural practice. Built with Astro, deployed as static HTML/CSS to GitHub Pages. Three real routes — a recto image landing page and two verso information sheets (about, notes). The aesthetic is a quiet information fiche, not a commercial portfolio: white background, near-black text, Helvetica/system sans-serif, thin centered ~500px content column, justified text where appropriate, uppercase for ATELIERGROUPE and section labels. Every behaviour is deliberately specified; nothing is accidental.

## 2. Architecture & Routes
- Framework: **Astro** (latest stable), static output (output: 'static').
- No React, no Vue, no client framework. Astro components + minimal vanilla JS island only for the homepage slideshow.
- Routes (file-based, all statically generated):
  - / — src/pages/index.astro — landing/recto/image cover
  - /about — src/pages/about.astro — verso, single scrollable fiche
  - /notes — src/pages/notes/index.astro — verso, list of notes/articles
  - /notes/[slug] — src/pages/notes/[slug].astro — individual note page (decided: yes — see §6)
- Content via Astro **content collections** (src/content/) with Zod schemas.
- 404: src/pages/404.astro — minimal, links back to /.
- No client routing, no view transitions API initially (real full-page navigation, robust back/forward).

## 3. UX Principles
- **Real pages, real links.** No fake one-page state, no overlays, no modals.
- **No layout shift.** All images have intrinsic dimensions; menus reserve space; bold/regular weight swap cannot reflow.
- **No FOUC.** Critical CSS inlined by Astro; web fonts not loaded (system stack only).
- **Reduced motion respected.** prefers-reduced-motion: reduce disables crossfade — first random image is shown statically, no auto-advance.
- **Works without JS** for /about and /notes. Homepage degrades to a single image when JS is off — see §4.
- **Keyboard reachable.** All links focusable, restrained focus ring (1px solid currentColor, 2px offset).
- **Quiet hover.** Subtle opacity (e.g. .6) + cursor: pointer only. No underlines on the wordmark.
- **Stable menu.** Active state never causes width change (technique in §5).

## 4. Page-by-Page Behaviour

### / Landing (recto)
- Layout: full viewport, white background. ATELIERGROUPE wordmark centered horizontally, near top (~6vh from top), uppercase, system sans, normal weight, link to /about.
- Below the wordmark: a single image area, centered, with comfortable margins. Uses object-fit: contain so studio/model photos are never cropped. Aspect ratio of the image area is reserved (CSS aspect-ratio on a wrapper) to prevent layout shift. Default reserved ratio: **3:2 landscape** — confirm in open questions.
- ~9 WebP images sourced from src/assets/home/ and processed by Astro's <Image> (or getImage) for hashed, optimized output.
- **Slideshow logic (vanilla JS island, ~40 lines):**
  - On load: build a shuffled array of all image indices (Fisher–Yates).
  - First image shown is shuffled[0]. Index advances every 5000ms.
  - When the array is exhausted, reshuffle (ensuring the new first index ≠ last shown) and continue. This guarantees random non-repeating sequence with no immediate repeat across cycles.
  - Two stacked layers (A/B), absolutely positioned, both width:100% height:100% object-fit:contain. Crossfade by toggling opacity with a CSS transition opacity 800ms ease.
  - Server-render all 9 <img> tags with loading="eager" decoding="async", opacity 0 except the first. JS picks the initial random index and toggles opacity via class. Total payload target ≤ ~1.3MB (≤150KB per WebP).
- **No-JS fallback:** all 9 <img> tags exist in the DOM; CSS shows the first one with opacity 1, the rest opacity 0. Without JS the user sees a single deterministic image. Acceptable.
- **Reduced motion:** JS detects matchMedia('(prefers-reduced-motion: reduce)').matches; if true, picks a random initial image once and does not cycle. CSS transitions are also disabled under that media query.
- Wordmark hover: opacity: .6; transition: opacity 150ms; cursor pointer. No underline.
- No bottom menu on /. (Justified: landing is recto/cover; menu belongs to verso family.)

### /about Verso
- Single scrollable fiche, centered ~500px column on desktop.
- Vertical structure (top to bottom): top spacer → ABOUT → NEWS → PROJECTS → OFFICE → bottom padding (≥ 6rem to clear fixed menu).
- Section labels (ABOUT, NEWS, PROJECTS, OFFICE) are inline <h2> in uppercase, used as content headings only — **not** menu targets, no anchor scroll-spy.
- ABOUT: office statement (markdown).
- NEWS: list of news items, sorted by rank ascending. Each item: title, optional date (display-only, e.g. "March 2025"), short body. Date does not control order.
- PROJECTS: simple non-exhaustive list (year — title — location — short note). Plain text list, not a grid, not images.
- OFFICE: biographies of members (Frederik Dahlqvist, Albin Mehmeti, Alexander Wegener — confirmed from notes-example.html OG description; William is the internal coder, not public).
- Few/no images. If used, inline <figure> with caption, same column width.
- Bottom menu fixed (see §5), about bold/active.

### /notes Verso
- Independent page (not an overlay over /).
- Lists all published notes in order of rank ascending (1 = first). If rank is omitted, item is sorted last.
- Each list entry: title (uppercase), optional subtitle/italic, date, short excerpt or first paragraph, and a link to /notes/[slug].
- Entry styling matches the fiche: same column width, same type, no cards.
- Bottom menu fixed, notes bold/active.

### /notes/[slug] Individual Note
- Same fiche aesthetic and column. Reuses the verso layout.
- Renders article body (Markdown/MDX). Optional inline images (figure + caption); no carousel by default — keep it quiet. (notes-example.html had a JS carousel; deliberately dropped to satisfy the "non-accidental, no glitchy" requirement. Re-introduce only if the brief later requires it.)
- Top of page: title, subtitle, date. Bottom of body: optional download link (PDF) if frontmatter provides one.
- Bottom menu present, notes bold/active.

## 5. Menu / Navigation Specification
- Component: src/components/BottomMenu.astro, included only on verso pages and on /notes/[slug].
- Markup: a <nav> with four <a> elements separated by  / :
  1. email → mailto: (address from src/data/site.ts)
  2. t+ → tel: (number from src/data/site.ts) — interpretation: "t+" reads as "tel +", a phone link. Confirm in open questions.
  3. about → /about
  4. notes → /notes
- Position: position: fixed; bottom: 0; left: 0; right: 0; with white background, optional top hairline border 1px solid #000 (confirm), centered inline content, padding 1rem 1.25rem. Height stable across pages.
- Active state: receives aria-current="page" and font-weight: 700 on the matching item. **Layout-stable bold:** since system Helvetica is not variable, use a ::before pseudo-element with the bold text and visibility:hidden to reserve max width. The visible text sits on top; toggling weight cannot change layout.
- Mobile: same fixed bar; ensure padding-bottom: env(safe-area-inset-bottom) for iOS; tap targets ≥ 32px height; font size ≥ 14px.
- Verso pages must add padding-bottom to <main> ≥ menu height + 2rem to guarantee content is never hidden.
- No scroll-spy. No section-jump. No smooth-scroll script.

## 6. Content Model (Astro Content Collections)

src/content/config.ts defines collections with Zod:

- **about** (single MDX file src/content/about.mdx): body = office statement; optional frontmatter for metadata.
- **news** (src/content/news/*.md): { title, date?: string, rank: number }, body = short text. Rank ascending = display order.
- **projects** — chosen as a single TS data file src/data/projects.ts (cleaner for a flat list): { year, title, location?, note?, rank: number }[].
- **people** (src/content/people/*.md): { name, role?, rank: number }, body = bio.
- **notes** (src/content/notes/*.md or .mdx): { title, subtitle?, date: string (YYYY-MM-DD), rank: number, published: boolean, pdf?: string, cover?: string }. Body = article content. Filtered to published === true at build. Slug derives from filename.
- **site data** (src/data/site.ts): { email, phone, phoneHref, domain, ... }.

**Decision: notes have individual pages** (/notes/[slug]). Rationale: many articles over time, long bodies, deep linking, SEO, robust browser back/forward — outweighs the cost of one extra route. The /notes index lists them; clicking opens the full article page.

## 7. Asset / Image Strategy
- All images committed to src/assets/ (so Astro's image pipeline processes them) — split by usage:
  - src/assets/home/ — ~9 landing WebPs.
  - src/assets/about/ — optional inline images for about page.
  - src/assets/notes/<slug>/ — per-article images.
- Format: WebP delivered as-is (already optimized). Astro's <Image> will emit width/height attributes and hashed filenames.
- Landing image dimensions: target **1600×1067 (3:2)** or consistent ratio across the 9 — **TBD** (open question). All images normalized to the same aspect ratio so the reserved area never shifts visually between transitions.
- Reserved space: a wrapper with aspect-ratio: 3 / 2; max-width: min(80vw, 1100px); max-height: 70vh; margin: 0 auto; containing the absolutely-stacked <img> set, all object-fit: contain.
- loading: first image eager + fetchpriority="high"; remaining 8 eager (small total payload, needed for instant crossfade). If WebPs exceed budget, switch trailing 6 to lazy.
- Verso images: <Image> with loading="lazy" decoding="async", intrinsic width/height set, max-width: 100% of column.
- No background-image hacks; always real <img> so alt text is preserved.
- Alt text: meaningful, short, descriptive (e.g. project name or "ATELIERGROUPE — model photograph"). Empty alt="" only when truly decorative.

## 8. Typography & Layout
- Stack: font-family: Helvetica, "Helvetica Neue", Arial, system-ui, sans-serif;
- Base: font-size: 15px; line-height: 1.45; color: #111; background: #fff; Body color near-black #111 (slightly softer than pure black).
- Wordmark on /: font-size: 14px; letter-spacing: .02em; text-transform: uppercase;
- Section labels: text-transform: uppercase; font-size: 13px; letter-spacing: .04em; margin: 3rem 0 1rem;
- Body paragraphs: text-align: justify; hyphens: auto; -webkit-hyphens: auto; Justified only for long-form (about statement, note bodies). Lists and metadata: left-aligned.
- Paragraph spacing: margin: 0 0 1em; first/last child margins reset.
- Column: .column { max-width: 500px; margin: 0 auto; padding: 0 1.25rem; } On desktop ≥ 768px the 500px cap applies. On mobile the column is fluid with 1.25rem side margins. On landscape mobile/tablet (small height, wider width): keep 500px cap to avoid overly wide lines.
- Vertical rhythm: top padding on verso <main>: 4rem desktop, 2rem mobile. Bottom padding ≥ menu height + 2rem.
- Links: color: inherit; text-decoration: underline; text-underline-offset: 2px; except wordmark and bottom-menu links (no underline).
- Focus: :focus-visible { outline: 1px solid currentColor; outline-offset: 2px; }
- No web font loading. No icon font. SVGs inline only when truly needed.

## 9. Accessibility & Robustness
- Semantic HTML: one <h1> per page (page title or wordmark), <h2> for section labels, <nav> for menus, <main>, <article> for note pages.
- lang="en" on <html> (confirm — possibly fr or multilingual; open question).
- prefers-reduced-motion honored on homepage.
- All interactive elements keyboard reachable; visible focus.
- Color contrast: #111 on #fff ≥ 16:1.
- Skip link: a single visually-hidden "Skip to content" link improves a11y at near-zero cost — included.
- <title> and <meta name="description"> per page.
- Open Graph + favicon set (reuse the icon set referenced in notes-example.html).
- Sitemap: Astro @astrojs/sitemap integration — generates /sitemap.xml.
- robots.txt with Sitemap: reference.
- Site builds with zero JS errors and zero console warnings.
- Pages must render and be navigable with JS disabled (homepage shows a single image; verso pages fully functional).

## 10. Astro Folder Structure (proposed)
ateliergroupe/
├─ astro.config.mjs
├─ package.json
├─ tsconfig.json
├─ .nvmrc
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ favicon.ico
│  ├─ robots.txt
│  ├─ CNAME                     # if custom domain
│  └─ images/meta/              # social/og images, favicons
├─ src/
│  ├─ assets/
│  │  ├─ home/                  # 9 WebPs
│  │  ├─ about/
│  │  └─ notes/<slug>/
│  ├─ components/
│  │  ├─ BottomMenu.astro
│  │  ├─ HomeSlideshow.astro    # contains the small JS island
│  │  ├─ Wordmark.astro
│  │  ├─ NewsList.astro
│  │  ├─ ProjectsList.astro
│  │  ├─ PeopleList.astro
│  │  └─ NotesList.astro
│  ├─ layouts/
│  │  ├─ BaseLayout.astro       # <html>, <head>, global CSS
│  │  └─ VersoLayout.astro      # column + bottom menu + padding
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ about.astro
│  │  ├─ notes/
│  │  │  ├─ index.astro
│  │  │  └─ [slug].astro
│  │  └─ 404.astro
│  ├─ content/
│  │  ├─ config.ts              # zod schemas
│  │  ├─ about.mdx
│  │  ├─ news/*.md
│  │  ├─ people/*.md
│  │  └─ notes/*.md(x)
│  ├─ data/
│  │  ├─ site.ts                # email, phone, domain
│  │  └─ projects.ts            # typed project array
│  └─ styles/
│     └─ global.css             # imported once in BaseLayout
└─ README.md


## 11. Deployment — GitHub Pages
- **Astro config:** output: 'static'; set site: 'https://ateliergroupe.ch' (or the GH Pages URL). If deployed to project subpath https://<user>.github.io/<repo>/, also set base: '/<repo>/'. With a custom domain (CNAME in public/), base stays /.
- **Workflow:** .github/workflows/deploy.yml using the official withastro/action@v3 (or build + actions/upload-pages-artifact + actions/deploy-pages). Triggers on push to main.
- **Pages settings:** repo Settings → Pages → Source: GitHub Actions.
- **Custom domain:** if ateliergroupe.ch is used, add public/CNAME containing the domain; configure DNS A/AAAA or CNAME per GitHub docs; enable "Enforce HTTPS" after DNS propagation.
- **Trailing slashes:** Astro trailingSlash: 'ignore' (default) is fine; GH Pages serves about/index.html for both /about and /about/.
- **No SSR, no functions.** Pure static.

## 12. Open Questions / Missing Information
1. **NOTES.pdf and 260421.pdf could not be text-extracted** in this environment (binary/compressed PDF streams). Any content (statements, news items, project list, biographies, additional articles) inside them needs to be supplied as Markdown or transcribed. → Recommend extracting them locally with a PDF-to-text tool, or providing source text files.
2. **t+ interpretation:** confirmed as a tel: link? Provide the phone number, and the displayed label (e.g. t+ 41 …).
3. **Email address** for the mailto: link.
4. **Custom domain** confirmed (ateliergroupe.ch)? Or deploy to project subpath (which requires base)?
5. **Landing image set:** 9 confirmed in BRIEF — what aspect ratio, what max dimensions, and may we normalize them all to one ratio?
6. **Site language:** lang="en" (notes-example uses English) or fr or both? No multilingual routing planned unless required.
7. **News items:** initial list with rank, title, optional date, body.
8. **Project list:** initial entries (year, title, location, optional note, rank).
9. **Member bios:** texts for Frederik Dahlqvist, Albin Mehmeti, Alexander Wegener.
10. **Notes seed content:** which articles from the existing notes-example.html carry over (Rossi's Incompleteness, Colonne-Cadre, Notes from Architecture, Open Hand Open Castle, Before the Swiss Box, Adolf Loos)? Their rank order?
11. **Carousel on note pages:** the legacy site had a click-to-advance image carousel; the plan currently drops it for stability/quietness. Confirm or request a minimal, robust replacement.
12. **Wordmark size and exact vertical position** on /: the brief says "centered near the top" — propose padding-top: 6vh; font-size: 14px — confirm.
13. **Hairline above bottom menu:** include 1px top border or none?
14. **404 content:** wording? Current plan: "PAGE NOT FOUND — return to /".

## 13. Step-by-Step Implementation Phases

### Phase 1 — Project scaffold
1. npm create astro@latest → minimal template, TypeScript strict, no integrations.
2. Add integrations: @astrojs/sitemap, @astrojs/mdx. Configure astro.config.mjs with site, optional base, output: 'static', integrations.
3. Add .nvmrc (Node LTS), .editorconfig, .gitignore.
4. Create src/styles/global.css with reset, type scale, color tokens, column class, focus styles, justified body rule, prefers-reduced-motion rules.
5. Create BaseLayout.astro (head, meta, OG, favicon links, global CSS import, <slot />).
6. Verify dev server runs.

### Phase 2 — Content model
*Can run in parallel with Phase 3.*
1. Define src/content/config.ts with Zod schemas for news, people, notes, plus about collection.
2. Create src/data/site.ts and src/data/projects.ts typed exports.
3. Add 1–2 placeholder entries per collection so pages render.

### Phase 3 — Verso framework
*Depends on Phase 1.*
1. Build BottomMenu.astro with width-reservation bold technique, aria-current, mailto/tel links, prop current: 'about' | 'notes'.
2. Build VersoLayout.astro (extends BaseLayout): centered column, top padding, bottom padding clearing the menu, slot for content, includes BottomMenu.
3. Build minimal about.astro and notes/index.astro rendering placeholder content through VersoLayout to validate menu, column width, padding on mobile + desktop.

### Phase 4 — About page
*Depends on Phases 2 + 3.*
1. Implement NewsList.astro (sorted by rank), ProjectsList.astro, PeopleList.astro.
2. Render ABOUT (from about.mdx), NEWS, PROJECTS, OFFICE sections as <section> blocks with <h2> labels.
3. Verify justification, hyphenation, paragraph spacing on desktop and mobile.

### Phase 5 — Notes pages
*Depends on Phases 2 + 3.*
1. notes/index.astro — query notes collection, filter published, sort by rank, render NotesList.astro (title, subtitle, date, excerpt, link).
2. notes/[slug].astro — getStaticPaths from collection; render frontmatter header (title, subtitle, date) + Markdown/MDX body inside the verso column; optional PDF link at bottom.
3. Add 1 real article (e.g. Rossi's Incompleteness from existing site) to validate styling end-to-end.

### Phase 6 — Landing page
*Depends on Phase 1.*
1. Place 9 WebPs in src/assets/home/.
2. Wordmark.astro — uppercase, link to /about, hover opacity, no underline.
3. HomeSlideshow.astro — server-render all 9 <Image> tags stacked in an aspect-ratio wrapper; ship a small <script type="module"> implementing shuffle, crossfade, reduced-motion guard.
4. index.astro composes wordmark + slideshow inside BaseLayout. No BottomMenu.
5. Verify: no layout shift, no flash, smooth crossfade in Chrome/Safari/Firefox; reduced-motion path tested by toggling OS setting.

### Phase 7 — Polish & a11y pass
*Depends on Phases 4–6.*
1. Lighthouse and axe pass on all routes; aim ≥ 95 in all categories.
2. Verify keyboard navigation on every page; visible focus rings.
3. Verify JS-off behaviour: about/notes fully functional; homepage shows a single image.
4. Verify mobile (375px), tablet landscape (1024×600), desktop (1440px).
5. Verify prefers-reduced-motion.
6. 404 page wording and link.
7. robots.txt, sitemap, OG tags, favicons.

### Phase 8 — Deploy
*Depends on Phase 7.*
1. Push repo to GitHub.
2. Add .github/workflows/deploy.yml using withastro/action@v3.
3. Repo Settings → Pages → Source: GitHub Actions.
4. If custom domain: add public/CNAME, configure DNS, enable HTTPS after propagation.
5. First deploy; smoke test live URL on desktop and mobile.

### Verification (overall)
- npm run build succeeds with zero warnings.
- npm run preview renders all routes.
- Manual checklist:
  - Homepage cycles 9 images, random first, no immediate repeats, smooth crossfade, stable layout.
  - /about shows 4 sections in correct order, news sorted by rank.
  - /notes lists notes by rank; clicking opens /notes/<slug>.
  - Bottom menu fixed, active item bold, no horizontal layout shift between /about ↔ /notes.
  - All links keyboard-focusable with visible ring.
  - With JS disabled: homepage shows a single image; verso pages fully usable.
  - Reduced motion: homepage static, no transitions.
  - Lighthouse Performance / Accessibility / Best Practices / SEO ≥ 95.
- Live URL responds, custom domain (if any) resolves with HTTPS.

### Scope Boundaries
- **Included:** three routes, individual note pages, content collections, slideshow, fixed bottom menu, GitHub Pages deploy, sitemap/robots/OG, reduced-motion + no-JS support, a11y pass.
- **Excluded:** CMS, server runtime, search, comments, analytics (can be added later), dark mode, multilingual routing, view transitions, click-to-advance image carousels, scroll-spy, decorative animations, React/Vue, Tailwind (kept to a single hand-written CSS file for control).