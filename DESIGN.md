---
name: Mood n Food
description: A food-court coupon booklet that stamps your mood into one Thai dish.
colors:
  counter: "#14523c"
  counter-deep: "#0e3d2c"
  on-counter: "#f3ecd9"
  stock-yellow: "#f5c842"
  stock-pink: "#f4a9bb"
  stock-sky: "#a6d4ec"
  stock-ticket: "#fbfaf4"
  ink: "#1d1a16"
  stamp-violet: "#4b39a3"
  chili: "#c42d23"
  chili-deep: "#a92219"
  stem: "#1f6b4f"
  plate-white: "#ffffff"
typography:
  display:
    fontFamily: "Chonburi, serif"
    fontSize: "clamp(34px, 10.5vw, 46px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Chonburi, serif"
    fontSize: "clamp(28px, 8.4vw, 36px)"
    fontWeight: 400
    lineHeight: 1.4
  title:
    fontFamily: "Chonburi, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.45
  section-title:
    fontFamily: "Chonburi, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  body-lead:
    fontFamily: "Anuphan, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Anuphan, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Anuphan, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.4
  hint:
    fontFamily: "Anuphan, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  serial:
    fontFamily: "Chakra Petch, Anuphan, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.04em"
    fontFeature: "tnum"
rounded:
  cta-tag: "6px"
  control: "8px"
  coupon: "10px"
  round: "50%"
spacing:
  gutter: "16px"
  coupon-inset: "20px"
  stack-sm: "10px"
  stack-md: "18px"
components:
  coupon:
    backgroundColor: "{colors.stock-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.coupon}"
    width: "min(100%, 440px)"
  coupon-ticket:
    backgroundColor: "{colors.stock-ticket}"
    textColor: "{colors.ink}"
    rounded: "{rounded.coupon}"
  stub:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "14px 96px 14px 20px"
    height: "76px"
  button-primary:
    backgroundColor: "{colors.chili}"
    textColor: "{colors.plate-white}"
    rounded: "{rounded.coupon}"
    padding: "0 20px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.chili-deep}"
  button-line:
    textColor: "{colors.ink}"
    rounded: "{rounded.coupon}"
    padding: "0 20px"
    height: "54px"
  stamp:
    textColor: "{colors.stamp-violet}"
    rounded: "{rounded.control}"
    padding: "2px 10px 0"
  backup-cta:
    textColor: "{colors.stamp-violet}"
    rounded: "{rounded.cta-tag}"
    padding: "4px 10px"
  restart-link:
    textColor: "{colors.on-counter}"
    rounded: "{rounded.control}"
    height: "48px"
---

# Design System: Mood n Food

## Overview

**Creative North Star: "The Food-Court Coupon Counter"**

Every screen is a piece of coloured card stock lying on a flat green formica counter. A quiz question is a coupon, each answer is a tear-off stub you stamp with violet ink, progress is punched holes, and the result is a white queue ticket. The world is the Thai food court: cheap printed paper, dashed perforations, a rubber stamp that lands a little crooked. It rejects the white quiz card with a progress bar and pastel gradient.

Density is one coupon per viewport on a phone, one decision per coupon (at most four stubs). Colour is committed but disciplined: the card stock carries the colour, ink carries the text, and two accents each have exactly one job. Motion tells the paper story (slide in, stamp down, tear off) and nothing else.

**Key Characteristics:**
- One coupon column (max 440px) centred on a green counter; nothing floats outside a coupon except the restart link.
- Card stock rotates yellow, pink, sky across quiz steps; the result is always the off-white ticket.
- Dashed perforations with semicircular edge notches divide every coupon.
- Violet stamp ink means "chosen / confirmed / why". Chili red means "the one thing to do next".
- Thai-first type with generous line-heights; food shown as emoji on a plate, UI shown as authored line icons.

## Colors

A flat counter green under saturated card stock, with near-black ink and two single-job accents.

### Primary
- **Chili Red** (chili): the single primary action per screen, and the filled chilis on the spice scale. Hover deepens to **Chili Ember** (chili-deep).

### Secondary
- **Rubber-Stamp Violet** (stamp-violet): selection and confirmation only. The stamp mark on a chosen stub, the "why this dish" heading and check icons, the "pick this one" tag on backups, and the global focus ring (3px, 2px offset).

### Tertiary
- **Chili Stem Green** (stem): the stem stroke on chili icons and the favicon. Nowhere else.

### Neutral
- **Formica Counter** (counter): the page ground, with a soft white radial glow at top-left (7% alpha). Also the colour of punched holes and perforation notches, because they are holes through the paper.
- **Counter Shadow** (counter-deep): hover fill for controls that sit directly on the counter.
- **Counter Chalk** (on-counter): text on the counter (restart link).
- **Card Stock Yellow / Pink / Sky** (stock-yellow, stock-pink, stock-sky): quiz coupons, in that rotation. Yellow also rings the result plate; pink rings the backup plates.
- **Ticket White** (stock-ticket): the result coupon.
- **Receipt Ink** (ink): all text and outline buttons.
- **Plate White** (plate-white): the dish plates and text on chili.

