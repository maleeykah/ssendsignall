# Typography System
This document defines the complete typography system for Send Signal.
The system is inspired by Material Design 3 but adapted specifically for a data-heavy SaaS interface where hierarchy, scannability, and density matter more than expressive type.

---

## 1. Objectives

Typography must:
- Establish clear, immediate visual hierarchy across all UI surfaces
- Support fast scanning — especially in dashboards, tables, and campaign lists
- Maintain readability across all screen sizes and data densities
- Enforce consistency through tokens — no one-off decisions
- Support high-density data views without visual clutter
- Never require a designer to approve a font-size decision — the scale answers it

---

## 2. Font Family

### Primary Font
**Inter** — chosen for its legibility at small sizes, tabular number support, and neutral character well-suited to data interfaces.

### Fallback Stack
```css
font-family: 'Inter', -apple-system, system-ui, Roboto, Arial, sans-serif;
```

### Numeric Rendering (Important for Data Views)
For any column displaying numbers (counts, rates, percentages, IDs):
```css
font-variant-numeric: tabular-nums;
```
This ensures number columns align correctly in tables — critical for campaign metrics and lead counts.

### Rules
- ❌ Do NOT introduce additional font families
- ❌ Do NOT mix font families across components
- ❌ Do NOT load fonts without `font-display: swap`
- ✅ Preload Inter via `<link rel="preload">` in document `<head>`
- ✅ Only load the weights actually used: **400**, **500**, **600** — do not load the full variable range unnecessarily

---

## 3. Type Scale (Token-Based)

All typography must use predefined tokens from `tokens.css`. No arbitrary values. No inline sizes. No exceptions.

### Token Naming Convention
```
--font-size-{category}-{size}
--line-height-{category}-{size}
--font-weight-{category}-{size}   ← only where weight varies by role
--letter-spacing-{category}-{size}
```

### Full Token Scale

| Token | Size (rem) | Size (px equiv) | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `--font-size-display-large` | 3.5625rem | 57px | 400 | 1.12 | -0.25px |
| `--font-size-display-medium` | 2.8125rem | 45px | 400 | 1.16 | 0px |
| `--font-size-display-small` | 2.25rem | 36px | 400 | 1.22 | 0px |
| `--font-size-headline-large` | 2rem | 32px | 400 | 1.25 | 0px |
| `--font-size-headline-medium` | 1.75rem | 28px | 400 | 1.29 | 0px |
| `--font-size-headline-small` | 1.5rem | 24px | 400 | 1.33 | 0px |
| `--font-size-title-large` | 1.375rem | 22px | 500 | 1.27 | 0px |
| `--font-size-title-medium` | 1rem | 16px | 500 | 1.5 | 0.15px |
| `--font-size-title-small` | 0.875rem | 14px | 500 | 1.43 | 0.1px |
| `--font-size-body-large` | 1rem | 16px | 400 | 1.5 | 0.5px |
| `--font-size-body-medium` | 0.875rem | 14px | 400 | 1.43 | 0.25px |
| `--font-size-body-small` | 0.75rem | 12px | 400 | 1.33 | 0.4px |
| `--font-size-label-large` | 0.875rem | 14px | 500 | 1.43 | 0.1px |
| `--font-size-label-medium` | 0.75rem | 12px | 500 | 1.33 | 0.5px |
| `--font-size-label-small` | 0.6875rem | 11px | 500 | 1.45 | 0.5px |

### Absolute Rules
- ❌ No arbitrary font sizes (e.g., `font-size: 13px` or `text-[13px]`)
- ❌ No inline `font-size` values in component files
- ❌ No Tailwind font-size utilities (`text-sm`, `text-lg`) — use tokens only
- ✅ Always reference CSS variables: `font-size: var(--font-size-body-large)`

---

## 4. Type Hierarchy & Usage

Each scale category has a defined role. Use the right category for the right context — do not use a token just because the size looks right visually.

---

### Display — Hero / Key Emphasis Only

| Token | Use Case |
|---|---|
| `display-large` | Marketing/landing page hero headings only |
| `display-medium` | Rare — splash screens, onboarding intros |
| `display-small` | Rare — feature highlight callouts |

> ⚠️ **Display is never used inside the application dashboard, campaign views, lead tables, or any core app UI.**
> If you are tempted to use Display inside the app, use Headline instead.

---

### Headline — Page & Section Structure

| Token | Use Case |
|---|---|
| `headline-large` | Main page title (e.g., "Campaigns", "Leads", "Analytics") |
| `headline-medium` | Major section dividers within a page |
| `headline-small` | Subsection headers, modal titles, drawer headings |

