import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { logger } from 'hono/logger'
import { getCookie, setCookie } from 'hono/cookie'

import { analyzeEmotion, generateOrb, EMOTION_LABELS, EMOTION_EMOJIS } from './lib/emotion'
import type { EmotionType } from './lib/emotion'
import { renderOrbSvg, renderOgpSvg } from './lib/orb-svg'
import {
  generateId, generateShareId, sha256,
  sanitizeText, validateText, getClientIp,
  checkRateLimit, formatDate, formatDateTime, escapeHtml
} from './lib/utils'

import { renderApp } from './components/app'
import { renderShare } from './components/share'

type Env = { DB: D1Database }
const app = new Hono<{ Bindings: Env }>()

// === セキュリティヘッダ ===
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  },
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    interestCohort: []
  }
}))

// 同一オリジンのみ許可（credentialsCookie送信のため）
app.use('/api/*', cors({
  origin: (origin) => origin || '',
  credentials: true,
  maxAge: 600
}))

app.use('*', logger())

// === 匿名ユーザー作成・取得ミドルウェア ===
async function getOrCreateUser(c: any): Promise<string> {
  let uid = getCookie(c, 'puni_uid')
  if (!uid) {
    uid = generateId('u')
    setCookie(c, 'puni_uid', uid, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 390,
      path: '/'
    })
    const now = Date.now()
    await c.env.DB.prepare(
      'INSERT OR IGNORE INTO users (id, created_at, last_active_at) VALUES (?, ?, ?)'
    ).bind(uid, now, now).run()
  } else {
    await c.env.DB.prepare('UPDATE users SET last_active_at = ? WHERE id = ?')
      .bind(Date.now(), uid).run()
  }
  return uid
}

// === アナリティクス記録 ===
async function trackEvent(c: any, eventType: string, payload?: any) {
  try {
    const ip = getClientIp(c.req.raw)
    const ua = c.req.header('user-agent') || ''
    const ref = c.req.header('referer') || ''
    const ipHash = await sha256(ip + 'puni-salt-2025')
    const uid = getCookie(c, 'puni_uid') || null
    await c.env.DB.prepare(
      'INSERT INTO analytics_events (id, user_id, event_type, payload, ip_hash, user_agent, referrer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      generateId('e'),
      uid,
      eventType,
      payload ? JSON.stringify(payload).slice(0, 1000) : null,
      ipHash.slice(0, 16),
      ua.slice(0, 200),
      ref.slice(0, 200),
      Date.now()
    ).run()
  } catch (e) {
    console.error('analytics error', e)
  }
}

// =============================
// API ルート
// =============================

// ヘルスチェック
app.get('/api/health', (c) => c.json({ ok: true, ts: Date.now() }))

