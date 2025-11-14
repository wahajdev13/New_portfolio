## Section Structure
- Place directly after the hero section in `src/index.html` within `<main>`.
- Semantic wrapper: `<section id="about" aria-labelledby="about-title">`.
- Interior container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16`.
- Content layout: responsive grid `grid grid-cols-1 md:grid-cols-5 gap-8`.

## Responsive Layout
- Mobile: single-column stack with centered text and image below.
- Tablet: 2-column ratio ~ `md:grid-cols-5` with content `md:col-span-3`, image `md:col-span-2`.
- Desktop: same ratio with increased spacing/typography (`lg:text-xl`, `lg:gap-12`).

## Content Elements
- Title: `<h2 id="about-title" class="font-semibold text-3xl sm:text-4xl">About Me</h2>`.
- Subtitle line (optional, matching Skills): `<p class="text-indigo-400/80 text-sm tracking-wide">Who I Am</p>` placed above the title.
- Short bio / professional summary: 2–3 short paragraphs, scannable.
- Key highlights: 3–5 bullet points (outcomes, strengths, unique value).
- Photo: portrait or contextual image on the right; `rounded-xl border border-white/10 bg-white/5`.

## Read More Toggle
- Pattern: native disclosure via `<details>`/`<summary>` for accessibility.
- Summary trigger: `class="cursor-pointer select-none inline-flex items-center gap-2"` with focus styles (`focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400`).
- Details content: additional paragraphs or extended story, hidden by default.
- No heavy JS required; progressively enhanced if custom animation is desired.

## Accessibility
- Proper landmarks (`<section>`, heading levels).
- Descriptive `alt` text for the photo; avoid empty alt unless decorative.
- Keyboard reachable summary toggle; visible focus indicators.
- Sufficient color contrast maintained for text and accents.

## Performance
- Image: responsive sizing `w-full h-auto object-cover` with `sm:max-h-[360px] md:max-h-[420px]`.
- Use `loading="lazy"` for the photo to defer offscreen load.
- Keep DOM light; reuse Tailwind utility classes; avoid heavy animations.

## Tailwind Classes (Key)
- Container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16`.
- Grid: `grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start`.
- Content: `md:col-span-3 text-slate-200` with `space-y-4`.
- Typography: title `text-3xl sm:text-4xl`, body `text-base sm:text-lg lg:text-xl`.
- Image wrapper: `md:col-span-2 relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2`.

## Placement & Integration
- Insert after hero section and before Services/Projects to align with logical flow.
- Add nav link `About` that anchors to `#about` (already present); ensure smooth scroll if desired later.

## Testing Criteria
- Breakpoints: verify at `640px`, `768px`, `1024px`, `1280px` for layout and typography.
- Keyboard: Tab to the `Read More` summary; press Enter/Space to toggle.
- Touch: Confirm large tap area on summary; check image responsiveness.
- Contrast: Validate text against background; link/summary hover states.
- Cross-browser: Test Chrome, Firefox, Edge, Safari (iOS).

## Acceptance Criteria
- Section is readable and scannable with clear hierarchy.
- Read More works with keyboard and touch without JS dependency.
- Image loads lazily and scales correctly across breakpoints.
- Nav link scrolls to section reliably.

## Next Steps (Post-Approval)
- Implement HTML structure and Tailwind classes in `src/index.html`.
- Add content placeholders for bio, highlights, and photo.
- Verify accessibility and responsiveness; adjust spacing if needed.