import { afterEach, describe, expect, it, vi } from 'vitest'
import { dietSummary } from '../src/data/questions'
import { loadHistory, loadPrefs, RECENT_MAX, saveHistory, savePrefs } from '../src/lib/storage'

function fakeStorage(initial: Record<string, string> = {}) {
  const data = { ...initial }
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => {
      data[k] = v
    },
  })
  return data
}

afterEach(() => vi.unstubAllGlobals())

describe('storage', () => {
  it('round-trips prefs and history', () => {
    fakeStorage()
    savePrefs({ halal: true, allergies: ['peanut'] })
    saveHistory({ recent: ['a'], rejected: ['b'] })
    expect(loadPrefs()).toEqual({ halal: true, vegan: false, allergies: ['peanut'] })
    expect(loadHistory()).toEqual({ recent: ['a'], rejected: ['b'] })
  })

  it('drops unknown or malformed values', () => {
    fakeStorage({
      'mnf:prefs': JSON.stringify({ halal: 'yes', vegan: true, allergies: ['peanut', 'gluten', 3] }),
      'mnf:history': JSON.stringify({ recent: Array.from({ length: 30 }, (_, i) => `m${i}`), rejected: 'x' }),
    })
    expect(loadPrefs()).toEqual({ halal: false, vegan: true, allergies: ['peanut'] })
    const h = loadHistory()
    expect(h.recent).toHaveLength(RECENT_MAX)
    expect(h.rejected).toEqual([])
  })

  it('falls back to empty values on corrupt JSON or missing storage', () => {
    fakeStorage({ 'mnf:prefs': '{oops' })
    expect(loadPrefs()).toEqual({})
    vi.unstubAllGlobals()
    vi.stubGlobal('localStorage', undefined)
    expect(loadHistory()).toEqual({ recent: [], rejected: [] })
    expect(() => savePrefs({ vegan: true })).not.toThrow()
  })

  it('summarises active restrictions in short labels', () => {
    expect(dietSummary({ vegan: true, allergies: ['shellfish', 'dairy'] })).toEqual(['วีแกน', 'กุ้ง/ปู/หอย', 'นม'])
    expect(dietSummary({})).toEqual([])
  })
})