// カプセル作成
app.post('/api/capsules', async (c) => {
  try {
    const uid = await getOrCreateUser(c)
    const ip = getClientIp(c.req.raw)
    const ipHash = await sha256(ip + 'rl-salt')

    // レート制限: 1時間に20カプセルまで
    const rl = await checkRateLimit(c.env.DB, `cap:${ipHash.slice(0, 16)}`, 20, 3600)
    if (!rl.ok) {
      return c.json({ error: 'たくさん作りすぎだよ！少し休もう🍵', resetAt: rl.resetAt }, 429)
    }

    const body = await c.req.json<{
      title?: string
      content?: string
      openAt?: number | null
      isPublic?: boolean
    }>()

    const title = sanitizeText(body.title || '', 60)
    const content = sanitizeText(body.content || '', 2000)

    const titleCheck = validateText(title, 1, 60)
    if (!titleCheck.ok) return c.json({ error: titleCheck.error }, 400)

    const contentCheck = validateText(content, 5, 2000)
    if (!contentCheck.ok) return c.json({ error: contentCheck.error }, 400)

    // 感情解析
    const emo = analyzeEmotion(content)
    const orb = generateOrb(content, emo)

    const id = generateId('c')
    const shareId = generateShareId()
    const now = Date.now()
    const openAt = body.openAt && body.openAt > now ? Math.min(body.openAt, now + 1000 * 60 * 60 * 24 * 365 * 5) : null
    const isPublic = body.isPublic ? 1 : 0

    await c.env.DB.prepare(
      `INSERT INTO capsules (id, user_id, title, content, emotion, emotion_score, orb_color, orb_color_2, orb_pattern, orb_size, rarity, share_id, is_public, open_at, opened, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      id, uid, title, content,
      emo.emotion, emo.score,
      orb.color, orb.color2, orb.pattern, orb.size, orb.rarity,
      shareId, isPublic, openAt, openAt ? 0 : 1, now
    ).run()

    await c.env.DB.prepare(
      'UPDATE users SET total_capsules = total_capsules + 1, total_orbs = total_orbs + 1 WHERE id = ?'
    ).bind(uid).run()

    await trackEvent(c, 'capsule_created', {
      emotion: emo.emotion,
      rarity: orb.rarity,
      hasOpenAt: !!openAt,
      isPublic: !!isPublic,
      length: content.length
    })

    return c.json({
      id, shareId,
      title, content,
      emotion: emo.emotion,
      emotionLabel: EMOTION_LABELS[emo.emotion],
      emotionEmoji: EMOTION_EMOJIS[emo.emotion],
      score: emo.score,
      intensity: emo.intensity,
      orb,
      openAt,
      opened: openAt ? false : true,
      isPublic: !!isPublic,
      createdAt: now,
      shareUrl: `/c/${shareId}`
    })
  } catch (e: any) {
    console.error('create capsule error', e)
    return c.json({ error: 'カプセル生成に失敗したよ。もう一度試してね。' }, 500)
  }
})

// 自分のカプセル一覧
app.get('/api/capsules', async (c) => {
  const uid = await getOrCreateUser(c)
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100)
  const offset = Math.max(parseInt(c.req.query('offset') || '0'), 0)

  const { results } = await c.env.DB.prepare(
    `SELECT id, title, content, emotion, emotion_score, orb_color, orb_color_2, orb_pattern, orb_size, rarity, share_id, is_public, open_at, opened, created_at
     FROM capsules WHERE user_id = ?
     ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(uid, limit, offset).all()

  // 開封タイミングが来たカプセルは自動的に open
  const now = Date.now()
  const toOpen: string[] = []
  const items = (results || []).map((r: any) => {
    let opened = !!r.opened
    if (!opened && r.open_at && r.open_at <= now) {
      opened = true
      toOpen.push(r.id)
    }
    return {
      id: r.id,
      title: r.title,
      content: opened ? r.content : null,
      emotion: r.emotion,
      emotionLabel: EMOTION_LABELS[r.emotion as EmotionType],
      emotionEmoji: EMOTION_EMOJIS[r.emotion as EmotionType],
      score: r.emotion_score,
      orb: {
        color: r.orb_color,
        color2: r.orb_color_2,
        pattern: r.orb_pattern,
        size: r.orb_size,
        rarity: r.rarity
      },
      shareId: r.share_id,
      isPublic: !!r.is_public,
      openAt: r.open_at,
      opened,
      createdAt: r.created_at
    }
  })

  if (toOpen.length) {
    const placeholders = toOpen.map(() => '?').join(',')
    await c.env.DB.prepare(`UPDATE capsules SET opened = 1 WHERE id IN (${placeholders})`)
      .bind(...toOpen).run()
  }

  return c.json({ items, count: items.length })
})

// 統計
app.get('/api/stats', async (c) => {
  const uid = await getOrCreateUser(c)
  const total = await c.env.DB.prepare('SELECT COUNT(*) as n FROM capsules WHERE user_id = ?').bind(uid).first<{ n: number }>()
  const byEmotion = await c.env.DB.prepare(
    'SELECT emotion, COUNT(*) as n FROM capsules WHERE user_id = ? GROUP BY emotion'
  ).bind(uid).all<{ emotion: string; n: number }>()
  const byRarity = await c.env.DB.prepare(
    'SELECT rarity, COUNT(*) as n FROM capsules WHERE user_id = ? GROUP BY rarity'
  ).bind(uid).all<{ rarity: string; n: number }>()
  const recent = await c.env.DB.prepare(
    "SELECT created_at FROM capsules WHERE user_id = ? AND created_at > ? ORDER BY created_at DESC"
  ).bind(uid, Date.now() - 1000 * 60 * 60 * 24 * 30).all<{ created_at: number }>()

  // ストリーク計算（連続日数）
  const days = new Set<string>()
  for (const r of recent.results || []) {
    days.add(new Date(r.created_at).toISOString().slice(0, 10))
  }
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 90; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (days.has(key)) streak++
    else if (i > 0) break
  }

  return c.json({
    total: total?.n || 0,
    byEmotion: Object.fromEntries((byEmotion.results || []).map(r => [r.emotion, r.n])),
    byRarity: Object.fromEntries((byRarity.results || []).map(r => [r.rarity, r.n])),
    streak
  })
})

// カプセル削除
app.delete('/api/capsules/:id', async (c) => {
  const uid = await getOrCreateUser(c)
  const id = c.req.param('id')
  const result = await c.env.DB.prepare('DELETE FROM capsules WHERE id = ? AND user_id = ?')
    .bind(id, uid).run()
  if (result.meta.changes === 0) return c.json({ error: 'not found' }, 404)
  await trackEvent(c, 'capsule_deleted', { id })
  return c.json({ ok: true })
})

// 公開設定変更
app.patch('/api/capsules/:id/public', async (c) => {
  const uid = await getOrCreateUser(c)
  const id = c.req.param('id')
  const { isPublic } = await c.req.json<{ isPublic: boolean }>()
  await c.env.DB.prepare('UPDATE capsules SET is_public = ? WHERE id = ? AND user_id = ?')
    .bind(isPublic ? 1 : 0, id, uid).run()
  return c.json({ ok: true })
})

// 公開ギャラリー (人気・新着)
app.get('/api/gallery', async (c) => {
  const tab = c.req.query('tab') || 'recent'
  const limit = Math.min(parseInt(c.req.query('limit') || '24'), 50)

  let sql = ''
  if (tab === 'popular') {
    sql = `
      SELECT c.share_id, c.title, c.emotion, c.orb_color, c.orb_color_2, c.orb_pattern, c.orb_size, c.rarity, c.created_at,
             (SELECT COUNT(*) FROM reactions WHERE capsule_id = c.id) AS reactions
      FROM capsules c
      WHERE c.is_public = 1 AND (c.opened = 1 OR c.open_at IS NULL OR c.open_at <= ?)
      ORDER BY reactions DESC, c.created_at DESC
      LIMIT ?`
  } else if (tab === 'rare') {
    sql = `
      SELECT share_id, title, emotion, orb_color, orb_color_2, orb_pattern, orb_size, rarity, created_at,
             (SELECT COUNT(*) FROM reactions WHERE capsule_id = capsules.id) AS reactions
      FROM capsules
      WHERE is_public = 1 AND (rarity = 'epic' OR rarity = 'legendary') AND (opened = 1 OR open_at IS NULL OR open_at <= ?)
      ORDER BY created_at DESC LIMIT ?`
  } else {
    sql = `
      SELECT share_id, title, emotion, orb_color, orb_color_2, orb_pattern, orb_size, rarity, created_at,
             (SELECT COUNT(*) FROM reactions WHERE capsule_id = capsules.id) AS reactions
      FROM capsules
      WHERE is_public = 1 AND (opened = 1 OR open_at IS NULL OR open_at <= ?)
      ORDER BY created_at DESC LIMIT ?`
  }

  const { results } = await c.env.DB.prepare(sql).bind(Date.now(), limit).all()
  return c.json({
    items: (results || []).map((r: any) => ({
      shareId: r.share_id,
      title: r.title,
      emotion: r.emotion,
      emotionEmoji: EMOTION_EMOJIS[r.emotion as EmotionType],
      orb: {
        color: r.orb_color,
        color2: r.orb_color_2,
        pattern: r.orb_pattern,
        size: r.orb_size,
        rarity: r.rarity
      },
      reactions: r.reactions || 0,
      createdAt: r.created_at
    }))
  })
})

// 日替わりお題
app.get('/api/daily-prompt', (c) => {
  const prompts = [
    '今日いちばんテンション上がった瞬間は？',
    '最近のちっちゃい幸せを教えて 🌱',
    '今、心がモヤモヤしてること、書き出してみよう',
    '5年後の自分にメッセージを送るなら？',
    '今日出会った"いいもの"を記録しよう ✨',
    '明日への一言を未来の自分へ',
    '今ハマっていることは？',
    '最近"ありがとう"を言いたい人は？',
    '心が落ち着くもの・場所は？',
    '今日の自分を褒めてあげよう 💖',
    '一番怖いものは？それでも頑張ってる？',
    '最近笑ったこと、思い出してみよう 😂',
    '今好きな人・物・推しを語って 🌟',
    '今日の体調・気分を一言で',
    '今この瞬間に感謝したいこと'
  ]
  // 日替わり
  const today = new Date()
  const dayKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const idx = dayKey % prompts.length
  return c.json({
    prompt: prompts[idx],
    date: today.toISOString().slice(0, 10)
  })
})

// シェア用カプセル取得
app.get('/api/share/:shareId', async (c) => {
  const shareId = c.req.param('shareId')
  const row = await c.env.DB.prepare(
    `SELECT id, title, content, emotion, emotion_score, orb_color, orb_color_2, orb_pattern, orb_size, rarity, is_public, open_at, opened, created_at
     FROM capsules WHERE share_id = ?`
  ).bind(shareId).first<any>()

  if (!row) return c.json({ error: 'not found' }, 404)

  const now = Date.now()
  const opened = !!row.opened || (row.open_at && row.open_at <= now)

  return c.json({
    title: row.title,
    content: opened ? row.content : null,
    emotion: row.emotion,
    emotionLabel: EMOTION_LABELS[row.emotion as EmotionType],
    emotionEmoji: EMOTION_EMOJIS[row.emotion as EmotionType],
    score: row.emotion_score,
    orb: {
      color: row.orb_color,
      color2: row.orb_color_2,
      pattern: row.orb_pattern,
      size: row.orb_size,
      rarity: row.rarity
    },
    isPublic: !!row.is_public,
    openAt: row.open_at,
    opened,
    createdAt: row.created_at
  })
})

// リアクション
app.post('/api/share/:shareId/react', async (c) => {
  const shareId = c.req.param('shareId')
  const { reaction } = await c.req.json<{ reaction: string }>()
  const allowed = ['love','sparkle','calm','wow']
  if (!allowed.includes(reaction)) return c.json({ error: 'invalid' }, 400)

  const ip = getClientIp(c.req.raw)
  const ipHash = await sha256(ip + 'react')
  const rl = await checkRateLimit(c.env.DB, `react:${ipHash.slice(0,16)}:${shareId}`, 10, 3600)
  if (!rl.ok) return c.json({ error: 'もう少し待ってね' }, 429)

  const cap = await c.env.DB.prepare('SELECT id FROM capsules WHERE share_id = ?').bind(shareId).first<{ id: string }>()
  if (!cap) return c.json({ error: 'not found' }, 404)

  await c.env.DB.prepare(
    'INSERT INTO reactions (id, capsule_id, user_id, reaction, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(generateId('r'), cap.id, getCookie(c, 'puni_uid') || null, reaction, Date.now()).run()
  await trackEvent(c, 'reaction_added', { reaction, shareId })
  return c.json({ ok: true })
})

// リアクション数取得
app.get('/api/share/:shareId/reactions', async (c) => {
  const shareId = c.req.param('shareId')
  const cap = await c.env.DB.prepare('SELECT id FROM capsules WHERE share_id = ?').bind(shareId).first<{ id: string }>()
  if (!cap) return c.json({ error: 'not found' }, 404)
  const { results } = await c.env.DB.prepare(
    'SELECT reaction, COUNT(*) as n FROM reactions WHERE capsule_id = ? GROUP BY reaction'
  ).bind(cap.id).all<{ reaction: string; n: number }>()
  return c.json({ reactions: Object.fromEntries((results || []).map(r => [r.reaction, r.n])) })
})

// アナリティクスイベント受信（フロント計測）
app.post('/api/analytics', async (c) => {
  try {
    const body = await c.req.json<{ event: string; payload?: any }>()
    if (!body.event || typeof body.event !== 'string' || body.event.length > 50) {
      return c.json({ ok: false }, 400)
    }
    await trackEvent(c, body.event, body.payload)
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false }, 400)
  }
})

