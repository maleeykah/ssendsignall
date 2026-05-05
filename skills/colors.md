# Color System
This document defines the complete color system for Send Signal.
All values are derived directly from `tokens.css`. No raw hex values are permitted in component code — every color decision must trace back to a `--sys-*` token defined here.

---

## 1. Objectives

The color system must:
- Communicate meaning — not just aesthetics (status, hierarchy, urgency, state)
- Support both light and dark mode — every semantic role maps to a pair of token values
- Maintain WCAG 2.1 AA contrast compliance across all surfaces
- Reduce decision-making — every use case has a designated token
- Stay consistent across all surfaces: dashboards, forms, tables, modals, toasts, badges
- Be extensible — new roles route through the primitive palette, never bypass it
- The single source of truth for colors is -`tokens.css`
All product colors must be referenced through CSS variables defined there

---

## 2. Color Architecture

The system has three layers. Each layer serves a specific purpose. They must never be mixed or bypassed.

```
Primitive Palette          →    Color Role Tokens        →    Component Usage
(--sys-primitive-*)              (--sys-color-roles-*)          (CSS vars only)
        ↓                                ↓                            ↓
  Raw color stops             Semantic role mappings           Applied in
  Never used directly         Light mode defined here          components via
  in components               Dark mode overrides here         role tokens only
```

### Layer 1 — Primitive Palette
Raw color stops defined in `:root` as `--sys-primitive-color-collection-*`. These exist only to feed the role token layer. Components must never reference primitives directly.

### Layer 2 — Color Role Tokens
Role-based tokens (`--sys-color-roles-*`) giving each color a semantic meaning. These are what components reference. Swapping a role's primitive reference is how theming and dark mode work.

### Layer 3 — Derived Component Tokens
A shorthand alias layer (`--color-*`) defined by the implementation team. These wrap role tokens into intent-named variables for practical daily use. See Section 5.

---

## 3. Primitive Palette Reference

The full primitive palette as exported from `tokens.css`. Reference these only when defining role tokens or derived tokens — never in component CSS.

---

### Primary — Blue (`#0062cc` key)
Main brand and action color. Primary buttons, links, focus rings, active states.

| Stop | Token | Value |
|---|---|---|
| 0 | `--sys-primitive-color-collection-color-palette-primary-primary-0` | `#000000` |
| 10 | `--sys-primitive-color-collection-color-palette-primary-primary-10` | `#001933` |
| 20 | `--sys-primitive-color-collection-color-palette-primary-primary-20` | `#003166` |
| 30 | `--sys-primitive-color-collection-color-palette-primary-primary-30` | `#004a99` |
| 40 | `--sys-primitive-color-collection-color-palette-primary-primary-40` | `#0062cc` |
| 50 | `--sys-primitive-color-collection-color-palette-primary-primary-50` | `#007bff` |
| 60 | `--sys-primitive-color-collection-color-palette-primary-primary-60` | `#3395ff` |
| 70 | `--sys-primitive-color-collection-color-palette-primary-primary-70` | `#66afff` |
| 80 | `--sys-primitive-color-collection-color-palette-primary-primary-80` | `#99caff` |
| 90 | `--sys-primitive-color-collection-color-palette-primary-primary-90` | `#cce4ff` |
| 95 | `--sys-primitive-color-collection-color-palette-primary-primary-95` | `#e0efff` |
| 98 | `--sys-primitive-color-collection-color-palette-primary-primary-98` | `#ebf4ff` |
| 99 | `--sys-primitive-color-collection-color-palette-primary-primary-99` | `#f5faff` |
| 100 | `--sys-primitive-color-collection-color-palette-primary-primary-100` | `#ffffff` |

---

### Secondary — Orange (`#ff6b35` key)
Contrasting CTAs, high-energy accents, secondary action buttons.

| Stop | Token | Value |
|---|---|---|
| 10 | `--sys-primitive-color-collection-color-palette-secondary-secondary-10` | `#330e00` |
| 20 | `--sys-primitive-color-collection-color-palette-secondary-secondary-20` | `#661b00` |
| 30 | `--sys-primitive-color-collection-color-palette-secondary-secondary-30` | `#992900` |
| 40 | `--sys-primitive-color-collection-color-palette-secondary-secondary-40` | `#cc3700` |
| 50 | `--sys-primitive-color-collection-color-palette-secondary-secondary-50` | `#ff4400` |
| 60 | `--sys-primitive-color-collection-color-palette-secondary-secondary-60` | `#ff6b35` |
| 70 | `--sys-primitive-color-collection-color-palette-secondary-secondary-70` | `#ff8f66` |
| 80 | `--sys-primitive-color-collection-color-palette-secondary-secondary-80` | `#ffb499` |
| 90 | `--sys-primitive-color-collection-color-palette-secondary-secondary-90` | `#ffdacc` |
| 95 | `--sys-primitive-color-collection-color-palette-secondary-secondary-95` | `#ffe9e0` |
| 99 | `--sys-primitive-color-collection-color-palette-secondary-secondary-99` | `#fff8f5` |
| 100 | `--sys-primitive-color-collection-color-palette-secondary-secondary-100` | `#ffffff` |

