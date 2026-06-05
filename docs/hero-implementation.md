# Hero Implementation Plan

## Goals
- Match the hero and navbar layout in the reference images from docs/reference.
- Use PrismBackground as the only background layer, tuned to a blue, noisy, soft gradient look.
- Keep typography and copy exact to the reference, with font choices below.
- Add a cursor lens that blurs content, and render ASCII text only inside the lens when it overlaps the words Creative, visual, or designer.

## Fonts
- Primary: Neue Montreal (fallback until the real font is added).
  - Fallback stack: "Neue Montreal", "Helvetica Neue", Arial, sans-serif.
- Accent word: Cormorant Garamond (italic) via Google Fonts.

## Copy and Casing
- Navbar (uppercase): OSMEERN D | PROJECT | SOCIALS | CONTACTS
- Headline: Creative designer (same line breaks and placement as reference).
- Accent word: visual (italic, Cormorant Garamond, warm orange).
- Bottom left copy (uppercase, same breaks as reference):
  - WEB & MOBILE / UX&UI / BRANDING
  - CURRENTLY AVAILABLE FOR FREELANCE WORLDWIDE
  - BASED IN LONDON
  - BORN IN SAINT-P
- Bottom right: down arrow indicator (same position as reference).

## Layout Structure
- Top navbar, full width, fixed padding, uppercase, tight letter spacing, small size.
- Hero heading left aligned, large scale, two lines:
  - Line 1: Creative
  - Line 2: designer
- Accent word visual sits between the lines on the right, aligned as in reference.
- Bottom left info block as a two-column grid with small uppercase text.
- Bottom right down arrow indicator.

## Background (Prism Only)
- Use PrismBackground as the only background layer.
- Suggested initial props (tune by eye to match the reference):
  - animationType: "hover"
  - height: 3.2
  - baseWidth: 5.2
  - scale: 3.8
  - glow: 1.1
  - bloom: 1.15
  - noise: 0.55
  - hueShift: 0.0
  - colorFrequency: 1.1
  - timeScale: 0.35
- Place the canvas at z-index 0, with the hero content at z-index 10.

## Cursor Lens + ASCII Hover
- Cursor lens:
  - A circular div that follows the mouse, size about 180px to 210px.
  - Visual: border 1px solid rgba(255,255,255,0.2), backdrop-filter blur(12px), slight saturation.
  - pointer-events: none.
- ASCII effect requirement:
  - ASCII text renders only inside the lens and only when the lens overlaps Creative, visual, or designer.
  - Outside of the lens, the normal text remains visible.
- Implementation approach:
  1) Render two layers of the headline in the same position:
     - Base layer: normal text (Neue Montreal, Cormorant for visual).
     - ASCII layer: ASCIIText component (same words), hidden by default.
  2) Use a circular CSS mask (or clip-path) to reveal the ASCII layer only under the cursor lens.
  3) Track which word is overlapped by the lens using bounding boxes and the current cursor position.
  4) Only enable the ASCII layer when the cursor overlaps one of the three words.

## Files and Components
- src/app/layout.tsx
  - Add Cormorant Garamond via next/font/google.
  - Keep Neue Montreal in CSS fallback until the real font is imported.
- src/app/globals.css
  - Define CSS variables for colors and font families.
  - Add styles for cursor lens and ASCII mask.
- src/components/PrismBackground.tsx
  - Add PrismBackground component from the docs reference.
- src/components/AsciiText.tsx
  - Add ASCIIText component from the docs reference.
- src/components/Hero.tsx
  - Compose navbar, headline, accent word, bottom info, and down arrow.
  - Own the cursor lens and ASCII hover logic.
- src/app/page.tsx
  - Render the Hero component as the main content.

## Notes for Styling
- Accent orange for visual: start with #F1A21B and adjust if needed.
- Hero text weight: use 400 to 500; keep tracking tight.
- Use large, clean line height to match the reference scale.
- For the navbar and bottom left text, use small uppercase, increased letter spacing.