// =============================
// SVG レンダリング
// =============================

// オーブSVG
app.get('/orb/:filename{.+\\.svg}', async (c) => {
  const shareId = c.req.param('filename').replace(/\.svg$/, '')
  const row = await c.env.DB.prepare(
    'SELECT orb_color, orb_color_2, orb_pattern, orb_size, rarity, emotion FROM capsules WHERE share_id = ?'
  ).bind(shareId).first<any>()
  if (!row) return c.text('not found', 404)
  const svg = renderOrbSvg({
    color: row.orb_color,
    color2: row.orb_color_2,
    pattern: row.orb_pattern,
    size: 400,
    rarity: row.rarity,
    emotion: row.emotion
  })
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
})

// OGP画像
app.get('/og/:filename{.+\\.svg}', async (c) => {
  const shareId = c.req.param('filename').replace(/\.svg$/, '')
  const row = await c.env.DB.prepare(
    'SELECT title, emotion, orb_color, orb_color_2, orb_pattern, rarity, created_at FROM capsules WHERE share_id = ?'
  ).bind(shareId).first<any>()
  if (!row) return c.text('not found', 404)
  const svg = renderOgpSvg({
    title: row.title,
    emotion: row.emotion,
    color: row.orb_color,
    color2: row.orb_color_2,
    pattern: row.orb_pattern,
    rarity: row.rarity,
    date: formatDate(row.created_at)
  })
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
})

