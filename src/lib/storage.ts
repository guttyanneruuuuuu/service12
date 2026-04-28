// localStorage-based storage layer (replaces Cloudflare D1)

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'
export type Attribute = '水' | '火' | '風' | '光' | '闇' | '星'

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
  attribute?: Attribute   // elemental attribute derived from emotion + date
  shareId: string
  openAt: number | null
  opened: boolean
  createdAt: number
  fusedFrom?: string[]    // ids of source orbs if this was fused
  giftedFrom?: string     // set if received as a gift URL
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
const KEY_UNLOCKS = 'puni_unlocks'
const KEY_DAILY_LOGIN = 'puni_daily_login'

// =====================
// Secret Code Registry
// =====================

export interface PremiumItem {
  code: string
  name: string
  type: 'skin' | 'bg'
  value: string   // CSS value (color, gradient, etc.)
  emoji: string
  desc: string
}

export const PREMIUM_ITEMS: PremiumItem[] = [
  { code: 'GALAXY2025',  name: 'ギャラクシースキン',   type: 'skin', value: 'radial-gradient(circle at 30% 25%,#0a0035,#1a0066 40%,#3d00b3 70%,#00f5d4)', emoji: '🌌', desc: '宇宙を纏うギャラクシーオーブ' },
  { code: 'NEONPINK',   name: 'ネオンピンクスキン',    type: 'skin', value: 'radial-gradient(circle at 30% 25%,#ff00aa,#ff69b4 50%,#ff1493)', emoji: '💗', desc: 'ネオンに輝くピンクオーブ' },
  { code: 'AURORA',     name: 'オーロラスキン',        type: 'skin', value: 'radial-gradient(circle at 30% 25%,#00c9ff,#92fe9d 50%,#ff6a00)', emoji: '🌈', desc: 'オーロラが揺れる幻想的なオーブ' },
  { code: 'SAKURA25',   name: '桜の間（背景）',         type: 'bg',   value: 'linear-gradient(160deg,#ffe4ec 0%,#ffd6e7 50%,#ffb3c6 100%)', emoji: '🌸', desc: '満開の桜に包まれた部屋' },
  { code: 'STARNIGHT',  name: '星夜の間（背景）',        type: 'bg',   value: 'linear-gradient(160deg,#0d0221 0%,#1a0551 50%,#0d1b5e 100%)', emoji: '🌠', desc: '星降る夜空の部屋' },
  { code: 'DEVTEST',    name: 'レインボースキン（テスト用）', type: 'skin', value: 'conic-gradient(from 0deg,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)', emoji: '🎨', desc: '開発者テスト用レインボースキン' },
]

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

// =====================
// Secret Code Unlocks
// =====================

export function getUnlockedCodes(): string[] {
  return read<string[]>(KEY_UNLOCKS, [])
}

export function redeemCode(code: string): PremiumItem | null {
  const normalized = code.trim().toUpperCase()
  const item = PREMIUM_ITEMS.find(i => i.code === normalized)
  if (!item) return null
  const existing = getUnlockedCodes()
  if (existing.includes(normalized)) return item  // already unlocked, return item anyway
  write(KEY_UNLOCKS, [...existing, normalized])
  return item
}

export function isCodeUnlocked(code: string): boolean {
  return getUnlockedCodes().includes(code.trim().toUpperCase())
}

export function getUnlockedItems(): PremiumItem[] {
  const codes = getUnlockedCodes()
  return PREMIUM_ITEMS.filter(i => codes.includes(i.code))
}

// =====================
// Daily Login Bonus
// =====================

export interface DailyLoginRecord {
  lastDate: string   // ISO date yyyy-mm-dd
  streak: number
}

export function getDailyLogin(): DailyLoginRecord {
  return read<DailyLoginRecord>(KEY_DAILY_LOGIN, { lastDate: '', streak: 0 })
}

export function checkAndRecordDailyLogin(): { isNew: boolean; streak: number } {
  const today = new Date().toISOString().slice(0, 10)
  const rec = getDailyLogin()
  if (rec.lastDate === today) return { isNew: false, streak: rec.streak }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newStreak = rec.lastDate === yesterday ? rec.streak + 1 : 1
  write(KEY_DAILY_LOGIN, { lastDate: today, streak: newStreak })
  return { isNew: true, streak: newStreak }
}
