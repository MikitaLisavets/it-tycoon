# Desktop Life Agent Guidelines

## Styling Guidelines

### Colors
- **Always use CSS variables from `globals.css` for colors.**
- Do not use hardcoded hex, rgb, or color names in CSS modules.
- Use semantic variables (e.g., `--status-success`) rather than describing the color (e.g., `--green`) where possible.

### Font Sizes
- **Always use `px` units for `font-size` declarations.**
- Do not use `em`, `rem`, or other relative units for font sizes unless specifically instructed otherwise.
- The base font size for the application is `11px` (set in `globals.css`).
- Common conversions:
  - `0.75em` ≈ `8px`
  - `0.8em` ≈ `9px`
  - `0.85em` ≈ `9px`
  - `0.9em` ≈ `10px`
  - `0.95em` ≈ `10px`
  - `1em` = `11px`
  - `1.1em` ≈ `12px`

### Aesthetics
- Maintain the Windows XP / Retro GUI aesthetic.
- Use the color tokens defined in `globals.css` (e.g., `--xp-blue-title`, `--xp-bg`, `--xp-text`).

## Internationalization

- **Always use `next-intl` for all user-facing text.**
- Never hardcode strings in components.
- When adding new text or UI elements, you MUST add the corresponding translations to all supported locale files in the `messages/` directory (e.g., `en.json`, `de.json`).
- Use the `useTranslations` hook to retrieve translated strings in your components.