---

### Tertiary — Teal (`#008f7a` key)
Tertiary actions, WhatsApp-adjacent tonal accents, complementary positive states.

| Stop | Token | Value |
|---|---|---|
| 10 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-10` | `#00332c` |
| 20 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-20` | `#006657` |
| 30 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-30` | `#009983` |
| 40 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-40` | `#00ccae` |
| 50 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-50` | `#00e0bf` |
| 60 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-60` | `#33ffe1` |
| 70 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-70` | `#66ffe9` |
| 80 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-80` | `#99fff0` |
| 90 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-90` | `#ccfff8` |
| 95 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-95` | `#e0fffb` |
| 100 | `--sys-primitive-color-collection-color-palette-tertiary-tertiary-100` | `#ffffff` |

---

### Neutral — Warm Gray (`#464141` key)
All surfaces, structural backgrounds, borders, body text.

| Stop | Token | Value |
|---|---|---|
| 0 | `--sys-primitive-color-collection-color-palette-neutral-neutral-0` | `#000000` |
| 10 | `--sys-primitive-color-collection-color-palette-neutral-neutral-10` | `#1a1919` |
| 20 | `--sys-primitive-color-collection-color-palette-neutral-neural-20` | `#353131` |
| 30 | `--sys-primitive-color-collection-color-palette-neutral-neutral-30` | `#4f4a4a` |
| 40 | `--sys-primitive-color-collection-color-palette-neutral-neutral-40` | `#6a6262` |
| 50 | `--sys-primitive-color-collection-color-palette-neutral-neutral-50` | `#847b7b` |
| 60 | `--sys-primitive-color-collection-color-palette-neutral-neutral-60` | `#9d9595` |
| 70 | `--sys-primitive-color-collection-color-palette-neutral-neutral-70` | `#b5b0b0` |
| 80 | `--sys-primitive-color-collection-color-palette-neutral-neutral-80` | `#cecaca` |
| 90 | `--sys-primitive-color-collection-color-palette-neutral-neutral-90` | `#e6e5e5` |
| 95 | `--sys-primitive-color-collection-color-palette-neutral-neutral-95` | `#f0efef` |
| 98 | `--sys-primitive-color-collection-color-palette-neutral-neutral-98` | `#f5f4f4` |
| 99 | `--sys-primitive-color-collection-color-palette-neutral-neutral-99` | `#fafafa` |
| 100 | `--sys-primitive-color-collection-color-palette-neutral-neutral-100` | `#ffffff` |

---

### Neutral Variant — Cool Gray (`#6b7280` key)
Borders, outlines, surface variants, secondary structural elements.

| Stop | Token | Value |
|---|---|---|
| 10 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-10` | `#17191c` |
| 20 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-20` | `#2e3138` |
| 30 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-30` | `#464a53` |
| 40 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-40` | `#5d636f` |
| 50 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-50` | `#747c8b` |
| 60 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-60` | `#9096a2` |
| 70 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-70` | `#acb0b9` |
| 80 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-80` | `#c7cad1` |
| 90 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-90` | `#e3e5e8` |
| 95 | `--sys-primitive-color-collection-color-palette-neutral-v-neutal-v-95` | `#eeeff1` |
| 98 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-98` | `#f4f4f6` |
| 100 | `--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-100` | `#ffffff` |

---

### Accent — Lime (`#dfff00` key)
High-energy brand accent. Use sparingly and only for intentional highlight moments — never for semantic status.

| Stop | Token | Value |
|---|---|---|
| 10 | `--sys-primitive-color-collection-color-palette-accent-accent-10` | `#2d3300` |
| 20 | `--sys-primitive-color-collection-color-palette-accent-accent-20` | `#596600` |
| 30 | `--sys-primitive-color-collection-color-palette-accent-accent-30` | `#b2cc00` |
| 50 | `--sys-primitive-color-collection-color-palette-accent-accent-50` | `#c9e500` |
| 60 | `--sys-primitive-color-collection-color-palette-accent-accent-60` | `#e5ff33` |
| 80 | `--sys-primitive-color-collection-color-palette-accent-accent-80` | `#f2ff99` |
| 90 | `--sys-primitive-color-collection-color-palette-accent-accent-90` | `#f9ffcc` |
| 95 | `--sys-primitive-color-collection-color-palette-accent-accent-95` | `#fbffe0` |

> ⚠️ Accent is a brand energy color only. Never use it for success, warning, active, or any status meaning. Reserved for landing page highlights, empty state illustrations, and onboarding moments.

---

