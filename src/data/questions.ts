import type { Allergen, Answers, Prefs } from '../engine/types'

type Option<K extends keyof Answers> = {
  value: NonNullable<Answers[K]>
  label: string
  emoji: string
  hint?: string
}

// kind 'level' = ลูกเล่นเลือกระดับ (สไลเดอร์/ปุ่มระดับ), 'choice' = การ์ดกดเลือก
export type Question = {
  [K in keyof Answers]-?: { key: K; title: string; kind: 'choice' | 'level'; options: Option<K>[] }
}[keyof Answers]

export const QUESTIONS: Question[] = [
  {
    key: 'mood',
    title: 'ตอนนี้รู้สึกยังไง?',
    kind: 'choice',
    options: [
      { value: 'stressed', label: 'เครียด สมองตื้อ', emoji: '🤯', hint: 'รสจัดจ้านปลุกสมอง หรือของเคี้ยวสนุก' },
      { value: 'tired', label: 'เหนื่อยล้า หมดพลัง', emoji: '🥱', hint: 'อาหารอ่อนๆ ซุปอุ่นๆ ฟื้นแรง' },
      { value: 'heal', label: 'อยากฮีลใจ เหงาๆ เศร้าๆ', emoji: '🥺', hint: 'กรุบกรอบ ชีสเยิ้ม หรือของหวาน' },
      { value: 'bored', label: 'เบื่อๆ อยากหาอะไรสนุก', emoji: '😑', hint: 'รสแปลกใหม่ หรือปิ้งย่างกับเพื่อน' },
    ],
  },
  {
    key: 'taste',
    title: 'รสที่ใช่ตอนนี้?',
    kind: 'choice',
    options: [
      { value: 'spicy', label: 'เผ็ดจี๊ด', emoji: '🌶️' },
      { value: 'sour-sweet', label: 'เปรี้ยวหวาน', emoji: '🍋' },
      { value: 'salty-rich', label: 'เค็มมัน', emoji: '🧂' },
      { value: 'mild', label: 'จืดสบาย', emoji: '🥛' },
    ],
  },
  {
    key: 'spice',
    title: 'รับเผ็ดได้แค่ไหน?',
    kind: 'level',
    options: [
      { value: 0, label: 'ไม่เผ็ดเลย', emoji: '🥛' },
      { value: 1, label: 'นิดหน่อย', emoji: '🌶️' },
      { value: 2, label: 'กลางๆ', emoji: '🌶️🌶️' },
      { value: 3, label: 'เผ็ดจัด', emoji: '🔥' },
    ],
  },
]

// คูปองข้อจำกัดอาหาร (เลือกได้หลายข้อ, จำไว้ใน localStorage)
export const DIET_OPTIONS: { key: 'halal' | 'vegan'; label: string; hint: string; short: string }[] = [
  { key: 'halal', label: 'ฮาลาล', hint: 'ไม่มีหมู (ยังไม่ได้ดูว่าร้านได้รับรองฮาลาลไหม)', short: 'ฮาลาล' },
  { key: 'vegan', label: 'วีแกน', hint: 'ไม่มีเนื้อสัตว์ ปลา ไข่ นม รวมถึงน้ำปลา', short: 'วีแกน' },
]

export const ALLERGEN_OPTIONS: { value: Allergen; label: string; hint?: string; short: string }[] = [
  { value: 'shellfish', label: 'แพ้กุ้ง ปู หมึก หอย', hint: 'รวมซอสหอยนางรม กะปิ กุ้งแห้ง', short: 'กุ้ง/ปู/หอย' },
  { value: 'fish', label: 'แพ้ปลา', hint: 'รวมน้ำปลา ปลาร้า', short: 'ปลา' },
  { value: 'peanut', label: 'แพ้ถั่วลิสง', short: 'ถั่วลิสง' },
  { value: 'egg', label: 'แพ้ไข่', short: 'ไข่' },
  { value: 'dairy', label: 'แพ้นม', hint: 'รวมชีส นมข้น', short: 'นม' },
]

/** ชื่อย่อของข้อจำกัดที่เปิดอยู่ เช่น ['ฮาลาล', 'ถั่วลิสง'] */
export function dietSummary(prefs: Prefs): string[] {
  return [
    ...DIET_OPTIONS.filter((o) => prefs[o.key]).map((o) => o.short),
    ...ALLERGEN_OPTIONS.filter((o) => prefs.allergies?.includes(o.value)).map((o) => o.short),
  ]
}

export const DIET_DISCLAIMER = 'ข้อมูลส่วนผสมเป็นสูตรทั่วไป แต่ละร้านอาจต่างกัน กรุณาสอบถามร้านอีกครั้ง'