// =============================
// ページレンダリング
// =============================

// メインアプリ
app.get('/', async (c) => {
  await getOrCreateUser(c)
  await trackEvent(c, 'page_view', { page: 'home' })
  return c.html(renderApp())
})

// シェアページ
app.get('/c/:shareId', async (c) => {
  const shareId = c.req.param('shareId')
  const row = await c.env.DB.prepare(
    `SELECT title, content, emotion, orb_color, orb_color_2, orb_pattern, orb_size, rarity, is_public, open_at, opened, created_at
     FROM capsules WHERE share_id = ?`
  ).bind(shareId).first<any>()
  if (!row) {
    return c.html(renderApp({ error: 'カプセルが見つかりませんでした' }), 404)
  }
  await trackEvent(c, 'share_view', { shareId })
  return c.html(renderShare({
    shareId,
    title: row.title,
    content: row.content,
    emotion: row.emotion as EmotionType,
    color: row.orb_color,
    color2: row.orb_color_2,
    pattern: row.orb_pattern,
    rarity: row.rarity,
    openAt: row.open_at,
    opened: !!row.opened || (row.open_at && row.open_at <= Date.now()),
    isPublic: !!row.is_public,
    createdAt: row.created_at
  }))
})

// PWA Manifest
app.get('/manifest.json', (c) => {
  return c.json({
    name: 'ぷにメモリー',
    short_name: 'ぷにメモリー',
    description: 'あなたの"今"をAIが永久保存するぷにぷに思い出カプセル',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDF6FF',
    theme_color: '#FFD6E8',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
      { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
    ],
    categories: ['lifestyle', 'productivity', 'social']
  })
})

