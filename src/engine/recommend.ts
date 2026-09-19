import type { Answers, History, Ingredient, Menu, Mood, Prefs, Recommendation, Taste, Trait } from './types'

// ปรับจูนความแม่นยำได้ที่นี่ที่เดียว
export const WEIGHTS = {
  // มู๊ด → ลักษณะอาหารที่เข้ากัน (ค่าลบ = ไม่เหมาะ)
  moodTraits: {
    stressed: { bold: 4, chewy: 3 },
    tired: { soupy: 4, gentle: 3, bold: -2 },
    heal: { cheesy: 4, sweet: 4, crispy: 3 },
    bored: { novel: 4, diy: 4 },
  } as Record<Mood, Partial<Record<Trait, number>>>,
  taste: 3,
  spiceExact: 2, // ความเผ็ดตรงเป๊ะ; ห่างออกไปแต่ละระดับหัก spicePerStep
  spicePerStep: 2,
  jitter: 1.5, // ความสุ่มสูงสุดที่บวกเพิ่ม เพื่อไม่ให้ผลซ้ำทุกครั้ง
}

const TRAIT_REASONS: Record<Trait, string> = {
  bold: 'รสจัดจ้านช่วยปลุกสมองให้ตื่นตัว',
  chewy: 'เคี้ยวเพลินช่วยคลายเครียด',
  soupy: 'น้ำซุปอุ่นๆ ช่วยฟื้นแรง',
  gentle: 'อ่อนโยนต่อท้อง ย่อยง่าย',
  crispy: 'กรุบกรอบ ฟินทุกคำ',
  cheesy: 'ชีสเยิ้มๆ ฮีลใจ',
  sweet: 'ความหวานช่วยเติมความสุข',
  novel: 'มีลูกเล่น ไม่จำเจ',
  diy: 'ได้ลงมือทำและกินด้วยกัน สนุกกว่า',
}

const TASTE_REASONS: Record<Taste, string> = {
  spicy: 'รสเผ็ดจี๊ดตามที่อยากได้',
  'sour-sweet': 'เปรี้ยวหวานกำลังดี',
  'salty-rich': 'รสเค็มมันถึงใจ',
  mild: 'รสกลมกล่อม ไม่จัดจ้าน',
}

const ANIMAL: Ingredient[] = ['pork', 'beef', 'poultry', 'fish', 'shellfish', 'egg', 'dairy']

export function isAllowed(menu: Menu, prefs: Prefs): boolean {
  const has = (i: Ingredient) => menu.contains.includes(i)
  if (prefs.halal && has('pork')) return false
  if (prefs.vegan && ANIMAL.some(has)) return false
  if (prefs.allergies?.some(has)) return false
  return true
}

type Factor = { reason: string; score: number }

function scoreFactors(menu: Menu, a: Answers): Factor[] {
  const factors: Factor[] = []
  if (a.mood) {
    const weights = WEIGHTS.moodTraits[a.mood]
    for (const t of menu.traits) {
      const w = weights[t]
      if (w) factors.push({ reason: TRAIT_REASONS[t], score: w })
    }
  }
  if (a.taste && menu.taste.includes(a.taste)) {
    factors.push({ reason: TASTE_REASONS[a.taste], score: WEIGHTS.taste })
  }
  if (a.spice !== undefined) {
    const score = WEIGHTS.spiceExact - WEIGHTS.spicePerStep * Math.abs(menu.spice - a.spice)
    factors.push({ reason: 'ความเผ็ดพอดีกับที่รับไหว', score })
  }
  return factors
}

// เหตุผล 2 ข้อจากปัจจัยที่ได้คะแนนบวกสูงสุด; ถ้าไม่มี (เช่น โหมดสุ่ม) ใช้ลักษณะเด่นของเมนูแทน
function buildReasons(factors: Factor[], menu: Menu): string[] {
  const reasons = factors
    .filter((f) => f.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 2)
    .map((f) => f.reason)
  return reasons.length > 0 ? reasons : menu.traits.slice(0, 2).map((t) => TRAIT_REASONS[t])
}

/**
 * จัดอันดับเมนูตามคำตอบ คืนค่าไม่เกิน `count` เมนู (อันดับ 1 = ผลหลัก ที่เหลือ = สำรอง)
 * ข้อจำกัดอาหารเป็น hard filter เสมอ; เมนูที่เพิ่งได้/ปฏิเสธจะถูกผ่อนเงื่อนไขเมื่อเหลือไม่พอ
 */
export function recommend(
  menus: Menu[],
  answers: Answers,
  prefs: Prefs = {},
  history: History = {},
  rng: () => number = Math.random,
  count = 3,
): Recommendation[] {
  const allowed = menus.filter((m) => isAllowed(m, prefs))
  const rejected = new Set(history.rejected)
  const recent = new Set(history.recent)
  const tiers = [
    allowed.filter((m) => !rejected.has(m.id) && !recent.has(m.id)),
    allowed.filter((m) => !rejected.has(m.id)),
  ]
  const pool = tiers.find((t) => t.length >= count) ?? allowed

  return pool
    .map((menu) => {
      const factors = scoreFactors(menu, answers)
      const base = factors.reduce((sum, f) => sum + f.score, 0)
      return { menu, factors, score: base + rng() * WEIGHTS.jitter }
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, count)
    .map(({ menu, factors, score }) => ({ menu, score, reasons: buildReasons(factors, menu) }))
}
