import { describe, expect, it } from 'vitest'
import { MENUS } from '../src/data/menus'
import { ALLERGEN_OPTIONS, QUESTIONS } from '../src/data/questions'
import { isAllowed, recommend, WEIGHTS } from '../src/engine/recommend'
import type { Answers, Ingredient, Menu, Mood, Trait } from '../src/engine/types'

// RNG ที่กำหนด seed ได้ เพื่อให้เทสต์ผลเดิมทุกครั้ง
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const noJitter = () => 0
const SEEDS = Array.from({ length: 20 }, (_, i) => i + 1)
const MOODS: Mood[] = ['stressed', 'tired', 'heal', 'bored']
const ANIMAL: Ingredient[] = ['pork', 'beef', 'poultry', 'fish', 'shellfish', 'egg', 'dairy']

const fitsMood = (m: Menu, mood: Mood) => m.traits.some((t) => (WEIGHTS.moodTraits[mood][t] ?? 0) > 0)

describe('menu data', () => {
  it('has at least 150 menus with unique ids and names', () => {
    expect(MENUS.length).toBeGreaterThanOrEqual(150)
    expect(new Set(MENUS.map((m) => m.name)).size).toBe(MENUS.length)
    expect(new Set(MENUS.map((m) => m.id)).size).toBe(MENUS.length)
  })

  it('every menu has at least one trait', () => {
    expect(MENUS.filter((m) => m.traits.length === 0).map((m) => m.id)).toEqual([])
  })

  it('every trait appears on at least 4 menus', () => {
    const traits: Trait[] = ['bold', 'chewy', 'soupy', 'gentle', 'crispy', 'cheesy', 'sweet', 'novel', 'diy']
    for (const t of traits) expect(MENUS.filter((m) => m.traits.includes(t)).length, t).toBeGreaterThanOrEqual(4)
  })

  it('every mood has at least 10 fitting menus', () => {
    for (const mood of MOODS) expect(MENUS.filter((m) => fitsMood(m, mood)).length, mood).toBeGreaterThanOrEqual(10)
  })

  it('has enough vegan and halal options', () => {
    expect(MENUS.filter((m) => isAllowed(m, { vegan: true })).length).toBeGreaterThanOrEqual(25)
    expect(MENUS.filter((m) => isAllowed(m, { halal: true })).length).toBeGreaterThanOrEqual(80)
  })

  it('every mood still has fitting menus for vegan (≥3) and halal (≥10) diets', () => {
    for (const mood of MOODS) {
      const fit = MENUS.filter((m) => fitsMood(m, mood))
      expect(fit.filter((m) => isAllowed(m, { vegan: true })).length, `vegan ${mood}`).toBeGreaterThanOrEqual(3)
      expect(fit.filter((m) => isAllowed(m, { halal: true })).length, `halal ${mood}`).toBeGreaterThanOrEqual(10)
    }
  })

  it('questions are mood, taste, spice in order', () => {
    expect(QUESTIONS.map((q) => q.key)).toEqual(['mood', 'taste', 'spice'])
  })
})

