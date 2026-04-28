// ユーティリティ
export function generateId(prefix = ''): string {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 10)
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`
}

// 短いシェアID (8文字)
export function generateShareId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

// SHA-256 ハッシュ (Web Crypto API)
export async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// HTMLエスケープ（XSS対策）
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 入力サニタイズ
export function sanitizeText(s: string, max = 2000): string {
  return s
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    .slice(0, max)
    .trim()
}

// 入力検証
export function validateText(text: string, min = 1, max = 2000): { ok: boolean; error?: string } {
  if (!text || typeof text !== 'string') return { ok: false, error: 'テキストが入力されていません' }
  const trimmed = text.trim()
  if (trimmed.length < min) return { ok: false, error: `${min}文字以上入力してください` }
  if (trimmed.length > max) return { ok: false, error: `${max}文字以内で入力してください` }
  return { ok: true }
}

// IP取得 (Cloudflare)
export function getClientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip') 
    || req.headers.get('x-forwarded-for')?.split(',')[0]
    || 'unknown'
}

// レート制限チェック
export async function checkRateLimit(
  db: D1Database,
  key: string,
  limit: number,
  windowSec: number
): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  const now = Math.floor(Date.now() / 1000)
  const resetAt = now + windowSec

  // 既存レコード取得
  const row = await db.prepare('SELECT count, reset_at FROM rate_limits WHERE key = ?')
    .bind(key)
    .first<{ count: number; reset_at: number }>()

  if (!row || row.reset_at < now) {
    // 新規 or リセット
    await db.prepare(
      'INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count=1, reset_at=?'
    ).bind(key, resetAt, resetAt).run()
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (row.count >= limit) {
    return { ok: false, remaining: 0, resetAt: row.reset_at }
  }

  await db.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?')
    .bind(key)
    .run()

  return { ok: true, remaining: limit - row.count - 1, resetAt: row.reset_at }
}

// 日付フォーマット
export function formatDate(ts: number, locale = 'ja-JP'): string {
  return new Date(ts).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(ts: number, locale = 'ja-JP'): string {
  return new Date(ts).toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