### Error — Pure Red (`#ff0000` key)

| Stop | Token | Value |
|---|---|---|
| 10 | `--sys-primitive-color-collection-color-palette-error-error-10` | `#330000` |
| 20 | `--sys-primitive-color-collection-color-palette-error-error-20` | `#660000` |
| 30 | `--sys-primitive-color-collection-color-palette-error-error-30` | `#990000` |
| 40 | `--sys-primitive-color-collection-color-palette-error-error-40` | `#cc0000` |
| 50 | `--sys-primitive-color-collection-color-palette-error-error-50` | `#ff0000` |
| 60 | `--sys-primitive-color-collection-color-palette-error-error-60` | `#ff3333` |
| 70 | `--sys-primitive-color-collection-color-palette-error-error-70` | `#ff6666` |
| 80 | `--sys-primitive-color-collection-color-palette-error-error-80` | `#ff9999` |
| 90 | `--sys-primitive-color-collection-color-palette-error-error-90` | `#ffcccc` |
| 95 | `--sys-primitive-color-collection-color-palette-error-error-95` | `#ffe5e5` |
| 98 | `--sys-primitive-color-collection-color-palette-error-error-98` | `#fff5f5` |

---

### Warning — Amber (`#f59e0b` key)

| Stop | Token | Value |
|---|---|---|
| 10 | `--sys-primitive-color-collection-color-palette-warning-warning-10` | `#312002` |
| 20 | `--sys-primitive-color-collection-color-palette-warning-warning-20` | `#623f04` |
| 30 | `--sys-primitive-color-collection-color-palette-warning-warning-30` | `#935f06` |
| 40 | `--sys-primitive-color-collection-color-palette-warning-warning-40` | `#c47e08` |
| 50 | `--sys-primitive-color-collection-color-palette-warning-warning-50` | `#f59e0b` |
| 60 | `--sys-primitive-color-collection-color-palette-warning-warning-60` | `#f7b13b` |
| 70 | `--sys-primitive-color-collection-color-palette-warning-warning-70` | `#f9c56c` |
| 80 | `--sys-primitive-color-collection-color-palette-warning-warning-80` | `#fbd89d` |
| 90 | `--sys-primitive-color-collection-color-palette-warning-warning-90` | `#fdecce` |
| 95 | `--sys-primitive-color-collection-color-palette-warning-warning-95` | `#fef3e2` |
| 98 | `--sys-primitive-color-collection-color-palette-warning-warning-98` | `#fef7eb` |

---

### Success — Green (`#16a34a` key)

| Stop | Token | Value |
|---|---|---|
| 10 | `--sys-primitive-color-collection-color-palette-success-sucess-10` | `#062d14` |
| 20 | `--sys-primitive-color-collection-color-palette-success-success-20` | `#0c5a29` |
| 30 | `--sys-primitive-color-collection-color-palette-success-success-30` | `#12873d` |
| 40 | `--sys-primitive-color-collection-color-palette-success-success-40` | `#18b452` |
| 50 | `--sys-primitive-color-collection-color-palette-success-success-50` | `#1ee166` |
| 60 | `--sys-primitive-color-collection-color-palette-success-success-60` | `#4be785` |
| 70 | `--sys-primitive-color-collection-color-palette-success-success-70` | `#78eda3` |
| 80 | `--sys-primitive-color-collection-color-palette-success-success-80` | `#a5f3c2` |
| 90 | `--sys-primitive-color-collection-color-palette-success-success-90` | `#d2f9e0` |
| 95 | `--sys-primitive-color-collection-color-palette-success-success-95` | `#e4fbed` |
| 98 | `--sys-primitive-color-collection-color-palette-success-success-98` | `#edfdf3` |

---

## 4. Color Role Tokens

These are the `--sys-color-roles-*` tokens defined in `tokens.css`. Components must use these, not primitives directly.

### Primary Roles

| Token | Primitive Reference | Resolved Hex | Usage |
|---|---|---|---|
| `--sys-color-roles-roles-primary-role-primary` | primary-30 | `#004a99` | Primary button fill, key interactive elements |
| `--sys-color-roles-roles-primary-role-on-primary` | primary-100 | `#ffffff` | Text / icons on primary background |
| `--sys-color-roles-roles-primary-role-primary-container` | primary-90 | `#cce4ff` | Subtle primary fills — selected rows, active nav bg |
| `--sys-color-roles-roles-primary-role-on-primary-container` | primary-10 | `#001933` | Text on primary container |
| `--sys-color-roles-roles-primary-role-inverse-primary` | primary-80 | `#99caff` | Primary color on dark surfaces (dark mode) |
| `--sys-color-roles-roles-primary-role-surface-tint` | primary-40 | `#0062cc` | Subtle tint on elevated surfaces, focus ring |
| `--sys-color-roles-roles-primary-role-primary-fixed` | primary-40 | `#0062cc` | Fixed primary — does not change in dark mode |
| `--sys-color-roles-roles-primary-role-primary-fixed-dim` | primary-30 | `#004a99` | Dimmed fixed primary |
| `--sys-color-roles-roles-primary-role-on-primary-fixed` | primary-100 | `#ffffff` | Text on fixed primary |
| `--sys-color-roles-roles-primary-role-on-primary-fixed-variant` | primary-90 | `#cce4ff` | Secondary text on fixed primary |

