# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript, static SPA (no backend). Deploy target: Vercel or Netlify. Tests: Vitest.

## Users

People who can't decide what to eat: they are hungry right now, usually on their phone, and either have no idea what they want or are stuck choosing between too many options.

## Product Purpose

Mood n Food turns how the user feels right now into a Thai dish recommendation in under a minute. The user answers 3 short questions (mood, taste, spice level) and gets 1 main pick plus 2 backups, each with a short reason why it fits. Success = the user leaves with a dish they're happy to go eat, and doesn't need to reroll more than half the time.

## Positioning

Recommendations are driven by mood → food concept, not by cuisine lists or ratings:
- เครียด สมองตื้อ → bold, spicy/sour/salty food to wake the brain, or chewy food to release stress
- เหนื่อยล้า หมดพลัง → gentle, easy-to-digest food and warm soup
- อยากฮีลใจ เหงาๆ เศร้าๆ → crispy, cheesy, or sweet comfort food
- เบื่อๆ อยากหาอะไรสนุก → novel flavours or grill/DIY food eaten together

## Operating Context

Used at the moment of hunger, one-handed on a phone, often in a hurry. No sign-up. Preferences and history are kept on the device only (localStorage).

## Capabilities and Constraints

- Thai food first (72 dishes in `src/data/menus.ts`), rule-based scoring in `src/engine/recommend.ts`. No AI/LLM, no mini-game in the MVP.
- Dietary restrictions are hard filters: halal (no pork), vegan (no animal products incl. fish sauce), allergies (shellfish, fish, peanut, egg, dairy). Ingredient data is typical-recipe and must always carry the disclaimer that shops differ.
- "ไม่เอา สุ่มใหม่" (reject and reroll) and a skip-the-quiz random button are required.
- Food visuals are emoji for now; no food photography until licensing is sorted.

## Brand Commitments

- Name shown to users: **Mood n Food**.
- Voice: a close friend inviting you to eat — casual Thai, a little playful ("วันนี้เหนื่อยมาเหรอ เอาซุปร้อนๆ ไปเลย"), never preachy.

## Evidence on Hand

No users, testimonials or metrics yet. Do not fabricate any.

## Product Principles

1. Decide for them: at most 4 choices per screen, no typing, always end with a concrete dish.
2. Fast over thorough: the whole flow fits inside a minute.
3. Safety over coverage: dietary filters never relax, even if few dishes remain.
4. Explain the pick in friend-speak so it feels chosen, not random.

## Accessibility & Inclusion

Thai-language UI; must be readable and tappable on small phones.
