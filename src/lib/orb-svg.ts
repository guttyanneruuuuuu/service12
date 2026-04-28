// ぷにぷにオーブのSVG生成
import type { EmotionType } from './emotion'
import { EMOTION_EMOJIS, EMOTION_LABELS } from './emotion'
import { escapeHtml } from './utils'

export interface OrbSvgOptions {
  color: string
  color2: string
  pattern: string
  size?: number
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  emotion?: EmotionType
  animated?: boolean
}

export function renderOrbSvg(opts: OrbSvgOptions): string {
  const size = opts.size ?? 200
  const id = Math.random().toString(36).slice(2, 8)
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.42

  const rarityGlow = {
    common: '0',
    rare: '6',
    epic: '12',
    legendary: '20'
  }[opts.rarity ?? 'common']

  let patternDefs = ''
  let patternFill = ''

  switch (opts.pattern) {
    case 'nebula':
      patternDefs = `
        <radialGradient id="g${id}" cx="35%" cy="30%">
          <stop offset="0%" stop-color="${opts.color2}" stop-opacity="1"/>
          <stop offset="50%" stop-color="${opts.color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${opts.color}" stop-opacity="0.7"/>
        </radialGradient>
        <filter id="blur${id}"><feGaussianBlur stdDeviation="2"/></filter>`
      patternFill = `url(#g${id})`
      break
    case 'marble':
      patternDefs = `
        <linearGradient id="g${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${opts.color}"/>
          <stop offset="50%" stop-color="${opts.color2}"/>
          <stop offset="100%" stop-color="${opts.color}"/>
        </linearGradient>`
      patternFill = `url(#g${id})`
      break
    case 'glow':
      patternDefs = `
        <radialGradient id="g${id}" cx="50%" cy="50%">
          <stop offset="0%" stop-color="${opts.color2}" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="${opts.color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${opts.color}" stop-opacity="0.6"/>
        </radialGradient>`
      patternFill = `url(#g${id})`
      break
    case 'sparkle':
      patternDefs = `
        <radialGradient id="g${id}" cx="40%" cy="35%">
          <stop offset="0%" stop-color="white" stop-opacity="0.95"/>
          <stop offset="20%" stop-color="${opts.color2}"/>
          <stop offset="100%" stop-color="${opts.color}"/>
        </radialGradient>`
      patternFill = `url(#g${id})`
      break
    case 'ripple':
      patternDefs = `
        <radialGradient id="g${id}" cx="50%" cy="50%">
          <stop offset="0%" stop-color="${opts.color}"/>
          <stop offset="40%" stop-color="${opts.color2}" stop-opacity="0.7"/>
          <stop offset="80%" stop-color="${opts.color}"/>
          <stop offset="100%" stop-color="${opts.color2}" stop-opacity="0.6"/>
        </radialGradient>`
      patternFill = `url(#g${id})`
      break
    default:
      patternFill = opts.color
  }

  // ハイライト（ぷにぷに感）
  const highlightR = r * 0.35
  const highlightX = cx - r * 0.3
  const highlightY = cy - r * 0.35

  // sparkle時の星
  let sparkles = ''
  if (opts.pattern === 'sparkle' || opts.rarity === 'legendary') {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      const dist = r * (0.7 + Math.random() * 0.4)
      const sx = cx + Math.cos(angle) * dist
      const sy = cy + Math.sin(angle) * dist
      const ssize = 2 + Math.random() * 3
      sparkles += `<circle cx="${sx}" cy="${sy}" r="${ssize}" fill="white" opacity="${0.6 + Math.random() * 0.4}"/>`
    }
  }

  // アニメーション（ぷにぷに揺れ）
  const anim = opts.animated !== false ? `
    <animateTransform attributeName="transform" attributeType="XML" type="scale"
      values="1,1; 1.04,0.96; 0.97,1.03; 1,1" dur="3s" repeatCount="indefinite"
      additive="sum"/>` : ''

  // レジェンダリーは光のリング
  let legendaryRing = ''
  if (opts.rarity === 'legendary') {
    legendaryRing = `
      <circle cx="${cx}" cy="${cy}" r="${r * 1.15}" fill="none" stroke="gold" stroke-width="1.5" opacity="0.8">
        ${opts.animated !== false ? `<animate attributeName="r" values="${r * 1.15};${r * 1.25};${r * 1.15}" dur="2s" repeatCount="indefinite"/>` : ''}
      </circle>`
  } else if (opts.rarity === 'epic') {
    legendaryRing = `<circle cx="${cx}" cy="${cy}" r="${r * 1.1}" fill="none" stroke="${opts.color2}" stroke-width="1" opacity="0.6"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <defs>
      ${patternDefs}
      <filter id="shadow${id}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${rarityGlow}"/>
        <feOffset dx="0" dy="2"/>
        <feFlood flood-color="${opts.color2}" flood-opacity="0.7"/>
        <feComposite in2="SourceAlpha" operator="in"/>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${legendaryRing}
    <g filter="url(#shadow${id})" transform-origin="${cx} ${cy}">
      ${anim ? `<g>${anim}` : ''}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${patternFill}"/>
      <ellipse cx="${highlightX}" cy="${highlightY}" rx="${highlightR}" ry="${highlightR * 0.6}" fill="white" opacity="0.55"/>
      <ellipse cx="${highlightX + 3}" cy="${highlightY + 3}" rx="${highlightR * 0.5}" ry="${highlightR * 0.3}" fill="white" opacity="0.35"/>
      ${sparkles}
      ${anim ? `</g>` : ''}
    </g>
  </svg>`
}