// PWA アイコン (192/512両方とも同じハンドラで処理)
const iconHandler = (c: any) => {
  const url = new URL(c.req.url)
  const m = url.pathname.match(/icon-(\d+)\.svg/)
  const size = m ? parseInt(m[1]) : 192
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <defs>
      <radialGradient id="g" cx="35%" cy="30%">
        <stop offset="0%" stop-color="#FFD6E8"/>
        <stop offset="50%" stop-color="#FF8FB1"/>
        <stop offset="100%" stop-color="#B69BFF"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#FDF6FF"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size * 0.36}" fill="url(#g)"/>
    <ellipse cx="${size * 0.4}" cy="${size * 0.38}" rx="${size * 0.12}" ry="${size * 0.07}" fill="white" opacity="0.6"/>
  </svg>`
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
  })
}
app.get('/icon-192.svg', iconHandler)
app.get('/icon-512.svg', iconHandler)

// デフォルトOGP（トップ用）
app.get('/og.svg', (c) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFE5F1"/><stop offset="50%" stop-color="#E5F1FF"/><stop offset="100%" stop-color="#F1E5FF"/>
      </linearGradient>
      <radialGradient id="orb1" cx="35%" cy="30%"><stop offset="0%" stop-color="#FFD6E8"/><stop offset="60%" stop-color="#FF8FB1"/><stop offset="100%" stop-color="#B69BFF"/></radialGradient>
      <radialGradient id="orb2" cx="35%" cy="30%"><stop offset="0%" stop-color="#C8E6FF"/><stop offset="60%" stop-color="#8AB8FF"/><stop offset="100%" stop-color="#B69BFF"/></radialGradient>
      <radialGradient id="orb3" cx="35%" cy="30%"><stop offset="0%" stop-color="#FFF1B8"/><stop offset="60%" stop-color="#FFD93D"/><stop offset="100%" stop-color="#FF8FB1"/></radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="220" cy="315" r="120" fill="url(#orb1)"/>
    <ellipse cx="195" cy="280" rx="38" ry="20" fill="white" opacity="0.55"/>
    <circle cx="980" cy="220" r="90" fill="url(#orb2)"/>
    <ellipse cx="960" cy="195" rx="28" ry="15" fill="white" opacity="0.55"/>
    <circle cx="1020" cy="450" r="80" fill="url(#orb3)"/>
    <ellipse cx="1000" cy="425" rx="24" ry="13" fill="white" opacity="0.55"/>
    <text x="600" y="280" text-anchor="middle" font-family="'Hiragino Sans','Yu Gothic',sans-serif" font-size="68" fill="#3D2B5C" font-weight="900">ぷにメモリー</text>
    <text x="600" y="350" text-anchor="middle" font-family="'Hiragino Sans',sans-serif" font-size="32" fill="#6B5B95" font-weight="600">あなたの"今"をぷにぷにオーブに ✨</text>
    <text x="600" y="420" text-anchor="middle" font-family="'Hiragino Sans',sans-serif" font-size="22" fill="#8B7AB8">AI感情解析 × タイムカプセル × オーブ図鑑</text>
  </svg>`
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  })
})

