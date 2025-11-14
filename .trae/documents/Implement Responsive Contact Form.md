## Section Structure
- Add `<section id="contact" aria-labelledby="contact-title">` near the end of `<main>`.
- Container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16`.
- Heading pair: subheading `p.text-indigo-400/80` + `h2#contact-title.text-3xl sm:text-4xl` for consistency.

## Layout & Responsiveness
- Mobile: single column, full-width form.
- Tablet/Desktop: centered max-width form card inside the container (`max-w-2xl mx-auto`).
- Spacing scales with `sm:/md:/lg:`; inputs use responsive `text-base sm:text-lg` and `py-3 sm:py-3.5`.

## Visual Design
- Form card: `rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8`.
- Inputs: `bg-white/5 border border-white/10 rounded-lg` with `focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors`.
- Decorative accents: subtle gradient top border or corner glow (`before:` pseudo via utility-less inline element), and small icon header.

## Fields & Validation
- Name (`text`): required, 2–60 characters; label + helper.
- Email (`email`): required, RFC-like pattern; label + helper.
- Message (`textarea`): required, 10–500 characters; live character counter and limit.
- Attributes: `autocomplete`, `aria-required`, `aria-invalid`, `aria-describedby` tied to helper/error elements.

## Accessibility
- Role: `role="form"` with a `form` element and associated labels.
- Keyboard: native tab order; visible `focus-visible` outlines.
- High contrast: maintain dark bg + white text; avoid low-contrast placeholders.
- Announcements: success/error region using `role="status"`/`aria-live="polite"`.

## Interactions & States
- Client-side validation on submit; block submit if invalid.
- Loading state on button: inline spinner and `aria-busy`.
- Success and error banners inside the card; reset form on success.
- Spam prevention: hidden honeypot input; optional basic CAPTCHA later.
- Motion: `transition` classes; respect `prefers-reduced-motion` by gating heavier animations.

## Script (Lightweight)
- Initialize char counter and update on input.
- Validate fields on blur and submit; set `aria-invalid` and show messages.
- Simulate async submission with `setTimeout`; hook for real backend later.

## Navigation Integration
- Update navbar and mobile menu Contact links to `#contact`.

## Testing Criteria
- Breakpoints: 640/768/1024/1280 for layout, spacing, inputs.
- Keyboard: tab through, activate submit via Enter; focus rings visible.
- Touch: large tap targets; scroll and input on mobile.
- Contrast: verify text, borders, and focus states against dark background.
- Cross-browser: Chrome/Firefox/Edge/Safari; input validations consistent.

## Acceptance Criteria
- Form matches site theme and is responsive.
- Clear labels, errors, and live char counter.
- Accessible with ARIA and focus styles.
- Loading state and success/error messages work client-side.