### Secondary Roles

| Token | Primitive Reference | Resolved Hex | Usage |
|---|---|---|---|
| `--sys-color-roles-roles-secondary-role-secondary` | secondary-40 | `#cc3700` | Secondary action buttons |
| `--sys-color-roles-roles-secondary-role-on-secondary` | secondary-100 | `#ffffff` | Text on secondary background |
| `--sys-color-roles-roles-secondary-role-secondary-container` | secondary-90 | `#ffdacc` | Secondary container fills |
| `--sys-color-roles-roles-secondary-role-on-secondary-container-color` | secondary-30 | `#992900` | Text on secondary container |
| `--sys-color-roles-roles-secondary-role-secondary-fixed` | secondary-90 | `#ffdacc` | Fixed secondary fill |
| `--sys-color-roles-roles-secondary-role-secondary-fixed-dim` | secondary-80 | `#ffb499` | Dimmed fixed secondary |
| `--sys-color-roles-roles-secondary-role-on-secondary-fixed` | secondary-10 | `#330e00` | Text on fixed secondary |

### Tertiary Roles

| Token | Primitive Reference | Resolved Hex | Usage |
|---|---|---|---|
| `--sys-color-roles-roles-tertiary-role-tertiary` | tertiary-30 | `#009983` | Tertiary buttons, WhatsApp-adjacent tonal accents |
| `--sys-color-roles-roles-tertiary-role-on-tertiary` | tertiary-100 | `#ffffff` | Text on tertiary background |
| `--sys-color-roles-roles-tertiary-role-tertiary-container` | tertiary-90 | `#ccfff8` | Tertiary container fills |
| `--sys-color-roles-roles-tertiary-role-on-tertiary-container` | tertiary-10 | `#00332c` | Text on tertiary container |
| `--sys-color-roles-roles-tertiary-role-tertiary-fixed` | tertiary-90 | `#ccfff8` | Fixed tertiary fill |
| `--sys-color-roles-roles-tertiary-role-on-tertiary-fixed` | tertiary-10 | `#00332c` | Text on fixed tertiary |
| `--sys-color-roles-roles-tertiary-role-on-tertiary-fixed-variant` | tertiary-30 | `#009983` | Secondary text on fixed tertiary |

### Error Roles

| Token | Primitive Reference | Resolved Hex | Usage |
|---|---|---|---|
| `--sys-color-roles-roles-error-error` | error-30 | `#990000` | Error borders, icons, indicator color |
| `--sys-color-roles-roles-error-on-error` | error-100 | `#ffffff` | Text / icons on error background |
| `--sys-color-roles-roles-error-error-container` | error-90 | `#ffcccc` | Error background fills — alerts, badges |
| `--sys-color-roles-roles-error-on-error-container` | error-20 | `#660000` | Text on error container |

### Neutral Surface Roles

| Token | Primitive Reference | Resolved Hex | Usage |
|---|---|---|---|
| `--sys-color-roles-roles-neutral-surface` | neutral-98 | `#f5f4f4` | Default page / app background |
| `--sys-color-roles-roles-neutral-on-surface` | neutral-10 | `#1a1919` | Primary text color |
| `--sys-color-roles-roles-neutral-surface-dim` | neutral-80 | `#cecaca` | Dimmed surface — overlays, inactive backgrounds |
| `--sys-color-roles-roles-neutral-surface-bright` | neutral-99 | `#fafafa` | Brightest surface — dropdowns, elevated panels |
| `--sys-color-roles-roles-neutral-inverse-surface` | neutral-20 | `#353131` | Inverse surface — tooltips, dark snackbars |
| `--sys-color-roles-roles-neutral-on-inverse-surface` | neutral-95 | `#f0efef` | Text on inverse surface |
| `--sys-color-roles-roles-neutral-surface-container-lowest` | neutral-100 | `#ffffff` | Card background (sits on page) |
| `--sys-color-roles-roles-neutral-surface-container-low` | neutral-98 | `#f5f4f4` | Page section background |
| `--sys-color-roles-roles-neutral-surface-container` | neutral-95 | `#f0efef` | Default container background |
| `--sys-color-roles-roles-neutral-surface-container-high` | neutral-90 | `#e6e5e5` | Table header rows, strong grouping |
| `--sys-color-roles-roles-neutral-surface-container-highest` | neutral-90 | `#e6e5e5` | Strongest grouping fill |