Rules:
- One `headline-large` per page maximum
- Headline is always semibold (`font-weight: 600`) in application context
- Do not use Headline inside cards or table cells

---

### Title — Component-Level Hierarchy

| Token | Use Case |
|---|---|
| `title-large` | Page subsection headings, sidebar section labels |
| `title-medium` | Card headers, panel titles, tab labels |
| `title-small` | Dense UI headers, collapsed sidebar items, grouped form section labels |

Rules:
- Title is the workhorse of the app UI — use it for anything "named" inside a component
- Always `font-weight: 500`
- `title-small` is the minimum for interactive element labels that carry semantic meaning

---

### Body — Primary Reading Content

| Token | Use Case |
|---|---|
| `body-large` | Default paragraph text, lead detail views, template content |
| `body-medium` | Secondary descriptive text, list item descriptions, help text |
| `body-small` | Supporting metadata, timestamps, secondary row info in tables |

Rules:
- `body-large` is the default — when in doubt, use it
- `body-small` must not be used for primary information — only supplemental
- Body text is always `font-weight: 400`
- Minimum body size used anywhere in the app: `body-small` (0.75rem / 12px) — never go smaller

---

### Label — UI Controls & Functional Text

| Token | Use Case |
|---|---|
| `label-large` | Button text, primary CTAs, prominent action labels |
| `label-medium` | Form field labels, input placeholders, dropdown items |
| `label-small` | Tags, status chips, badges, table column headers, captions |

Rules:
- Labels are always `font-weight: 500` — they must be clearly readable at small sizes
- `label-small` is used for **status badges** (e.g., "Delivered", "Unsubscribed", "Failed") — pair with a color token, never rely on size alone
- Table column headers use `label-small` with `letter-spacing: 0.5px` and `text-transform: uppercase` for visual distinction from data rows
- Button text must always use `label-large` — never body tokens on interactive controls

---

## 5. Line Height & Spacing

Line height is defined entirely via tokens — never set manually.

### Philosophy
- **Display / Headline** → tighter line height (content is large, tight feels intentional and editorial)
- **Body** → relaxed line height (users read multiple lines; comfort matters)
- **Labels** → compact but not cramped (functional, not reading text)
- **Dense data views** (tables, lead lists) → use `body-small` or `label-small` with their native line heights — do not override

### Paragraph Spacing
- For multi-paragraph body content (e.g., help documentation, template descriptions): `margin-bottom: 1em` between paragraphs
- Do not add paragraph spacing to single-line UI text (labels, table cells, badges)

### Vertical Rhythm in Forms
- Label → Input gap: `8px` (use spacing token `--spacing-2`)
- Input → Helper text gap: `4px` (use spacing token `--spacing-1`)
- Field group spacing: `16px` between fields (use spacing token `--spacing-4`)

---

## 6. Responsive Typography

### Core Rules
- All font-size tokens must resolve to `rem` values — never `px` directly in component styles
- Base font size on `<html>`: `16px` (browser default — do not override)
- Display and Headline tokens must use `clamp()` for fluid scaling

### Clamp Formula
```
clamp(minimum, preferred, maximum)
```
- **minimum** = smallest acceptable size (used at ~320px viewport)
- **preferred** = fluid middle value (`Xvw`)
- **maximum** = the base token value (used at standard desktop width)

### Responsive Token Overrides

| Token | Clamp Value |
|---|---|
| `--font-size-display-large` | `clamp(2.25rem, 5vw, 3.5625rem)` |
| `--font-size-display-medium` | `clamp(1.875rem, 4vw, 2.8125rem)` |
| `--font-size-display-small` | `clamp(1.5rem, 3.5vw, 2.25rem)` |
| `--font-size-headline-large` | `clamp(1.5rem, 3vw, 2rem)` |
| `--font-size-headline-medium` | `clamp(1.25rem, 2.5vw, 1.75rem)` |
| `--font-size-headline-small` | `clamp(1.125rem, 2vw, 1.5rem)` |
| `--font-size-title-large` | `clamp(1.125rem, 1.8vw, 1.375rem)` |

> Title, Body, and Label tokens do **not** use clamp — they remain fixed. These are functional UI text that should not reflow at different viewport sizes.

### Breakpoint Behaviour
- At `< 768px` (mobile): Headline tokens shift down one size (Large → Medium, Medium → Small)
- Dashboard data tables switch to a simplified card layout — `body-medium` replaces `body-small` for readability on small screens
- Display tokens are marketing-only and irrelevant to app breakpoints

---

## 7. Color & Contrast (Typography-Specific)

Font color must always come from `tokens.css` color variables — never hardcoded.

