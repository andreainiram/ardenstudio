# Arden Studio — Website Refresh — Developer Handoff

> A complete handoff package for rebuilding the new Arden Studio site (Lagree & Pilates · Turin, opening June 2026) in a production codebase.

---

## 1. About this bundle

The files in this package are **design references created in HTML/JSX**. They are working, interactive prototypes that show the **intended look, feel, layout, content and behavior** of the site — they are **not** the codebase you should ship. The task is to **rebuild this design** in the chosen production framework (recommended: **Next.js 14 (App Router) + Tailwind**, or **Astro** if you want pure static output).

Folder structure of this handoff:

```
arden-studio-handoff/
├── README.md                       ← this file
├── Arden Studio - standalone.html  ← self-contained design, opens in any browser, no internet (except IG feed + MindBody)
└── source/                          ← the modular source of the prototype
    ├── Arden Studio.html           ← entry HTML
    ├── styles.css                  ← all CSS (~1200 lines, design tokens + components)
    ├── copy.js                     ← all copy in IT + EN (single source of truth)
    ├── hero.jsx                    ← 3 hero variants A/B/C + monogram animation
    ├── sections.jsx                ← About / Instagram / Method / Booking / Contact / Footer
    ├── app.jsx                     ← root app: topbar, language toggle, mobile menu, Tweaks panel
    ├── tweaks-panel.jsx            ← in-design Tweaks UI (can be removed in production)
    └── assets/                     ← AS monogram, transparent logo, wordmark crop
```

---

## 2. Fidelity

**High-fidelity production-ready mockup.** Final colours, type, spacing and copy are intended to ship as-is. The dev should rebuild pixel-perfectly with the codebase's own component library.

---

## 3. Stack recommendation

| Concern | Recommendation | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)** or **Astro** | Static-friendly, SEO, i18n built-in |
| Styling | **Tailwind CSS** + CSS variables for tokens | Tokens already declared as CSS vars in `styles.css` |
| Fonts | Self-host **Cormorant Garamond + Inter Tight + JetBrains Mono** via `next/font` | Avoid CLS, GDPR-friendly |
| i18n | **next-intl** with `it` (default) and `en` locales | Maps 1:1 onto the IT/EN structure in `copy.js` |
| Hosting | **Vercel** or **Cloudflare Pages** | DNS to `ardenstudio.it`, free SSL |
| Analytics | Plausible or Vercel Analytics | GDPR-friendly, no cookie banner needed |

---

## 4. Site map

| # | Section | id | bg | Notes |
|---|---|---|---|---|
| — | Top bar | `.topbar` | translucent paper / espresso | Fixed. Brand mark + nav + IT/EN toggle. Mobile = hamburger overlay. |
| — | Hero | `.hero` | varies | **3 variants** selectable; A is the default. |
| 1 | Studio (About) | `#about` | paper (`#faf5eb`) | Studio philosophy, etymology, space, methods, pricing grid, policies. |
| 2 | Instagram | `#instagram` | cream (`#f5ede0`) | Horizontal strip of live posts from Behold feed. |
| 3 | Il metodo (Method) | `#method` | cream | Two cards: Lagree + Pilates. |
| 4 | Prenotazioni (Booking) | `#booking` | espresso (`#1f1610`) | Full-width card with embedded MindBody widget + 3-up perks row. |
| 5 | Contatti (Contact) | `#contact` | paper | 2-col: studio info / Google Maps embed. |
| — | Footer | `footer.foot` | espresso | AS monogram, ©, tagline. |

---

## 5. Design tokens

All tokens are declared at the top of `styles.css` under `:root`. Use these exactly.

### Colours
```
--espresso: #1f1610   /* primary dark surface (booking, hero A, footer) */
--coffee:   #3a2c20   /* secondary dark */
--bronze:   #53402f   /* hover, accents on light */
--caramel:  #8a6a48
--tan:      #c1a380   /* accent gold, default */
--sand:     #d9c4a6
--cream:    #f5ede0   /* secondary light surface */
--paper:    #faf5eb   /* primary light surface */
--ink:      #2a1f15   /* default text colour */
--muted:    #8a7765
--hairline: rgba(42, 31, 21, 0.12)   /* divider lines */
```

### Type scale
```
--font-serif: 'Cormorant Garamond' (300/400/500, italic)
--font-sans:  'Inter Tight' (300/400/500/600)
--font-mono:  'JetBrains Mono' (400/500)
```

