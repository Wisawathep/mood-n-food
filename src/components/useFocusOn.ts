import { useEffect, useRef } from 'react'

/**
 * ย้ายโฟกัสไปที่ element นี้เมื่อ `key` เปลี่ยน (และตอน mount ถ้า enabled)
 * ใช้กับหัวข้อของคูปองใบใหม่ ให้คีย์บอร์ดและ screen reader ตามทัน
 */
export function useFocusOn<T extends HTMLElement>(key: unknown, enabled = true) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (enabled) ref.current?.focus({ preventScroll: true })
  }, [key, enabled])
  return ref
}