### Text Color Roles

| Role | Token | Usage |
|---|---|---|
| Primary text | `--color-text-primary` | Headings, body content, button labels |
| Secondary text | `--color-text-secondary` | Descriptions, helper text, metadata |
| Disabled text | `--color-text-disabled` | Inactive controls, placeholder text |
| Inverse text | `--color-text-inverse` | Text on dark/colored backgrounds |
| Error text | `--color-text-error` | Validation errors, failure messages |
| Success text | `--color-text-success` | Confirmation messages, success states |
| Link text | `--color-text-link` | Clickable text links |

### Contrast Requirements (WCAG 2.1 AA — Minimum)
| Text type | Minimum contrast ratio |
|---|---|
| Normal text (< 18px / < 14px bold) | 4.5:1 |
| Large text (≥ 18px / ≥ 14px bold) | 3:1 |
| UI components & state indicators | 3:1 |

> ⚠️ `body-small` (12px) at `--color-text-secondary` must still meet 4.5:1 against its background. Verify in high-density table views where background colors may vary.

### Rules
- ❌ Never use color as the **sole** differentiator of meaning (e.g., red text for error without an icon or label)
- ❌ Never use `opacity` to simulate disabled text color — use `--color-text-disabled` directly
- ✅ Status badge text must always meet contrast on its background color (e.g., "Delivered" chip text on green chip background)

---

## 8. Specific UI Surface Rules

### Tables & Data Grids (Campaign list, Lead list, Message logs)
- Column headers: `label-small` + `text-transform: uppercase` + `letter-spacing: 0.5px`
- Row data: `body-medium` (primary cell content) or `body-small` (secondary/metadata cells)
- Numeric columns: `body-medium` + `font-variant-numeric: tabular-nums`
- Status columns: `label-small` inside a chip/badge component
- Row hover state must not change font weight — use background color only

### Forms
- Field labels: `label-medium` — always above the input, never placeholder-only
- Input text (typed value): `body-large`
- Placeholder text: `body-large` + `--color-text-disabled`
- Helper / hint text: `body-small` + `--color-text-secondary`
- Error messages: `body-small` + `--color-text-error` + error icon
- Section headings within forms: `title-small`

### Cards & Panels
- Card title: `title-medium`
- Card body: `body-medium`
- Card metadata (timestamps, tags): `body-small` or `label-small`
- Card action link: `label-medium`

### Buttons
- Primary / Secondary buttons: `label-large`
- Tertiary / Text buttons: `label-medium`
- Icon-only buttons: no visible label — must have `aria-label`
- Destructive actions: same label tokens — use color (red token) to signal intent, not weight or size

### Status Badges & Chips
Used extensively for lead status (`Delivered`, `Unsubscribed`, `Replied`) and campaign status (`Sending`, `Paused`, `Completed`):
- Text: `label-small`
- Always paired with a background color token and matching text color token
- Do not use font weight alone to signal status — always use background + text color pair

### Empty States
- Heading: `headline-small`
- Description: `body-medium` + `--color-text-secondary`
- CTA button: `label-large`

### Toasts & Notifications
- Message text: `body-medium`
- Action link within toast: `label-medium`

---

## 9. Accessibility Requirements

- Minimum font size used anywhere in the application: `0.6875rem` / `11px` (`label-small`) — and only for non-critical supplemental text
- Never use `font-size` below `label-small` in any component
- Do not rely on `font-weight` alone to convey importance — pair with size or color
- All text must remain visible when browser zoom is set to 200% (no overflow clipping)
- Avoid `text-overflow: ellipsis` on content that carries critical meaning — show full text on hover/expand
- Do not use italic styling for anything other than editorial quotes or code comments — never for UI labels or status text
- `aria-label` required on any icon-only element that replaces visible text

---

## 10. Anti-Patterns (Never Do These)

| ❌ Anti-Pattern | ✅ Correct Approach |
|---|---|
| `font-size: 13px` | Use `var(--font-size-body-small)` |
| `className="text-sm"` | Use token via CSS class |
| `style={{ fontSize: '0.9rem' }}` | Never inline — use token |
| Using Display tokens in dashboard | Use Headline tokens |
| `color: #333` directly | Use `var(--color-text-primary)` |
| `font-weight: 700` on body text | Body is always 400 — use Title or Label if emphasis needed |
| `line-height: 1` on any text | Never tighten below token value |
| Placeholder text as the only label | Always add a visible `<label>` above the input |
| Ellipsing status text in badges | Status badges must show full text — constrain the container width instead |
| `opacity: 0.5` to dim text | Use `--color-text-secondary` or `--color-text-disabled` |

---