describe('recommend', () => {
  it('returns 3 distinct menus', () => {
    const res = recommend(MENUS, {}, {}, {}, seeded(1))
    expect(res).toHaveLength(3)
    expect(new Set(res.map((r) => r.menu.id)).size).toBe(3)
  })

  it('is deterministic for the same rng seed', () => {
    const a: Answers = { mood: 'tired', taste: 'mild' }
    const ids = (s: number) => recommend(MENUS, a, {}, {}, seeded(s)).map((r) => r.menu.id)
    expect(ids(7)).toEqual(ids(7))
  })

  it('varies results across seeds when no answers given (random mode)', () => {
    const tops = new Set(SEEDS.map((s) => recommend(MENUS, {}, {}, {}, seeded(s))[0].menu.id))
    expect(tops.size).toBeGreaterThan(5)
  })

  it.each(MOODS)('mood "%s" returns menus matching its food concept', (mood) => {
    for (const s of SEEDS) {
      for (const r of recommend(MENUS, { mood }, {}, {}, seeded(s))) expect(fitsMood(r.menu, mood)).toBe(true)
    }
  })

  it('tired mood avoids very spicy food', () => {
    for (const s of SEEDS) {
      for (const r of recommend(MENUS, { mood: 'tired' }, {}, {}, seeded(s))) expect(r.menu.traits).not.toContain('bold')
    }
  })

  it.each(ALLERGEN_OPTIONS.map((o) => o.value))('never returns menus containing allergen "%s"', (allergen) => {
    for (const s of SEEDS) {
      for (const mood of MOODS) {
        for (const r of recommend(MENUS, { mood }, { allergies: [allergen] }, {}, seeded(s))) {
          expect(r.menu.contains).not.toContain(allergen)
        }
      }
    }
  })

  it('halal excludes pork and vegan excludes all animal products', () => {
    for (const s of SEEDS) {
      for (const mood of MOODS) {
        for (const r of recommend(MENUS, { mood }, { halal: true }, {}, seeded(s))) {
          expect(r.menu.contains).not.toContain('pork')
        }
        for (const r of recommend(MENUS, { mood }, { vegan: true }, {}, seeded(s))) {
          expect(r.menu.contains.some((i) => ANIMAL.includes(i))).toBe(false)
        }
      }
    }
  })

  it('combines restrictions', () => {
    for (const r of recommend(MENUS, { mood: 'stressed' }, { halal: true, allergies: ['shellfish', 'peanut'] }, {}, seeded(3))) {
      expect(r.menu.contains).not.toContain('pork')
      expect(r.menu.contains).not.toContain('shellfish')
      expect(r.menu.contains).not.toContain('peanut')
    }
  })

  it('every combination of restrictions still leaves at least 3 dishes', () => {
    const allergens = ALLERGEN_OPTIONS.map((o) => o.value)
    const flags = 2 + allergens.length
    for (let mask = 0; mask < 1 << flags; mask++) {
      const prefs = {
        halal: (mask & 1) > 0,
        vegan: (mask & 2) > 0,
        allergies: allergens.filter((_, i) => mask & (4 << i)),
      }
      expect(MENUS.filter((m) => isAllowed(m, prefs)).length, JSON.stringify(prefs)).toBeGreaterThanOrEqual(3)
    }
  })

  it('respects spice level', () => {
    const hot = recommend(MENUS, { taste: 'spicy', spice: 3 }, {}, {}, noJitter)
    expect(hot.every((r) => r.menu.spice >= 2)).toBe(true)
    const mild = recommend(MENUS, { taste: 'mild', spice: 0 }, {}, {}, noJitter)
    expect(mild.every((r) => r.menu.spice === 0)).toBe(true)
  })

  it('excludes recent and rejected menus', () => {
    const first = recommend(MENUS, { mood: 'stressed' }, {}, {}, noJitter).map((r) => r.menu.id)
    const next = recommend(MENUS, { mood: 'stressed' }, {}, { rejected: [first[0]], recent: first.slice(1) }, noJitter)
    for (const r of next) expect(first).not.toContain(r.menu.id)
  })

  it('falls back when history excludes everything', () => {
    const all = MENUS.map((m) => m.id)
    expect(recommend(MENUS, {}, {}, { recent: all }, seeded(1))).toHaveLength(3)
    expect(recommend(MENUS, {}, {}, { rejected: all }, seeded(1))).toHaveLength(3)
  })

  it('explains the pick with up to 2 reasons', () => {
    const [top] = recommend(MENUS, { mood: 'tired', taste: 'mild', spice: 0 }, {}, {}, noJitter)
    expect(top.reasons.length).toBeGreaterThan(0)
    expect(top.reasons.length).toBeLessThanOrEqual(2)
    expect(top.reasons).toContain('น้ำซุปอุ่นๆ ช่วยฟื้นแรง')
  })

  it('still explains random-mode picks from the dish traits', () => {
    for (const s of SEEDS) {
      for (const r of recommend(MENUS, {}, {}, {}, seeded(s))) {
        expect(r.reasons.length).toBeGreaterThan(0)
        expect(r.reasons.length).toBeLessThanOrEqual(2)
      }
    }
  })
})