// PWA manifest
app.get('/manifest.json', (c) => {
  return c.json({
    name: 'ぷにメモリー',
    short_name: 'ぷにメモリー',
    description: 'AIがあなたの気持ちをぷにぷにオーブに変える',
    start_url: '/',
    display: 'standalone',
    theme_color: '#FFD6E8',
    background_color: '#FDF6FF',
    lang: 'ja',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/svg+xml' }
    ]
  })
})

// 簡易管理者統計（ADMIN_KEYでアクセス）
app.get('/api/admin/stats', async (c) => {
  const key = c.req.header('x-admin-key') || c.req.query('k') || ''
  // @ts-ignore
  const adminKey = c.env.ADMIN_KEY || 'puni-admin-2025-changeme'
  if (key !== adminKey) return c.json({ error: 'unauthorized' }, 401)

  const day = 1000 * 60 * 60 * 24
  const now = Date.now()

  const [users, capsules, today, week, byEvent, byEmotionTotal] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as n FROM users').first<{ n: number }>(),
    c.env.DB.prepare('SELECT COUNT(*) as n FROM capsules').first<{ n: number }>(),
    c.env.DB.prepare('SELECT COUNT(*) as n FROM capsules WHERE created_at > ?').bind(now - day).first<{ n: number }>(),
    c.env.DB.prepare('SELECT COUNT(*) as n FROM capsules WHERE created_at > ?').bind(now - day * 7).first<{ n: number }>(),
    c.env.DB.prepare('SELECT event_type, COUNT(*) as n FROM analytics_events WHERE created_at > ? GROUP BY event_type ORDER BY n DESC LIMIT 20').bind(now - day * 7).all<{ event_type: string; n: number }>(),
    c.env.DB.prepare('SELECT emotion, COUNT(*) as n FROM capsules GROUP BY emotion').all<{ emotion: string; n: number }>()
  ])

  return c.json({
    users: users?.n || 0,
    capsules: capsules?.n || 0,
    capsules_today: today?.n || 0,
    capsules_week: week?.n || 0,
    events_week: Object.fromEntries((byEvent.results || []).map(r => [r.event_type, r.n])),
    emotions: Object.fromEntries((byEmotionTotal.results || []).map(r => [r.emotion, r.n]))
  })
})

