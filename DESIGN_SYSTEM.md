---
name: Vivid Motion
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464556'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#767587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4643e9'
  primary: '#433fe5'
  on-primary: '#ffffff'
  primary-container: '#5d5cff'
  on-primary-container: '#fdf9ff'
  inverse-primary: '#c1c1ff'
  secondary: '#8127cf'
  on-secondary: '#ffffff'
  secondary-container: '#9c48ea'
  on-secondary-container: '#fffbff'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cea700'
  on-tertiary-container: '#4e3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1dfff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#09006b'
  on-primary-fixed-variant: '#2b20d2'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffe083'
  tertiary-fixed-dim: '#eec200'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-margin: 20px
  gutter: 12px
---

## Brand & Style

The design system is engineered to transform the functional task of video management into an energetic, creative experience. Targeted at social media managers, content creators, and mobile-first editors, the personality is unapologetically bold and optimistic. 

The aesthetic blends **Modern Minimalism** with **High-Contrast / Bold** elements. It utilizes generous whitespace to let vibrant media content breathe, while anchoring the interface with "electric" interactive elements. The goal is to evoke a sense of creative momentum—making the user feel like a director in a high-tech, yet approachable, digital studio.

## Colors

This design system utilizes a high-energy palette to differentiate core actions and status. 

- **Electric Blue (Primary):** Used for primary actions, progress bars, and active states. 
- **Bright Purple (Secondary):** Used for creative tools, tagging, and secondary highlights to provide a "premium" creative feel.
- **Sunny Yellow (Tertiary):** A high-contrast accent for notifications, premium features, or "New" badges. 
- **Deep Slate (Neutral):** Provides a grounded foundation for text and iconography, ensuring high legibility against the vibrant accents.

Subtle linear gradients (135-degree angle) moving from Primary to Secondary are encouraged for large interactive surfaces like "Upload" buttons or empty-state calls to action.

## Typography

The typography strategy pairs the expressive, variable nature of **Anybody** for headlines with the soft, friendly geometry of **Plus Jakarta Sans** for UI and body text.

- **Headlines:** Use "Anybody" with a bold weight to create a sense of urgency and impact. The slight horizontal expansion of the font at larger weights adds a cinematic quality to the app.
- **Body & Labels:** "Plus Jakarta Sans" is selected for its high x-height and open counters, ensuring that metadata (timestamps, file sizes, resolutions) remains readable even on small mobile screens.
- **Emphasis:** Use the Secondary (Purple) color for key phrases within body text to maintain the playful hierarchy.

## Layout & Spacing

This design system uses a **Fluid Grid** model optimized for mobile-first consumption. 

- **Grid System:** A 4-column layout for mobile, scaling to 8 columns for tablets.
- **Rhythm:** An 8pt linear scaling system (base 4px) governs all padding and margins. 
- **Margins:** Standard side margins are set to 20px to provide a modern, spacious feel that prevents the "cramped" look common in utility apps.
- **Grouping:** Vertical spacing between unrelated sections should use `lg` (32px), while spacing between cards in a list should use `sm` (16px) to maintain a tight, organized flow.

## Elevation & Depth

To maintain a playful and modern feel, this design system avoids heavy, muddy shadows. Instead, it uses **Tonal Layers** and **Ambient Shadows**.

1.  **Surfaces:** The background is a very soft grey (#F8FAFC) to make white cards pop.
2.  **Shadows:** Use "Electric Shadows"—low opacity shadows tinted with the Primary color (e.g., `rgba(93, 92, 255, 0.15)`) with a high blur radius (16px to 24px) and 0px spread. This makes elements feel like they are floating on a bed of light.
3.  **Active Depth:** When a user presses a card or button, it should visually "sink" by reducing the shadow blur and scaling the element slightly (98%), creating a tactile, "squishy" feedback loop.

## Shapes

The shape language is defined by **Rounded** geometry. Hard corners are strictly avoided to maintain the friendly brand personality.

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) corner radius.
- **Containers (Cards, Modals):** 1.5rem (24px) corner radius to create a soft, inviting frame for video thumbnails.
- **Interactive Icons:** Circular containers (pill-shaped) should be used for floating action buttons (FAB) and toggle switches.

## Components

- **Buttons:** Primary buttons use a gradient fill (Electric Blue to Bright Purple). Text is always white and bold. Secondary buttons use a thick 2px border in the Primary color with no fill.
- **Video Cards:** Feature a large 24px corner radius. The video duration badge should be placed in the bottom-right corner with a semi-transparent black background and "White" Jakarta Sans text.
- **Chips/Tags:** Used for video categories (e.g., "Edited," "Raw," "Exported"). These should have a light tinted background of the Primary color (10% opacity) and 12px font size.
- **Input Fields:** Use a subtle Slate-100 fill. On focus, the border transitions to a 2px Electric Blue stroke.
- **Progress Bars:** Use the Sunny Yellow color for "Processing" or "Uploading" states to draw the eye to the active status.
- **Navigation:** A floating bottom tab bar with high-contrast icons. The active state is indicated by a Primary-colored glow beneath the icon rather than a standard line.