# CLAUDE.md — Till Five Pizza Website

## Project Overview
- **Client:** Till Five Pizza — a late-night pizza restaurant
- **Tagline:** "Open Late. Eat Great."
- **Deployed on:** Vercel (static hosting)
- **Current stack:** Plain HTML files with inline CSS + vanilla JS
- **Files:** `till-five-pizza.html` (homepage), `menu.html` (full menu page)

## Brand
- **Primary font:** Plus Jakarta Sans (Google Fonts)
- **Brand colors:**
  - Red (primary): `#e93037`
  - Yellow (secondary): `#ffbc11`
  - Dark background: `#0d0d0d`
  - Body text: `#5b5b5b`
  - Light background: `#f8f8f8`
  - White: `#ffffff`
- **Shadows:** layered, blue-tinted
  - `--shadow-01: 0 2px 12px rgba(31,58,84,0.07)`
  - `--shadow-02: 0 6px 24px rgba(31,58,84,0.10)`
  - `--shadow-03: 0 16px 48px rgba(20,20,43,0.13)`
- **Logo:** `brand_assets/TFP Logo.png`
- **Menu photos:** `brand_assets/Final Menu Pics/` organized by category:
  - Appetizers, Burgers:Pitas, Desserts, Pastas, Pizzas:Calzone, Salads

## Stack Decision
- Currently plain HTML/CSS — works fine on Vercel for a static site
- Migration to **Next.js + Tailwind + TypeScript** is under consideration
- Only migrate if adding dynamic features (ordering, reservations, CMS) or significantly more pages

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `python3 -m http.server 3000` from the project root (run in background with Bash `run_in_background: true`)
- Verify it's running before taking screenshots: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- **Use Playwright MCP tools** — the `playwright` MCP server is configured for this project.
- Navigate and screenshot: use `browser_navigate` to go to the URL, then `browser_take_screenshot` to capture.
- Always screenshot `http://localhost:3000/<filename>.html` (never a `file:///` URL).
- After screenshotting, analyze it inline.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing
- Delete screenshots after use: `rm .playwright-mcp/page-*.png`

## Output Defaults
- Single `.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Use the Till Five brand colors above.
- **Shadows:** Never use flat `shadow-md`. Use the layered, color-tinted shadows defined above.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
