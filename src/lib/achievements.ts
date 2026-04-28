// Achievement / Badge system

import type { Capsule } from './storage'
import { getCapsules, getFusions } from './storage'

export interface Achievement {
  id: string
  emoji: string
  title: string
  desc: string
  unlocked: boolean
  unlockedAt?: number
}

const KEY_ACHIEVEMENTS = 'puni_achievements'

function readUnlocked(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY_ACHIEVEMENTS)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveUnlocked(map: Record<string, number>): void {
  localStorage.setItem(KEY_ACHIEVEMENTS, JSON.stringify(map))
}

const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_orb',     emoji: '🪄', title: 'はじめてのオーブ',   desc: '初めてオーブを生成した' },
  { id: 'orb_10',        emoji: '💫', title: '10個のオーブ',       desc: '10個のオーブを集めた' },
  { id: 'orb_50',        emoji: '🌟', title: '50個のオーブ',       desc: '50個のオーブを集めた' },
  { id: 'orb_100',       emoji: '✨', title: '100個のオーブ',      desc: '100個のオーブを集めた' },
  { id: 'streak_3',      emoji: '🔥', title: '3日連続',           desc: '3日連続でオーブを作った' },
  { id: 'streak_7',      emoji: '🌈', title: '7日連続',           desc: '1週間毎日記録した' },
  { id: 'streak_30',     emoji: '🏆', title: '30日連続',          desc: 'すごい！1ヶ月連続記録' },
  { id: 'got_rare',      emoji: '💎', title: 'レアゲット！',       desc: 'レアオーブを入手した' },
  { id: 'got_epic',      emoji: '💜', title: 'エピックゲット！',   desc: 'エピックオーブを入手した' },
  { id: 'got_legendary', emoji: '👑', title: '伝説のオーブ！',     desc: 'レジェンダリーオーブを入手した' },
  { id: 'all_emotions',  emoji: '🌸', title: '七色の感情',         desc: '7種類すべての感情でオーブを作った' },
  { id: 'timecapsule',   emoji: '⏳', title: 'タイムカプセル',     desc: '初めてタイムカプセルを作った' },
  { id: 'fusion',        emoji: '🔮', title: '初フュージョン',     desc: 'オーブフュージョンを初体験した' },
  { id: 'fusion_5',      emoji: '🌀', title: 'フュージョン5回',   desc: 'フュージョンを5回実行した' },
  { id: 'export',        emoji: '📦', title: 'データの守護者',     desc: 'データをエクスポートした' },
  { id: 'long_entry',    emoji: '📝', title: 'ながーい日記',       desc: '500文字以上の日記を書いた' },
  { id: 'night_owl',     emoji: '🦉', title: 'ナイトオウル',      desc: '深夜0〜4時に記録した' },
  { id: 'early_bird',    emoji: '🐤', title: 'アーリーバード',    desc: '朝5〜7時に記録した' },
]

export function getAllAchievements(): Achievement[] {
  const unlocked = readUnlocked()
  return ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    unlocked: def.id in unlocked,
    unlockedAt: unlocked[def.id]
  }))
}

// Returns list of newly unlocked achievement IDs
export function checkAndUnlockAchievements(newCapsule?: Capsule): string[] {
  const caps = getCapsules()
  const fusions = getFusions()
  const unlocked = readUnlocked()
  const newlyUnlocked: string[] = []

  function tryUnlock(id: string) {
    if (!(id in unlocked)) {
      unlocked[id] = Date.now()
      newlyUnlocked.push(id)
    }
  }

  // Count
  const total = caps.length
  if (total >= 1) tryUnlock('first_orb')
  if (total >= 10) tryUnlock('orb_10')
  if (total >= 50) tryUnlock('orb_50')
  if (total >= 100) tryUnlock('orb_100')

  // Streak
  const daySet = new Set(caps.map(c => new Date(c.createdAt).toISOString().slice(0, 10)))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (daySet.has(d.toISOString().slice(0, 10))) streak++
    else if (i > 0) break
  }
  if (streak >= 3) tryUnlock('streak_3')
  if (streak >= 7) tryUnlock('streak_7')
  if (streak >= 30) tryUnlock('streak_30')

  // Rarity
  const rarities = new Set(caps.map(c => c.rarity))
  if (rarities.has('rare')) tryUnlock('got_rare')
  if (rarities.has('epic')) tryUnlock('got_epic')
  if (rarities.has('legendary')) tryUnlock('got_legendary')

  // All emotions
  const emotions = new Set(caps.map(c => c.emotion))
  if (emotions.size >= 7) tryUnlock('all_emotions')

  // Time capsule
  if (caps.some(c => c.openAt !== null)) tryUnlock('timecapsule')

  // Fusion
  if (fusions.length >= 1) tryUnlock('fusion')
  if (fusions.length >= 5) tryUnlock('fusion_5')

  // Long entry
  if (newCapsule && newCapsule.content.length >= 500) tryUnlock('long_entry')
  if (caps.some(c => c.content.length >= 500)) tryUnlock('long_entry')

  // Night owl / early bird
  if (newCapsule) {
    const h = new Date(newCapsule.createdAt).getHours()
    if (h >= 0 && h < 4) tryUnlock('night_owl')
    if (h >= 5 && h < 8) tryUnlock('early_bird')
  }

  if (newlyUnlocked.length) saveUnlocked(unlocked)
  return newlyUnlocked
}

export function unlockExportAchievement(): string[] {
  const unlocked = readUnlocked()
  if (!('export' in unlocked)) {
    unlocked['export'] = Date.now()
    saveUnlocked(unlocked)
    return ['export']
  }
  return []
}

export function getAchievementById(id: string): Achievement | undefined {
  const all = getAllAchievements()
  return all.find(a => a.id === id)
}