Display sizes use `clamp()` for fluid scaling, e.g. section h2: `clamp(40px, 5.6vw, 84px)` weight 300, tracking `-0.02em`, line-height `0.95`. Body 16px / line-height 1.5.

### Spacing
Sections: vertical padding **120px desktop / 64px mobile**. Container: max-width 1280px, side padding 48px desktop / 24px mobile.

### Border radii
- Buttons / pills: **999px** (full pill)
- Cards: **4px** (booking card, info grid cells, map frame)
- Image tiles (Instagram): **6px**

### Shadows
Cards lift on hover only: `box-shadow: 0 16px 36px -20px rgba(31,22,16,0.6);`

---

## 6. Topbar

- **Fixed**, 64px tall, `z-index: 80`.
- Background switches between `paper` and `espresso` translucent gradients based on the section currently in view (uses scroll listener — see `app.jsx` `onDark` state).
- Brand mark: 26px circle, `--tan` fill, "AS" in serif 13px.
- Nav links: 13px sans, 0.78 opacity, hover → 1.
- **IT/EN toggle**: inline-flex pill, active state is solid `--ink` background (or `--paper` on dark sections) with inverse text. Persists choice in `localStorage` under key `arden_lang`.
- **Mobile (≤880px)**: nav becomes a hamburger that opens a full-height paper drawer with serif 32px links. Drawer locks body scroll. Closes on Esc, on link click, and on resize > 880px.

---

## 7. Hero — three variants

The Tweaks panel lets the designer/QA switch live. **In production ship variant A** unless directed otherwise.

### Hero A · Centered Stage (DEFAULT) — `.hero.hero-a`
- Background: `--bg-dark` (espresso)
- Stack, centered:
  1. "Opening — June 2026" pill with pulse dot
  2. **Animated monogram** (168×168): the AS circle PNG, revealed via `clip-path: circle(0% → 60%)` over 1.6s `cubic-bezier(.7,.1,.2,1)`, delay 200ms
  3. H1 in serif, clamp(56px, 9vw, 132px), weight 300, line 0.95, tracking -0.025em. Format: "Move gently," / "**grow** strong." (italic on word 2, accent colour)
  4. Sub-paragraph 16px, max 48ch, opacity 0.8
  5. **Live countdown** to `2026-06-01T09:00:00` — `Giorni · Ore · Min · Sec`, monogram font for labels, serif 28px for numbers, separated by `·`
  6. CTA row: primary "Prenota una lezione" (tan pill) + ghost "Scopri il metodo"
- Bottom-center: "scroll" hint with animated vertical line.

### Hero B · Editorial Split — `.hero.hero-b`
- Background: `--cream`, dark gradient tile on right.
- 2-col grid. Left: pill + H1 (split: "Forza che respira.") + sub + countdown + CTAs.
- Right: dark gradient (`bronze → espresso`) with monogram (fade-in scale) and corner labels: `Torino · IT`, `Est. 2026`, `45.06° N · 7.69° E`.

### Hero C · Marquee Motion — `.hero.hero-c`
- Background: `--paper`.
- Two horizontal scrolling marquees (top + reverse-direction bottom), serif clamp(120px, 20vw, 280px), spelling "Arden · Studio" and "Move gently · grow strong".
- Center 3-col row: left text col + rotating monogram + right text col with CTA.

---

## 8. About / Studio section (`#about`)

Background `--paper`. Container, then **2-col intro** (1fr/1fr, gap 80px):
- **Left:** section num "Lo studio" (mono 12/0.18em) → H2 "Una fiamma, due discipline." → lede max 46ch
- **Right:** philosophy quote (serif italic clamp 26–40px, max 24ch) → etymology card (paper background, hairline border, 28px padding): "etimologia" label / "Arden" big italic 56–84px in bronze / "Lat. · fiamma · passione ardente" mono caption

Then 3 `about-block`s separated by hairline top borders:

1. **Lo spazio** — H3 serif + body 17px max 56ch
2. **I metodi** — H3 + 2-col grid: "Pilates · BASI® Method" and "Lagree · Megaformer" each with name (serif 28px) + body
3. **Informazioni pratiche** — H3 + 3-col grid (2-col on small mobile) of `.about-info-cell`s, paper-on-hairline, each with mono label + serif 36px value. Cells:
   - Durata · Pilates → 50 min
   - Durata · Lagree → 40 min
   - Lezioni di gruppo → max 5 persone
   - Pilates · da → 35€
   - Lagree · da → 40€
   - Livello → Tutti i livelli