// 公開フィード（最新の公開カプセル）
app.get('/api/feed', async (c) => {
  const limit = Math.min(parseInt(c.req.query('limit') || '12'), 50)
  const { results } = await c.env.DB.prepare(
    `SELECT share_id, title, emotion, orb_color, orb_color_2, orb_pattern, orb_size, rarity, created_at
     FROM capsules WHERE is_public = 1 AND opened = 1
     ORDER BY created_at DESC LIMIT ?`
  ).bind(limit).all()
  const items = (results || []).map((r: any) => ({
    shareId: r.share_id,
    title: r.title,
    emotion: r.emotion,
    emotionEmoji: EMOTION_EMOJIS[r.emotion as EmotionType],
    orb: {
      color: r.orb_color,
      color2: r.orb_color_2,
      pattern: r.orb_pattern,
      size: r.orb_size,
      rarity: r.rarity
    },
    createdAt: r.created_at
  }))
  return c.json({ items })
})

// favicon (SVGをico代用)
app.get('/favicon.ico', (c) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><radialGradient id='g' cx='35%' cy='30%'><stop offset='0%' stop-color='%23FFD6E8'/><stop offset='100%' stop-color='%23FF8FB1'/></radialGradient></defs><circle cx='32' cy='32' r='26' fill='url(%23g)'/><ellipse cx='24' cy='22' rx='8' ry='5' fill='white' opacity='0.6'/></svg>`
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }
  })
})

// 静的: robots.txt
app.get('/robots.txt', (c) => {
  return c.text(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${new URL(c.req.url).origin}/sitemap.xml\n`)
})

app.get('/sitemap.xml', (c) => {
  const origin = new URL(c.req.url).origin
  return c.text(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${origin}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n</urlset>`, 200, {
    'Content-Type': 'application/xml'
  })
})

// 404
app.notFound((c) => {
  return c.html(renderApp({ error: 'ページが見つかりませんでした' }), 404)
})

app.onError((err, c) => {
  console.error('app error', err)
  return c.html(renderApp({ error: 'エラーが発生しました' }), 500)
})

export default app