Muted text, rules and hover fills are not fixed colours. Each coupon derives them from its own stock: muted = ink 74% into stock, rule = ink 30%, hover = ink 7%, pressed = ink 12% (all `color-mix` in oklab). New surfaces must derive the same way so tints follow the paper.

### Named Rules
**The One Chili Rule.** Chili red fills at most one control per screen: the primary action. Secondary actions are ink outlines; quiet actions are text.

**The Ink-Means-Chosen Rule.** Violet appears only where the user has chosen something, the app explains a choice, or keyboard focus sits (the focus ring). Never use it for decoration or navigation.

**The Hole-Through-Paper Rule.** Perforation notches and punched holes are painted with the counter colour. If a coupon ever sits on a different ground, the notches must take that ground's colour, or they read as grey dots.

## Typography

**Display Font:** Chonburi 400 (serif fallback)
**Body Font:** Anuphan 400 / 600 (system-ui fallback)
**Label/Mono Font:** Chakra Petch 600, serials only

**Character:** Chonburi is the printed-sign voice of the stall: wordmark, questions, dish names, the stamp. Anuphan is the friendly spoken line. Chakra Petch is the machine-printed serial number. All three are self-hosted through @fontsource; only these weights ship.

### Hierarchy
- **Display** (Chonburi 400, clamp(34px, 10.5vw, 46px), 1.1, -0.02em): the wordmark on the first coupon only.
- **Headline** (Chonburi 400, clamp(28px, 8.4vw, 36px), 1.4, balanced wrap): the dish name on the ticket.
- **Title** (Chonburi 400, 26px, 1.45): the question on each coupon.
- **Section title** (Chonburi 400, 17px, 1.5): "why this dish" (violet) and "or have" (muted). The small header wordmark uses Chonburi 15px.
- **Stamp** (Chonburi 400, 22px, 1.5; 18px on the spice scale and under 360px): the stamped word.
- **Body lead** (Anuphan 400, 18px, 1.6, max 30ch): friend-voice line under the wordmark and on the ticket.
- **Body** (Anuphan 400, 17px, 1.55–1.6, max 32ch for blurbs): dish blurb, reasons.
- **Label** (Anuphan 600, 19px, 1.4): stub answers; 17px for the quiet stub and backup names; 18px on buttons.
- **Hint** (Anuphan 400, 15px, 1.5, muted): stub sub-lines; spice labels are 600 at 15px.
- **Serial** (Chakra Petch 600, 13px, 0.04em, tabular numerals, muted): coupon number, top right.

### Named Rules
**The Thai Line-Height Rule.** Thai stacks vowels and tone marks above and below the line. Chonburi runs at 1.4 or more wherever it can wrap (the single-line wordmark at 1.1 is the only exception), and Anuphan text runs at 1.5 or more (tight 1.35–1.4 only on one-line labels).

**The Serial-Only Rule.** Chakra Petch is for serial numbers and counts, never for prose or headings.

## Layout

A single centred column. The counter pads 20px top (56px from 640px up), 16px sides, 40px bottom, and centres one coupon at `min(100%, 440px)`. Inside a coupon, content insets 20px from the paper edge; perforations inset 18px so the notches bite the edges.

Coupon anatomy, top to bottom: header row (min 56px: back button or small wordmark on the left, punched holes and serial on the right), optional intro, perforation, content block, perforation, footer stubs. Answer stubs are full-bleed rows (min 76px) separated by perforations, with 96px reserved on the right for the stamp (72px under 360px wide). The spice question lays four stubs side by side in a 4-column grid, split by dashed rules.

The result ticket must keep its two actions in the first viewport. Under 740px of height the plate shrinks from 148px to 112px and the vertical spacing tightens.

Touch targets are 44px minimum (back 44, restart 48, buttons 54, stubs 64–76).

## Elevation & Depth

Paper on a table: one soft drop shadow under each coupon, and everything else is flat print. Depth inside the paper comes from inset rings (plates) and inset shadows (punched holes), which read as printed or cut, not lifted.

### Shadow Vocabulary
- **Coupon lift** (`box-shadow: 0 1px 0 rgba(0,0,0,0.12), 0 14px 30px -8px rgba(0,0,0,0.45)`): every coupon, always. Not used on anything else.
- **Chili glow** (`box-shadow: 0 6px 14px -6px rgba(140,25,18,0.7)`): the primary button only.
- **Plate** (`box-shadow: inset 0 0 0 10px stock-yellow, inset 0 0 0 12px <yellow 70% into ink>, 0 10px 20px -8px rgba(0,0,0,0.3)`): the result dish plate.
- **Punched hole** (`box-shadow: inset 0 2px 2px rgba(0,0,0,0.35)`): a punched progress hole.