4. **Prenotazioni & politiche** — 3-col grid: Prenotazioni / Cancellazioni / Grip socks. Each has a hairline top border, mono label, 14.5px body.

---

## 9. Instagram strip (`#instagram`)

Background `--cream`.

**Data source: Behold feed** — fetches `https://feeds.behold.so/4YQcUSd7sKqFouHPvaQV` on mount, no API key needed. The feed is curated/refreshed by Behold from `@ardenstudio_lagreepilates`. **Replace the feed-id constant in production** (`BEHOLD_FEED_ID` at the top of `sections.jsx`).

**Render**: square tiles 220–320px wide, gap 16px, horizontal scroll with snap. Each tile uses `p.sizes.medium.mediaUrl || p.thumbnailUrl || p.mediaUrl`. Reels get a triangular play icon, photos get the IG camera icon. Hover lifts by 4px and zooms image 1.04.

Layout for the head:
- 2-col (1.4fr / 1fr) "ig-head" block
- Left: section num + H2 "Seguici in studio."
- Right: handle pill `@ardenstudio_lagreepilates ↗`, short lede, "Apri Instagram" ghost button

If the feed errors or is empty, **fall back** to 8 stylised gradient tiles using palette tones (already coded).

---

## 10. Method (`#method`)

Background `--cream`. SectionHead "Il metodo / Due discipline, una pratica." + lede.

`.method-grid` 2-col (1fr/1fr, gap 64px). Each `.method-card`:
- Hairline top border, 32px padding-top
- H3 serif 44px weight 300
- `.method-subtitle` mono uppercase ("Lezione di gruppo · Mega Pro" or "Metodo BASI® · Reformer")
- `.method-body` with multi-paragraph split on `\n\n` — each `<p>` 15.5px / line 1.65 / opacity 0.82
- `.attrs`: pill chips, mono 11px, hairline border, e.g. "Semi-privata · 45 min", "Reformer · 50 min", "BASI® Method"

Both card bodies are in `copy.js` → `method.cards[0].body` (Lagree) and `[1].body` (Pilates). They contain the long descriptions including pricing context.

---

## 11. Booking — MindBody (`#booking`)

Background `--espresso`. SectionHead + then **full-width `.booking-card`** (paper background, 4px radius, 36px padding):

- "Powered by MindBody" pill badge top-right
- "Account" eyebrow + H3 "Login & registrazione" (serif 32px)
- Sub-paragraph
- **`<BookingWidget />`** mounts the MindBody healcode widget by setting `innerHTML` with:

```html
<healcode-widget
  data-version="0.2"
  data-link-class="loginRegister"
  data-site-id="134138"
  data-mb-site-id="5752951"
  data-bw-identity-site="false"
  data-type="account-link"
  data-inner-html="Login &nbsp;|&nbsp; Register">
</healcode-widget>
```

The healcode JS loads via `<script src="https://widgets.mindbodyonline.com/javascripts/healcode.js">` in `<head>` of `Arden Studio.html`.

We **restyle** the injected `<a>` link via CSS in `styles.css` `.booking-card .widget-host a` so it matches the site's pill-button language (dark ink pill, hover → bronze).

After the card: `.booking-perks` 3-col grid with numbered `01/02/03` perks (tan accent number + body text).

> **Production note**: This widget is a runtime dependency — needs internet, MindBody must be reachable. No build-time integration possible.

---

## 12. Contact (`#contact`)

Background `--paper`. SectionHead + 2-col `.contact-grid` (1fr / 1.2fr):

**Left (`.contact-info`)** — definition list with mono label / sans value rows:
- Studio → Via Marsala 2, 10133 Torino, Italia
- Email → hello@ardenstudio.it (underlined link)
- Instagram → @ardenstudio_lagreepilates (underlined link → IG profile)
- Orari → multi-line hours

**Right (`.map-frame`)** — Google Maps iframe:
```
https://www.google.com/maps?q=Via+Marsala+2,+10133+Torino,+Italia&hl=it&z=16&output=embed
```
Wrapped in bronze background, 4px radius, with floating "Via Marsala 2 · Torino" pill top-left. Filter: `saturate(0.7) contrast(0.95)` for tonal harmony with the site.

---

## 13. Footer

Background `--espresso`. Container:
- Top row: "Lagree & Pilates · Torino" eyebrow
- `.marque`: **AS monogram PNG** (280px max-width), centered, margin 48px auto 32px
- Hairline divider
- Bottom row: "© 2026 ARDEN STUDIO" + "Tutti i diritti riservati" / "All rights reserved"