// OGP画像 (1200x630)
export function renderOgpSvg(args: {
  title: string
  emotion: EmotionType
  color: string
  color2: string
  pattern: string
  rarity: string
  date?: string
}): string {
  const { title, emotion, color, color2, pattern, rarity, date } = args
  const orbSvg = renderOrbSvg({ color, color2, pattern, size: 360, rarity: rarity as any, animated: false, emotion })
  // SVG内にSVGをネストするためルート要素を取り除く
  const orbInner = orbSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')

  const safeTitle = escapeHtml(title.length > 30 ? title.slice(0, 28) + '…' : title)
  const emoji = EMOTION_EMOJIS[emotion]
  const label = EMOTION_LABELS[emotion]
  const rarityLabel = { common: 'コモン', rare: 'レア', epic: 'エピック', legendary: 'レジェンダリー' }[rarity] || ''
  const safeDate = escapeHtml(date || '')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFE5F1"/>
        <stop offset="50%" stop-color="#E5F1FF"/>
        <stop offset="100%" stop-color="#F1E5FF"/>
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="40"/></filter>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="200" cy="100" r="180" fill="${color}" opacity="0.15" filter="url(#soft)"/>
    <circle cx="1050" cy="500" r="220" fill="${color2}" opacity="0.18" filter="url(#soft)"/>
    
    <g transform="translate(120, 135)">
      ${orbInner}
    </g>
    
    <g transform="translate(540, 180)">
      <text x="0" y="0" font-family="'Hiragino Sans','Yu Gothic',sans-serif" font-size="32" fill="#8B7AB8" font-weight="600">PuniMemory ぷにメモリー</text>
      <text x="0" y="80" font-family="'Hiragino Sans','Yu Gothic',sans-serif" font-size="56" fill="#3D2B5C" font-weight="800">${safeTitle}</text>
      <g transform="translate(0, 130)">
        <rect x="0" y="0" rx="28" ry="28" width="200" height="56" fill="${color}" opacity="0.85"/>
        <text x="100" y="38" text-anchor="middle" font-family="'Hiragino Sans',sans-serif" font-size="26" fill="white" font-weight="700">${emoji} ${label}</text>
        <rect x="220" y="0" rx="28" ry="28" width="220" height="56" fill="white" stroke="${color2}" stroke-width="3"/>
        <text x="330" y="38" text-anchor="middle" font-family="'Hiragino Sans',sans-serif" font-size="24" fill="${color2}" font-weight="700">${rarityLabel}</text>
      </g>
      <text x="0" y="260" font-family="'Hiragino Sans',sans-serif" font-size="26" fill="#6B5B95">${safeDate}</text>
      <text x="0" y="310" font-family="'Hiragino Sans',sans-serif" font-size="22" fill="#8B7AB8">あなたのオーブをコレクションしよう</text>
    </g>
  </svg>`
}
