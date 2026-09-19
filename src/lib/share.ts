export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed'

/** แชร์ผ่านเมนูแชร์ของเครื่อง ถ้าไม่มีให้คัดลอกข้อความแทน */
export async function shareText(text: string): Promise<ShareResult> {
  const url = location.origin + location.pathname
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Mood n Food', text, url })
      return 'shared'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`)
    return 'copied'
  } catch {
    return 'failed'
  }
}
