// localStorage-based storage layer (replaces Cloudflare D1)

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Capsule {
  id: string
  title: string
  content: string
  emotion: string
  emotionScore: number
  intensity: number
  orbColor: string
  orbColor2: string
  orbPattern: string
  orbSize: number
  rarity: Rarity
  shareId: string
  openAt: number | null
  opened: boolean
  createdAt: number
  fusedFrom?: string[]  // ids of source orbs if this was fused
}

export interface FusionLog {
  id: string
  sourceIds: string[]
  resultId: string
  createdAt: number
}

const KEY_CAPSULES = 'puni_capsules_v2'
const KEY_FUSIONS = 'puni_fusions'
const KEY_LAST_SEEN = 'puni_last_seen'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getCapsules(): Capsule[] {
  return read<Capsule[]>(KEY_CAPSULES, [])
}

export function saveCapsule(cap: Capsule): void {
  const list = getCapsules()
  list.unshift(cap)
  write(KEY_CAPSULES, list)
}

export function deleteCapsule(id: string): void {
  write(KEY_CAPSULES, getCapsules().filter(c => c.id !== id))
}

export function updateCapsule(id: string, patch: Partial<Capsule>): void {
  write(KEY_CAPSULES, getCapsules().map(c => c.id === id ? { ...c, ...patch } : c))
}

export function getFusions(): FusionLog[] {
  return read<FusionLog[]>(KEY_FUSIONS, [])
}

export function saveFusion(log: FusionLog): void {
  const list = getFusions()
  list.unshift(log)
  write(KEY_FUSIONS, list)
}

// Auto-open time capsules whose openAt has passed
export function resolveTimeCapsules(): string[] {
  const now = Date.now()
  const opened: string[] = []
  const updated = getCapsules().map(c => {
    if (!c.opened && c.openAt && c.openAt <= now) {
      opened.push(c.id)
      return { ...c, opened: true }
    }
    return c
  })
  if (opened.length) write(KEY_CAPSULES, updated)
  return opened
}

// Statistics helpers
export interface Stats {
  total: number
  streak: number
  byEmotion: Record<string, number>
  byRarity: Record<string, number>
  recentDays: string[]  // ISO date strings with activity
}

export function computeStats(): Stats {
  const caps = getCapsules().filter(c => c.opened)
  const byEmotion: Record<string, number> = {}
  const byRarity: Record<string, number> = {}
  const daySet = new Set<string>()

  for (const c of caps) {
    byEmotion[c.emotion] = (byEmotion[c.emotion] || 0) + 1
    byRarity[c.rarity] = (byRarity[c.rarity] || 0) + 1
    daySet.add(new Date(c.createdAt).toISOString().slice(0, 10))
  }

  // Calculate streak
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (daySet.has(key)) {
      streak++
    } else if (i > 0) {
      break
    }
  }

  return { total: caps.length, streak, byEmotion, byRarity, recentDays: [...daySet] }
}

// Export / Import
export function exportData(): string {
  return JSON.stringify({
    version: 2,
    exportedAt: new Date().toISOString(),
    capsules: getCapsules(),
    fusions: getFusions()
  }, null, 2)
}

export function importData(json: string): { count: number } {
  const data = JSON.parse(json) as { capsules?: Capsule[]; fusions?: FusionLog[] }
  if (!data.capsules || !Array.isArray(data.capsules)) throw new Error('Invalid format')

  const existing = getCapsules()
  const existingIds = new Set(existing.map(c => c.id))
  const newOnes = data.capsules.filter(c => !existingIds.has(c.id))
  const merged = [...newOnes, ...existing].sort((a, b) => b.createdAt - a.createdAt)
  write(KEY_CAPSULES, merged)

  if (data.fusions && Array.isArray(data.fusions)) {
    const ef = getFusions()
    const efIds = new Set(ef.map(f => f.id))
    const newF = data.fusions.filter(f => !efIds.has(f.id))
    write(KEY_FUSIONS, [...newF, ...ef])
  }

  return { count: newOnes.length }
}

// "On This Day" - find capsules from exactly 1 week / 1 month / 1 year ago (±1 day)
export function getOnThisDay(): { label: string; capsule: Capsule }[] {
  const now = Date.now()
  const caps = getCapsules().filter(c => c.opened)
  const found: { label: string; capsule: Capsule }[] = []
  const windows = [
    { label: '1週間前', ms: 7 * 86400000 },
    { label: '1ヶ月前', ms: 30 * 86400000 },
    { label: '半年前', ms: 183 * 86400000 },
    { label: '1年前', ms: 365 * 86400000 },
    { label: '2年前', ms: 730 * 86400000 },
  ]
  for (const { label, ms } of windows) {
    const target = now - ms
    const match = caps.find(c => Math.abs(c.createdAt - target) < 86400000 * 2)
    if (match) found.push({ label, capsule: match })
  }
  return found
}

export function getLastSeen(): number {
  return read<number>(KEY_LAST_SEEN, 0)
}

export function setLastSeen(): void {
  write(KEY_LAST_SEEN, Date.now())
}