---

## 14. Interaction & motion details

- **Entry animations**: elements with `.fade-up` start opacity 0, translateY 14px, fade in over 0.9s with `cubic-bezier(.2,.7,.2,1)`. Delays `.d1/.d2/.d3/.d4` stagger by ~0.25s.
- **Monogram reveal**: clip-path circle 0→60% over 1.6s.
- **Topbar background swap**: scroll listener watches sections with `.dark` / `.hero-a` / `footer.foot` classes — when scroll position intersects, toggles `.on-dark` class on `.topbar` for translucent dark background.
- **Mobile menu**: drawer slides in from top (translateY(-12px) → 0, opacity 0 → 1, 0.25s). Hamburger morphs to X using rotate transforms.
- **Instagram tiles**: hover → translateY(-4px) + scale(1.04) on inner img, 0.4s ease-out.
- **Marquee (Hero C)**: pure CSS `@keyframes` translateX, 28s linear infinite (top) / 36s reverse (bottom).

---

## 15. Language toggle

`localStorage.getItem('arden_lang')` → `'it'` (default) or `'en'`. All copy lives in `copy.js` under `COPY.it` / `COPY.en` with identical shape. Add a third locale by adding a sibling key.

In production with `next-intl`:
- Routes: `/` (it default) and `/en/`
- Wire the toggle to `<Link locale="en">` instead of localStorage.

---

## 16. Tweaks panel — DROP IN PRODUCTION

`tweaks-panel.jsx` and the panel mount at the bottom of `app.jsx` are a design-time-only feature for previewing variants. In production:
1. Delete `tweaks-panel.jsx`
2. In `app.jsx`, remove the import + the `<TweaksPanel>` block, the `useTweaks` call, and replace `tweaks.hero` / `tweaks.accent` / `tweaks.order` reads with hard-coded values: `"A"`, `["#1f1610","#c1a380","#f5ede0"]`, `["about","instagram","method","booking","contact"]`
3. Remove all `__edit_mode_*` postMessage logic — it's only for the design tool host

---

## 17. Assets

Provided in `source/assets/`:

| File | Use |
|---|---|
| `arden-logo-original.png` | The full user-supplied logo (gold on dark bronze). Use for OG image / social preview. |
| `arden-logo-transparent.png` | Same logo with transparent background. Source for the crops below. |
| `arden-monogram.png` | **AS circle only**, transparent. Used in: hero monogram animation, footer marque, brand mark fallback. |
| `arden-wordmark-only.png` | "Arden" wordmark crop only (no monogram, no STUDIO subtitle). Not used in the current design but kept in case you want it elsewhere. |

**Recommended in production**: re-export the monogram as **SVG** so it scales crisply at any size. The PNG is fine for the current usage but SVG is better for retina + future scaling.

---

## 18. Build & launch checklist

- [ ] Domain: point `ardenstudio.it` (and `www.`) to the host
- [ ] SSL: automatic via Vercel / CF Pages
- [ ] OG image: 1200×630, use `arden-logo-original.png` or a custom composition
- [ ] Favicon: derive from monogram PNG (32/48/180px)
- [ ] Self-hosted fonts (4 weights of Cormorant + Inter Tight + JetBrains Mono)
- [ ] MindBody widget: confirm `site-id 134138 / mb-site-id 5752951` once production opens
- [ ] Behold: rotate to a production feed-id if needed, or keep `4YQcUSd7sKqFouHPvaQV`
- [ ] Cookie banner: only needed if you add tracking with cookies (Plausible doesn't)
- [ ] Sitemap.xml + robots.txt
- [ ] hreflang tags for it/en
- [ ] Test the MindBody widget on iOS Safari (it's been the historic problem device)
- [ ] Privacy policy + cookie policy + impressum (when VAT number is finalised)

---

## 19. Open questions for the client

1. Final VAT number to put in the footer/colofon
2. Confirmed opening date — the countdown is hard-coded to **2026-06-01T09:00:00**
3. Real photos of the studio (to swap into Hero B's right-hand gradient tile, and possibly add a hero image option)
4. Final exact hours (currently shown placeholder hours in Contact)
5. Founding-member offer details — the 3 perks listed in the Booking section are draft copy

---

## 20. Contact

For questions about the design intent, ping the design team. The HTML files in this bundle are **working previews** — open `Arden Studio - standalone.html` in any browser to see the full design.
