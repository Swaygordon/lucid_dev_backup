/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Body / default — Plus Jakarta Sans across the board (Sky & Ember direction).
        // Falls back to Inter then system fonts to avoid FOIT and to stay legible
        // if the webfont is slow to arrive.
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Display — same family; weight (700/800) carries the heading hierarchy.
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      height: {
        '128': '28rem',
      },
      colors: {
        // ── Sky & Ember brand ──────────────────────────────────────────────
        // Primary = sky/azure. DEFAULT is an AA-safe azure (4.8:1 on white with
        // white text) so filled buttons stay legible; `light` is the bright
        // sky-500 used for accents, icons, gradients, and focus glows.
        primary: {
          DEFAULT: '#0277bd',   // azure — AA-safe for white text on solid fills
          hover:   '#0369a1',   // sky-700
          light:   '#0ea5e9',   // sky-500 — bright accent / icon tint
          dark:    '#075985',   // sky-800 — deep text / active state
          50:      '#f0f9ff',   // sky-50  — subtle tint backgrounds
        },
        // Secondary = ember (warm orange CTA). Kept at orange-700 for AA contrast
        // with white text; `light` is orange-500 for accents that sit on tints.
        secondary: {
          DEFAULT: '#c2410c',   // orange-700 — AA-safe with white text
          hover:   '#9a3412',   // orange-800
          light:   '#f97316',   // orange-500 — accent
          dark:    '#7c2d12',   // orange-900
          50:      '#fff7ed',
        },
        // Status colors
        success: '#10b981',
        error: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
        },
        warning: '#f59e0b',
        info: '#0ea5e9',        // align "info" with the sky brand
      },
      borderRadius: {
        // Sky & Ember surfaces lean on a soft, consistent 12px (xl) radius.
        DEFAULT: '0.5rem',  // 8px
        lg: '0.625rem',     // 10px
        xl: '0.75rem',      // 12px — default card/control radius
        '2xl': '1rem',      // 16px — large cards / modals
        '3xl': '1.5rem',    // 24px — hero / feature panels
      },
      boxShadow: {
        // Soft, subtly-elevated surfaces (Soft UI evolution). Low-spread, low-alpha
        // multi-layer shadows read as gentle depth rather than hard drop shadows.
        sm:  '0 1px 2px 0 rgb(15 23 42 / 0.06)',
        md:  '0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.05)',
        lg:  '0 12px 28px -6px rgb(15 23 42 / 0.12), 0 4px 8px -4px rgb(15 23 42 / 0.06)',
        xl:  '0 24px 48px -12px rgb(15 23 42 / 0.16), 0 8px 16px -8px rgb(15 23 42 / 0.08)',
        // Colored glow shadows for buttons and stat cards (sky-forward palette).
        'glow-blue':   '0 6px 22px -4px rgba(2,119,189,0.45)',   // primary azure
        'glow-sky':    '0 6px 22px -4px rgba(14,165,233,0.45)',  // bright sky accent
        'glow-green':  '0 6px 22px -4px rgba(16,185,129,0.45)',
        'glow-orange': '0 6px 22px -4px rgba(249,115,22,0.45)',
        'glow-purple': '0 6px 22px -4px rgba(139,92,246,0.45)',
        'glow-red':    '0 6px 22px -4px rgba(239,68,68,0.45)',
      },
    },
  },

  plugins: [],
}