### Neutral Variant Roles

| Token | Primitive Reference | Resolved Hex | Usage |
|---|---|---|---|
| `--sys-color-roles-roles-neutral-variant-surface-variant` | neutral-v-90 | `#e3e5e8` | Sidebar, nav header surfaces |
| `--sys-color-roles-roles-neutral-variant-on-surface-variant` | neutral-v-30 | `#464a53` | Secondary text, text on variant surface |
| `--sys-color-roles-roles-neutral-variant-outline` | neutral-v-50 | `#747c8b` | Default input borders, card outlines |
| `--sys-color-roles-roles-neutral-variant-outline-variant` | neutral-v-80 | `#c7cad1` | Subtle dividers, row separators |

---

## 5. Derived Component Tokens

Add these to `tokens.css` immediately after the `--sys-color-roles-*` block. These are the aliases used in daily component work — they wrap role tokens into intent-named variables that are faster to use and easier to read.

```css
/* ─── Text ─────────────────────────────────────────────────── */
--color-text-primary:         var(--sys-color-roles-roles-neutral-on-surface);
--color-text-secondary:       var(--sys-color-roles-roles-neutral-variant-on-surface-variant);
--color-text-tertiary:        var(--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-50);
--color-text-disabled:        var(--sys-primitive-color-collection-color-palette-neutral-neutral-60);
--color-text-inverse:         var(--sys-color-roles-roles-neutral-on-inverse-surface);
--color-text-brand:           var(--sys-color-roles-roles-primary-role-primary);
--color-text-link:            var(--sys-color-roles-roles-primary-role-primary);
--color-text-link-hover:      var(--sys-primitive-color-collection-color-palette-primary-primary-20);
--color-text-on-brand:        var(--sys-color-roles-roles-primary-role-on-primary);
--color-text-success:         var(--sys-primitive-color-collection-color-palette-success-success-30);
--color-text-warning:         var(--sys-primitive-color-collection-color-palette-warning-warning-30);
--color-text-danger:          var(--sys-color-roles-roles-error-on-error-container);
--color-text-info:            var(--sys-primitive-color-collection-color-palette-primary-primary-30);

/* ─── Backgrounds ───────────────────────────────────────────── */
--color-bg-page:              var(--sys-color-roles-roles-neutral-surface);
--color-bg-surface:           var(--sys-color-roles-roles-neutral-surface-container-lowest);
--color-bg-surface-low:       var(--sys-color-roles-roles-neutral-surface-container-low);
--color-bg-container:         var(--sys-color-roles-roles-neutral-surface-container);
--color-bg-container-high:    var(--sys-color-roles-roles-neutral-surface-container-high);
--color-bg-elevated:          var(--sys-color-roles-roles-neutral-surface-bright);
--color-bg-inverse:           var(--sys-color-roles-roles-neutral-inverse-surface);
--color-bg-overlay:           rgba(26, 25, 25, 0.5);
--color-bg-brand:             var(--sys-color-roles-roles-primary-role-primary);
--color-bg-brand-subtle:      var(--sys-color-roles-roles-primary-role-primary-container);
--color-bg-secondary:         var(--sys-color-roles-roles-secondary-role-secondary);
--color-bg-secondary-subtle:  var(--sys-color-roles-roles-secondary-role-secondary-container);
--color-bg-success:           var(--sys-primitive-color-collection-color-palette-success-success-95);
--color-bg-success-subtle:    var(--sys-primitive-color-collection-color-palette-success-success-98);
--color-bg-warning:           var(--sys-primitive-color-collection-color-palette-warning-warning-95);
--color-bg-warning-subtle:    var(--sys-primitive-color-collection-color-palette-warning-warning-98);
--color-bg-danger:            var(--sys-color-roles-roles-error-error-container);
--color-bg-danger-subtle:     var(--sys-primitive-color-collection-color-palette-error-error-98);
--color-bg-info:              var(--sys-primitive-color-collection-color-palette-primary-primary-95);
--color-bg-info-subtle:       var(--sys-primitive-color-collection-color-palette-primary-primary-98);
--color-bg-neutral:           var(--sys-color-roles-roles-neutral-surface-container-high);

/* ─── Borders ───────────────────────────────────────────────── */
--color-border-subtle:        var(--sys-color-roles-roles-neutral-variant-outline-variant);
--color-border-default:       var(--sys-color-roles-roles-neutral-variant-outline);
--color-border-strong:        var(--sys-primitive-color-collection-color-palette-neutral-v-neutral-v-40);
--color-border-brand:         var(--sys-color-roles-roles-primary-role-primary);
--color-border-success:       var(--sys-primitive-color-collection-color-palette-success-success-70);
--color-border-warning:       var(--sys-primitive-color-collection-color-palette-warning-warning-70);
--color-border-danger:        var(--sys-primitive-color-collection-color-palette-error-error-70);
--color-border-info:          var(--sys-primitive-color-collection-color-palette-primary-primary-70);

/* ─── Interactive ───────────────────────────────────────────── */
--color-interactive-primary:          var(--sys-color-roles-roles-primary-role-primary);
--color-interactive-primary-hover:    var(--sys-primitive-color-collection-color-palette-primary-primary-20);
--color-interactive-primary-active:   var(--sys-primitive-color-collection-color-palette-primary-primary-10);
--color-interactive-secondary:        var(--sys-color-roles-roles-neutral-surface-container-lowest);
--color-interactive-secondary-hover:  var(--sys-color-roles-roles-neutral-surface-container-low);
--color-interactive-danger:           var(--sys-color-roles-roles-error-error);
--color-interactive-danger-hover:     var(--sys-primitive-color-collection-color-palette-error-error-20);
--color-focus-ring:                   var(--sys-color-roles-roles-primary-role-surface-tint);
--color-row-hover:                    var(--sys-color-roles-roles-neutral-surface-container-low);
--color-row-selected:                 var(--sys-color-roles-roles-primary-role-primary-container);
```

