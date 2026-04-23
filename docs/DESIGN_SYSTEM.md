# 🌱 AgroAI Design System

## Philosophy
AgroAI’s design system is built on the principles of clarity, accessibility, and trust. The system aims to:
- Empower users (farmers, agronomists, and researchers) with clear, actionable insights.
- Use nature-inspired colors and organic shapes to evoke trust and approachability.
- Ensure accessibility and usability across devices and environments.

## Core Foundations

### 1. Color Palette
- **Primary:** Green shades (e.g., #16a34a, #22c55e, #15803d) for action, trust, and growth.
- **Secondary:** Neutral backgrounds and subtle grays for clarity and focus.
- **Accent:** Soft yellows and blues for highlights and charts.
- **Destructive:** Red for errors and warnings.
- Colors are defined as CSS variables in `globals.css` and mapped in `tailwind.config.ts` for consistency.

### 2. Typography
- **Font:** Proxima Nova (via CDN), with fallbacks to Arial, Helvetica, sans-serif.
- **Weights:** 400 (regular), 500, 600, 700 (bold).
- **Usage:**
  - Headings: Bold, clear, and slightly condensed.
  - Body: Regular for readability.
  - Buttons/Labels: Medium or bold for emphasis.

### 3. Spacing & Layout
- **Border Radius:** Consistent use of `--radius` CSS variable (default 0.75rem) for cards, buttons, and inputs.
- **Spacing:** Tailwind’s spacing scale for padding and margins.
- **Elevation:** Subtle shadows for cards and navigation (see Navbar styles).

### 4. Components
- **Buttons:**
  - Primary: Green gradient backgrounds, white text, rounded corners, subtle shadow.
  - Secondary: Transparent or muted backgrounds, green or gray text.
  - Disabled: Lower opacity, not interactive.
- **Inputs/Checkboxes:**
  - Rounded corners, clear focus states, accessible contrast.
  - Use of Radix UI primitives for accessibility.
- **Navigation:**
  - Fixed top navbar with blur and shadow.
  - Active states highlighted with green backgrounds and bold text.
- **Cards/Containers:**
  - White or neutral backgrounds, rounded corners, soft shadows.

### 5. Animations
- **Fade, slide, and scale** animations for smooth UI transitions (defined in `globals.css`).
- **Tailwind Animate** plugin for utility-based animation classes.

### 6. Theming
- **Light/Dark Mode:**
  - Uses CSS variables for easy theme switching.
  - Dark mode uses deeper greens and higher contrast for readability.

## Usage Guidelines
- Use Tailwind utility classes for rapid prototyping and consistency.
- Prefer CSS variables for colors, radii, and theming.
- Use Proxima Nova for all text for a modern, friendly feel.
- Ensure all interactive elements have clear focus and hover states.
- Test for accessibility (color contrast, keyboard navigation).

## Example Code
```tsx
// Example button (React + Tailwind)
<button
  className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold shadow-md hover:from-green-700 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-green-700"
>
  Get Started
</button>
```

## File References
- **globals.css:** Color variables, font import, base styles, animations.
- **tailwind.config.ts:** Theme extension, color mapping, border radius, plugins.
- **components/ui:** Reusable UI primitives (button, checkbox, tooltip, etc.).
- **components/Navbar.tsx:** Example of navigation design and style.

---

This design system is a living document. As AgroAI evolves, update this guide to reflect new patterns, components, and best practices.