### Named Rules
**The Paper-Is-Flat Rule.** Only the coupon itself casts a shadow onto the counter. Stubs, rows and cards inside a coupon are flat; hover is a tint, not a lift.

## Shapes

Coupons have gently rounded corners (10px) and clip their contents. Perforations are 2px dashed rules in the stock-derived rule colour, with 22px semicircular notches cut into both edges. Grouped content inside a coupon (the reasons box) uses a dashed 2px border at 10px, like a printed box. Circles are for holes (12px), plates (148px, 48px) and nothing structural. The stamp is a double-ruled rounded rectangle (3px border plus inset ring, 8px), rotated -9deg.

## Components

### Coupon (signature)
Card stock with a header, serial and optional punch holes. Stock is set per coupon (yellow, pink, sky for quiz steps in rotation; ticket for results). Enters with `coupon-in` (460ms, ease-out `cubic-bezier(0.16,1,0.3,1)`, rising 26px from a 1.2deg tilt). When answered it leaves with `coupon-out` (300ms, ease-in `cubic-bezier(0.7,0,0.84,0)`: pivots on its top-left corner like a stub torn off a pad, -2.5deg at 30%, then drifts up 64px to -9deg and fades out).

### Perforation (signature)
A dashed rule with counter-coloured notches at both ends. Use it between every stub and between coupon sections. It is the only divider in the system.

### Answer stub
- **Shape:** full-width row, no border or radius; perforations are the edges.
- **Content:** label (Anuphan 600) with an optional muted hint.
- **Hover / Active:** stock tint 7% / 12% ink. Focus ring is inset (-4px offset) so it stays inside the paper.
- **Selected:** `aria-pressed`, marked by the stamp. The stub does not change colour.
- **Quiet stub:** muted, 64px, with a leading icon. Use it for "just pick for me" type escapes.

### Stamp (signature)
Violet Chonburi word ("เอา!") in a double-ruled box, -9deg, `mix-blend-mode: multiply`, and the SVG `#ink` displacement filter so the edges bleed like real ink. Lands with `stamp-down` (300ms: scale 1.7 to 0.94 to 1, settles at 0.92 opacity). The flow waits 380ms after a tap so the stamp is seen, then tears the coupon (300ms), then advances.

### Punched progress
Holes in the header, one per question: unpunched is a 2px ring, punched is filled with the counter colour and an inset shadow (300ms transition). The serial text carries the accessible label.

### Buttons
- **Shape:** 10px radius, 54px tall, 20px side padding, Anuphan 600 18px, 20px leading icon, 8px gap.
- **Primary:** chili fill, white text, chili glow. Hover chili-deep. Active nudges down 1px.
- **Line (secondary):** 2px ink border, transparent, hover stock tint.
- **Restart (on counter):** underlined chalk text, 48px, hover counter-deep, focus ring switches to yellow for contrast on green.

### Dish plate and backups
The dish emoji sits on a white plate with a yellow rim (148px, 72px emoji). Backups are full-width rows with a 48px pink-rimmed plate, name, and a violet outlined "pick this one" tag (6px radius).

### Reasons box
Dashed 2px box, 10px radius. Violet Chonburi heading, violet 18px check icons, Anuphan 17px lines.

### Icons
Authored inline SVG on a 24px grid, 2px round-cap, round-join stroke in `currentColor`, rendered at 18–22px. The chili is the only filled icon (1.8px stroke, stem in stem green; unfilled outline for "not spicy").

## Do's and Don'ts

### Do:
- **Do** put every new surface on a coupon: pick a stock, give it a serial, divide it with perforations. A dietary-preferences step is a coupon of stubs; a share card is a ticket-stock coupon.
- **Do** derive muted, rule and hover colours from the coupon's own stock with `color-mix` (74% / 30% / 7% ink).
- **Do** use violet ink for selection, confirmation and explanations, and chili for the single primary action.
- **Do** paint perforation notches and punched holes with the colour of the ground the coupon sits on.
- **Do** keep Chonburi at line-height 1.4 or more and Anuphan at 1.5 or more wherever text can wrap.
- **Do** use emoji for dishes only, always on a plate. Use authored 24px, 2px round-stroke SVG for every UI icon.
- **Do** disable coupon-in, coupon-out and stamp animations under `prefers-reduced-motion`; the stamp still shows at 0.92 opacity and the flow advances after 120ms.

### Don't:
- **Don't** use a white quiz card, a progress bar or a pastel gradient. Progress is punched holes.
- **Don't** put chili red on more than one control per screen, or use it as decoration beyond the spice chilis.
- **Don't** use violet for navigation, links or decoration.
- **Don't** add shadows or lifts to things inside a coupon; only the coupon casts a shadow.
- **Don't** use emoji as UI icons, or icon-font glyphs anywhere.
- **Don't** use Chakra Petch for anything but serials and counts.
- **Don't** mark selection by recolouring a stub; the stamp is the selection mark.