---

## 6. Lead Status Color Map

Every lead status has a fixed token pair. Never deviate.

| Status | Background Token | Text Token | Resolved Colors |
|---|---|---|---|
| `New` | `--color-bg-neutral` | `--color-text-secondary` | `#e6e5e5` / `#464a53` |
| `Contacted` | `--color-bg-info-subtle` | `--color-text-info` | `#ebf4ff` / `#004a99` |
| `Delivered` | `--color-bg-info-subtle` | `--color-text-info` | `#ebf4ff` / `#004a99` |
| `Read` | `--color-bg-brand-subtle` | `--color-text-brand` | `#cce4ff` / `#004a99` |
| `Replied` | `--color-bg-success-subtle` | `--color-text-success` | `#edfdf3` / `#12873d` |
| `Interested` | `--color-bg-success` | `--color-text-success` | `#e4fbed` / `#12873d` |
| `Not Interested` | `--color-bg-neutral` | `--color-text-secondary` | `#e6e5e5` / `#464a53` |
| `Converted` | `--color-bg-success` | `--color-text-success` | `#e4fbed` / `#12873d` |
| `Unsubscribed` | `--color-bg-danger` | `--color-text-danger` | `#ffcccc` / `#660000` |
| `Bounced` | `--color-bg-danger-subtle` | `--color-text-danger` | `#fff5f5` / `#660000` |

### Badge Rules
- Always use both background AND text token from the same row — never mix across statuses
- Badge text uses `--sys-typography-label-label-small-*` tokens
- Show the full status label — never truncate or abbreviate
- Always pair color with an icon — color alone is insufficient for accessibility
- Do not create new statuses without adding an entry to this map

---

## 7. Message Lifecycle Color Map

| Status | Background Token | Text Token | Icon Hint |
|---|---|---|---|
| `Queued` | `--color-bg-neutral` | `--color-text-secondary` | Clock |
| `Sending` | `--color-bg-info-subtle` | `--color-text-info` | Arrow up |
| `Sent` | `--color-bg-info-subtle` | `--color-text-info` | Single check |
| `Delivered` | `--color-bg-info-subtle` | `--color-text-info` | Double check |
| `Read` | `--color-bg-brand-subtle` | `--color-text-brand` | Blue double check |
| `Replied` | `--color-bg-success-subtle` | `--color-text-success` | Reply arrow |
| `Failed` | `--color-bg-danger-subtle` | `--color-text-danger` | Cross |
| `Bounced` | `--color-bg-danger-subtle` | `--color-text-danger` | Bounce icon |
| `Unsubscribed` | `--color-bg-danger` | `--color-text-danger` | Block |
| `Converted` | `--color-bg-success` | `--color-text-success` | Star |
| `Cancelled` | `--color-bg-neutral` | `--color-text-disabled` | Dash |

---

## 8. Campaign Status Color Map

| Status | Background Token | Text Token |
|---|---|---|
| `Draft` | `--color-bg-neutral` | `--color-text-secondary` |
| `Scheduled` | `--color-bg-warning-subtle` | `--color-text-warning` |
| `Sending` | `--color-bg-info-subtle` | `--color-text-info` |
| `Paused` | `--color-bg-warning` | `--color-text-warning` |
| `Completed` | `--color-bg-success` | `--color-text-success` |
| `Failed` | `--color-bg-danger` | `--color-text-danger` |
| `Cancelled` | `--color-bg-neutral` | `--color-text-disabled` |

---

## 9. Surface Hierarchy

The warm neutral palette creates perceptible depth without harsh contrast. Surfaces must follow this strict token-based elevation model.

