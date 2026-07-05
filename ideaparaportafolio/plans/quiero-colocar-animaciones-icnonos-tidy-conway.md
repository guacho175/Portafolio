# Plan: Animated Portfolio with Icons & Visual Life

## Context
The user has a dark-themed developer portfolio (orbynex.digital / Christian Galindo) but the current `App.tsx` is an empty placeholder. The screenshots show the full design: dark navy background, hero, stats, services, and projects sections. The request is to build the full portfolio with **animated icons, stickers/emojis, floating visuals, and motion** so it feels alive instead of purely text-based.

## Approach

### 1. Theme tokens (`src/styles/theme.css`)
Update to the portfolio's dark navy palette:
- `--background: #050d1a` (deep navy)
- `--foreground: #e8edf5`
- `--primary: #4f9eff` (electric blue accent)
- `--secondary: #0d1f3c`
- `--muted: #1a2d4a`
- `--border: rgba(79,158,255,0.15)`

### 2. Fonts (`src/styles/fonts.css`)
Import **Inter** (body) + **Space Grotesk** (headings) from Google Fonts — matches the techy-yet-clean vibe in the screenshots.

### 3. App.tsx — Full Portfolio Build

#### Sections (matching screenshots + animated up):
1. **Navbar** — logo, nav links, dark toggle button
2. **Hero** — big headline "Backend, automatización y productos web.", tagline, CTA buttons. Animated: floating code brackets `</>` and `{}` icons orbit in background, a glowing orb gradient pulses behind the text.
3. **Stats bar** — "10+ Proyectos", "3+ Herramientas", "65+ Tecnologías" — counters animate up on mount.
4. **Marca Propia** — orbynex.digital brand section with animated service cards: Landing pages, Flujos inteligentes, Integración de herramientas, Documentación y soporte. Each card gets a lucide-react icon + subtle hover lift.
5. **Tech Stack** — animated scrolling ticker of technology logos (text-based badges with icons) — PostgreSQL, React, Node, etc.
6. **Projects** — filter chips + project cards with hover shimmer.
7. **Footer** — contact links.

#### Animation strategy (using `motion/react` + CSS):
- **Floating icons**: `<Code2>`, `<Zap>`, `<Globe>`, `<Database>`, `<Cpu>`, `<Layers>` from lucide-react float in the hero background with `animate` keyframes (y-axis sine drift, slow rotation, varying speeds). These look like "stickers" drifting around.
- **Entrance animations**: `motion.div` with `initial={{ opacity: 0, y: 30 }}` + `whileInView={{ opacity: 1, y: 0 }}` for each section.
- **Glowing orb**: CSS radial-gradient behind hero text that pulsates with a `@keyframes pulse-glow` animation.
- **Cards**: `whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(79,158,255,0.2)" }}` lift effect.
- **Stats counter**: simple JS counter that counts up from 0 on mount.
- **Ticker**: CSS `@keyframes scroll-left` infinite loop for tech badges.
- **Sticker emojis**: A few emoji stickers (🚀 ⚡ 🔧 💡) placed at decorative positions in the hero, animating with bounce/float.

#### No external images needed — all visuals come from:
- Lucide icons (animated)
- CSS gradient orbs / glows
- Emoji stickers with motion
- Tech badge pills
- Gradient card borders

## Files to modify
- `src/app/App.tsx` — full replacement with complete portfolio
- `src/styles/theme.css` — update color tokens to dark navy palette
- `src/styles/fonts.css` — add Google Fonts import

## Verification
- Dev server should render a dark navy portfolio matching the screenshots
- Hero icons should visibly float/drift
- Section cards should animate in on scroll
- Tech ticker should scroll infinitely
- All lucide icons render with correct imports
