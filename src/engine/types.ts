export type Category = 'rice' | 'noodle' | 'soup' | 'salad' | 'grill' | 'snack' | 'dessert'
export type Taste = 'spicy' | 'sour-sweet' | 'salty-rich' | 'mild'
export type Mood = 'stressed' | 'tired' | 'heal' | 'bored'
export type SpiceLevel = 0 | 1 | 2 | 3

// ลักษณะอาหาร ใช้จับคู่กับมู๊ด (ดู WEIGHTS.moodTraits)
export type Trait =
  | 'bold' // รสจัดจ้าน เผ็ด เปรี้ยว เค็ม
  | 'chewy' // เคี้ยวสนุก หนึบ
  | 'soupy' // มีน้ำซุปอุ่นๆ
  | 'gentle' // อ่อนๆ ย่อยง่าย
  | 'crispy' // กรุบกรอบ
  | 'cheesy' // ชีสเยิ้ม
  | 'sweet' // ของหวาน
  | 'novel' // มีลูกเล่น รสแปลกใหม่
  | 'diy' // ได้ลงมือทำ/กินร่วมกัน เช่น ปิ้งย่าง

// fish รวมน้ำปลา/ปลาร้า, shellfish รวมกุ้ง ปู หมึก หอย ซอสหอยนางรม กะปิ กุ้งแห้ง
export type Ingredient = 'pork' | 'beef' | 'poultry' | 'fish' | 'shellfish' | 'egg' | 'dairy' | 'peanut'
export type Allergen = Extract<Ingredient, 'shellfish' | 'fish' | 'peanut' | 'egg' | 'dairy'>

export type Menu = {
  id: string
  name: string
  emoji: string
  category: Category
  taste: Taste[]
  traits: Trait[]
  spice: SpiceLevel
  contains: Ingredient[]
  blurb: string
}

// ทุกข้อเป็น optional: โหมด "สุ่มเลย" ส่ง {} ได้
export type Answers = {
  mood?: Mood
  taste?: Taste
  spice?: SpiceLevel
}

export type Prefs = {
  halal?: boolean
  vegan?: boolean
  allergies?: Allergen[]
}

export type History = {
  recent?: string[]
  rejected?: string[]
}

export type Recommendation = {
  menu: Menu
  score: number
  reasons: string[]
}