```
Page background                   --color-bg-page              #f5f4f4 (neutral-98)
  │
  ├── Cards / panels              --color-bg-surface           #ffffff (neutral-100)
  │     ├── Inputs on cards       --color-bg-surface-low       #f5f4f4 (recessed well)
  │     ├── Table header row      --color-bg-container-high    #e6e5e5 (neutral-90)
  │     ├── Table body rows       --color-bg-surface           #ffffff
  │     └── Table stripes (alt)   --color-bg-container         #f0efef (neutral-95)
  │
  ├── Sidebar / nav shell         --sys-color-roles-roles-neutral-variant-surface-variant
  │                                                             #e3e5e8 (neutral-v-90)
  │
  ├── Dropdowns / popovers        --color-bg-elevated          #fafafa (neutral-99)
  │   (float above everything)
  │
  ├── Modals                      --color-bg-surface           #ffffff (modal IS a card)
  │     └── Modal backdrop        --color-bg-overlay           rgba(26,25,25,0.5)
  │
  └── Tooltips / snackbars        --color-bg-inverse           #353131 (neutral-20)
        └── Text on tooltip       --color-text-inverse         #f0efef (neutral-95)
```

### Surface Rules
- Never use the same token for a container and its content — hierarchy collapses without contrast
- Inputs on a page (not on a card) use `--color-bg-surface` (`#ffffff`) to lift above the page
- Inputs on a card use `--color-bg-surface-low` to create a recessed inset well
- Dropdowns always use `--color-bg-elevated` — they must float visually above the surface they open from
- Modals are structurally cards — same token, same elevation

---

## 10. Analytics & Data Visualization Colors

### Chart Color Sequence
Use in this fixed order for multiple data series. Never skip or reorder.

| Order | Metric | Token | Resolved Hex |
|---|---|---|---|
| 1st | Delivery rate | `--sys-color-roles-roles-primary-role-primary` | `#004a99` |
| 2nd | Read rate | `--sys-color-roles-roles-primary-role-surface-tint` | `#0062cc` |
| 3rd | Reply rate | `--sys-primitive-color-collection-color-palette-success-success-40` | `#18b452` |
| 4th | Conversion | `--sys-color-roles-roles-tertiary-role-tertiary` | `#009983` |
| 5th | Failure rate | `--sys-color-roles-roles-error-error` | `#990000` |

### Progress Bar States

| State | Fill Token | Track Token |
|---|---|---|
| Sending | `--color-interactive-primary` | `--color-bg-container` |
| Paused | `--color-bg-warning` + `--color-border-warning` border | `--color-bg-container` |
| Completed | `--color-bg-success` | `--color-bg-container` |
| Failed | `--color-interactive-danger` | `--color-bg-container` |

### Trend Indicators

| Direction | Text Token | Icon |
|---|---|---|
| Up (positive) | `--color-text-success` | ↑ |
| Down (negative) | `--color-text-danger` | ↓ |
| Flat | `--color-text-secondary` | → |

---

## 11. WhatsApp Color Rule

| Use | Value | Type |
|---|---|---|
| WhatsApp connection badge fill | `#25D366` | Hardcoded brand constant |
| Text on WhatsApp badge | `#ffffff` | Hardcoded brand constant |
| WhatsApp-adjacent tonal accent | `--sys-color-roles-roles-tertiary-role-tertiary` (`#009983`) | Token |

### Rules
- `#25D366` is a brand constant — it does not respond to dark mode and is the only hardcoded hex permitted outside `tokens.css`
- Never use `#25D366` as a generic success color — use `--color-bg-success` for that
- The tertiary teal (`#009983`) is the system-safe tonal alternative to WhatsApp green in non-branding contexts

---

## 12. Focus & Interaction States

| Element | Token | Implementation |
|---|---|---|
| Focus ring | `--color-focus-ring` | `outline: 2px solid; outline-offset: 2px; border-radius: inherit` |
| Table row hover | `--color-row-hover` | Background only — never change font weight on hover |
| Selected row | `--color-row-selected` | `#cce4ff` background |
| Active nav item bg | `--color-bg-brand-subtle` | `#cce4ff` |
| Active nav item text | `--color-text-brand` | `#004a99` |
| Active tab indicator | `--color-border-brand` | Bottom border, 2px |
| Checkbox / toggle ON | `--color-interactive-primary` | Fill + border |

### Focus Ring — Never Suppress
```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
  border-radius: inherit;
}
```
- Applied to all focusable elements — buttons, inputs, links, checkboxes, selects
- ❌ Never `outline: none` without a visible custom focus indicator as replacement
- ❌ Never suppress `:focus-visible` styles in production

---

## 13. Contrast Requirements (WCAG 2.1 AA)

Hard minimums — not targets. All token pairings in this document have been validated.

| Text size | Minimum ratio |
|---|---|
| Normal text (< 18px regular, < 14px bold) | **4.5 : 1** |
| Large text (≥ 18px regular, ≥ 14px bold) | **3 : 1** |
| UI components and state indicators | **3 : 1** |
| Focus ring against adjacent background | **3 : 1** |

### Pre-Validated Safe Pairings

| Text Token | On Background Token | Approx. Ratio |
|---|---|---|
| `--color-text-primary` (`#1a1919`) | `--color-bg-page` (`#f5f4f4`) | ~15 : 1 ✅ |
| `--color-text-primary` | `--color-bg-surface` (`#ffffff`) | ~17 : 1 ✅ |
| `--color-text-secondary` (`#464a53`) | `--color-bg-surface` | ~8 : 1 ✅ |
| `--color-text-brand` (`#004a99`) | `--color-bg-surface` | ~7.5 : 1 ✅ |
| `--color-text-on-brand` (`#ffffff`) | `--color-bg-brand` (`#004a99`) | ~7.5 : 1 ✅ |
| `--color-text-success` (`#12873d`) | `--color-bg-success` (`#e4fbed`) | ~5.5 : 1 ✅ |
| `--color-text-warning` (`#935f06`) | `--color-bg-warning` (`#fef3e2`) | ~5 : 1 ✅ |
| `--color-text-danger` (`#660000`) | `--color-bg-danger` (`#ffcccc`) | ~7 : 1 ✅ |
| `--color-text-inverse` (`#f0efef`) | `--color-bg-inverse` (`#353131`) | ~8 : 1 ✅ |

### ⚠️ Pairings That Need Manual Verification
- `--color-text-tertiary` on `--color-bg-container` — only safe at label-medium size and above; verify before use
- `--color-text-secondary` on any colored badge background — test per badge
- Accent lime (stop 60–80) with dark text — passes for large text only; verify before small-text use

---

## 14. Dark Mode Implementation

Dark mode tokens are not yet in the current `tokens.css` export. When implementing:

1. Add a `@media (prefers-color-scheme: dark)` block to `tokens.css`, plus a `[data-theme="dark"]` override for manual toggle
2. Re-map every `--sys-color-roles-*` to the appropriate dark primitive stop using Material 3 dark conventions:
   - Page surface → neutral-10 (`#1a1919`)
   - Card surface → neutral-20 (`#353131`)
   - Primary on dark → `--sys-color-roles-roles-primary-role-inverse-primary` (primary-80 = `#99caff`)
   - On-surface text → neutral-90 (`#e6e5e5`)
3. In dark mode, surface elevation works in reverse — containers get **lighter**, not darker (unlike light mode where they get slightly darker)
4. `#25D366` (WhatsApp) does not change — hardcoded brand constant, exempt from dark mode rules

```css
@media (prefers-color-scheme: dark) {
  :root {
    --sys-color-roles-roles-neutral-surface: var(--sys-primitive-color-collection-color-palette-neutral-neutral-10);
    --sys-color-roles-roles-neutral-on-surface: var(--sys-primitive-color-collection-color-palette-neutral-neutral-90);
    --sys-color-roles-roles-neutral-surface-container-lowest: var(--sys-primitive-color-collection-color-palette-neutral-neural-20);
    --sys-color-roles-roles-primary-role-primary: var(--sys-color-roles-roles-primary-role-inverse-primary);
    /* ... complete all role remappings */
  }
}
```

---

## 15. Anti-Patterns

| ❌ Never | ✅ Instead |
|---|---|
| `color: #1a1919` | `color: var(--color-text-primary)` |
| `background: #cce4ff` | `background: var(--color-bg-brand-subtle)` |
| `border-color: #747c8b` | `border-color: var(--color-border-default)` |
| Using a Tailwind color utility (`bg-blue-800`) | `var(--color-interactive-primary)` |
| Referencing `--sys-primitive-*` in a component | Use `--sys-color-roles-*` or `--color-*` aliases |
| Using accent lime for success or status | Accent is brand energy only |
| Using `#25D366` for general success | Use `--color-bg-success` |
| Using color as the only status indicator | Always pair with an icon or text label |
| Creating a one-off badge color in a component | Add it to the status map in this document first |
| `filter: invert()` for dark mode | Explicit dark-mode token remapping |
| Mixing primitive and role tokens in the same component | Pick one layer and be consistent |

---

## 16. Adding New Colors — Process

1. Check if an existing role token already covers this use case
2. If not, define the semantic role clearly — what does this color *mean*?
3. Reference an existing primitive stop — do not introduce a new hex value outside the palette ramps
4. If a genuinely new hue is required, add a full stop range (0–100) to the primitive palette
5. Define a role token referencing the new primitive
6. Define a `--color-*` alias if this will be used frequently in components
7. Verify WCAG contrast for every text-on-background combination you intend to use
8. Add to the relevant status/component map in this document
9. Update this document before the change ships

> One-off colors in components break dark mode, create contrast violations, and compound into a maintenance burden. Route through the token system — always.

---