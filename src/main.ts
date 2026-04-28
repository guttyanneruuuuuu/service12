/**
 * ぷにメモリー - Static SPA for GitHub Pages
 * 全データはlocalStorageに保存。サーバー不要。完全プライベート。
 */

import { analyzeEmotion, generateOrb, EMOTION_LABELS, EMOTION_EMOJIS } from './lib/emotion'
import { renderOrbSvg } from './lib/orb-svg'
import {
  getCapsules, saveCapsule, deleteCapsule, updateCapsule,
  resolveTimeCapsules, computeStats, exportData, importData,
  getOnThisDay, setLastSeen,
  type Capsule, type Rarity
} from './lib/storage'
import { saveFusion, getFusions } from './lib/storage'
import {
  checkAndUnlockAchievements, getAllAchievements, unlockExportAchievement,
  getAchievementById
} from './lib/achievements'

// =====================
// Utilities
// =====================

function generateId(prefix = ''): string {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 10)
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`
}

function generateShareId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

// =====================
// Toast System
// =====================

let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success', duration = 3500) {
  const root = document.getElementById('toast-root')!
  if (toastTimer) clearTimeout(toastTimer)
  root.innerHTML = `<div class="toast toast-${type}">${escapeHtml(msg)}</div>`
  root.style.display = 'block'
  toastTimer = setTimeout(() => { root.style.display = 'none'; root.innerHTML = '' }, duration)
}

// =====================
// Modal System
// =====================

function openModal(html: string) {
  const root = document.getElementById('modal-root')!
  document.getElementById('modal-body')!.innerHTML = html
  root.style.display = 'flex'
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  const root = document.getElementById('modal-root')!
  root.style.display = 'none'
  document.body.style.overflow = ''
}

// =====================
// Tab Navigation
// =====================

let currentTab = 'create'

function switchTab(tab: string) {
  currentTab = tab
  document.querySelectorAll('.puni-tab').forEach(el => el.classList.remove('puni-tab-active'))
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'))
  const tabEl = document.getElementById(`tab-${tab}`)
  if (tabEl) tabEl.classList.add('puni-tab-active')
  const navBtn = document.querySelector(`[data-tab="${tab}"]`)
  if (navBtn) navBtn.classList.add('active')

  // Lazy-render tabs
  if (tab === 'collection') renderCollection()
  if (tab === 'calendar') renderCalendar()
  if (tab === 'stats') renderStats()
}

// =====================
// Daily Prompts
// =====================

const DAILY_PROMPTS = [
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
  '今この瞬間に感謝したいこと',
  '最近チャレンジしたことは？',
  '忘れたくない今日の景色・瞬間は？',
  '今日の"なんとなく"を言葉にしてみよう',
  '誰かに伝えたいけど言えてないことは？',
  '今の自分に星は何個？その理由は？',
]

function getDailyPrompt(): string {
  const today = new Date()
  const key = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return DAILY_PROMPTS[key % DAILY_PROMPTS.length]
}

// =====================
// Orb Card HTML
// =====================

function orbCardHtml(cap: Capsule, options: { compact?: boolean; showContent?: boolean } = {}): string {
  const isLocked = !cap.opened
  const rLabel = { common: 'コモン', rare: 'レア', epic: 'エピック', legendary: 'レジェンダリー' }[cap.rarity]
  const emoLabel = EMOTION_LABELS[cap.emotion as keyof typeof EMOTION_LABELS] || cap.emotion
  const emoEmoji = EMOTION_EMOJIS[cap.emotion as keyof typeof EMOTION_EMOJIS] || '✨'

  const svg = isLocked
    ? `<div class="orb-locked-icon">🔒</div>`
    : renderOrbSvg({ color: cap.orbColor, color2: cap.orbColor2, pattern: cap.orbPattern, size: options.compact ? 80 : 100, rarity: cap.rarity })

  return `
  <div class="orb-card rarity-${cap.rarity}" data-id="${escapeHtml(cap.id)}">
    <div class="orb-card-svg">${svg}</div>
    <div class="orb-card-info">
      <div class="orb-rarity-badge badge-${cap.rarity}">${rLabel}</div>
      <div class="orb-title">${escapeHtml(cap.title)}</div>
      <div class="orb-emotion">${emoEmoji} ${emoLabel}</div>
      <div class="orb-date">${isLocked ? `⏳ ${formatDate(cap.openAt!)} に開封` : formatDate(cap.createdAt)}</div>
    </div>
  </div>`
}

// =====================
// CREATE TAB
// =====================

function setupCreateTab() {
  const titleEl = document.getElementById('capsule-title') as HTMLInputElement
  const contentEl = document.getElementById('capsule-content') as HTMLTextAreaElement
  const titleCounter = document.getElementById('title-counter')!
  const contentCounter = document.getElementById('content-counter')!
  const createBtn = document.getElementById('create-btn')!
  const resultArea = document.getElementById('result-area')!
  const tcToggle = document.getElementById('is-timecapsule') as HTMLInputElement
  const tcOptions = document.getElementById('timecapsule-options')!
  const openAtInput = document.getElementById('open-at-input') as HTMLInputElement
  const promptText = document.getElementById('daily-prompt-text')!
  const usePromptBtn = document.getElementById('use-prompt-btn')!

  // Show daily prompt
  promptText.textContent = getDailyPrompt()

  usePromptBtn.addEventListener('click', () => {
    contentEl.value = getDailyPrompt() + '\n\n'
    contentEl.focus()
    updateCounter()
  })

  titleEl.addEventListener('input', () => {
    titleCounter.textContent = `${titleEl.value.length} / 60`
  })

  contentEl.addEventListener('input', updateCounter)

  function updateCounter() {
    const len = contentEl.value.length
    contentCounter.textContent = `${len} / 2000`
    contentCounter.className = 'puni-counter' + (len > 1800 ? ' warn' : '')
  }

  // Time capsule toggle
  tcToggle.addEventListener('change', () => {
    tcOptions.style.display = tcToggle.checked ? 'block' : 'none'
  })

  // Quick date chips
  tcOptions.querySelectorAll('.puni-chip[data-days]').forEach(btn => {
    btn.addEventListener('click', () => {
      tcOptions.querySelectorAll('.puni-chip').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const days = (btn as HTMLElement).dataset.days
      if (days === 'custom') {
        openAtInput.style.display = 'block'
      } else {
        openAtInput.style.display = 'none'
        const d = new Date()
        d.setDate(d.getDate() + parseInt(days!))
        openAtInput.value = d.toISOString().slice(0, 16)
      }
    })
  })

  createBtn.addEventListener('click', async () => {
    const title = titleEl.value.trim()
    const content = contentEl.value.trim()

    if (!title) { showToast('タイトルを入力してね！', 'error'); return }
    if (content.length < 5) { showToast('5文字以上書いてね！', 'error'); return }
    if (content.length > 2000) { showToast('2000文字以内にしてね！', 'error'); return }

    // Time capsule
    let openAt: number | null = null
    if (tcToggle.checked) {
      if (openAtInput.value) {
        openAt = new Date(openAtInput.value).getTime()
        if (isNaN(openAt) || openAt <= Date.now()) {
          showToast('未来の日時を選んでね！', 'error'); return
        }
      } else {
        // Default: 1 week
        openAt = Date.now() + 7 * 86400000
      }
    }

    createBtn.setAttribute('disabled', 'true')
    const btnText = createBtn.querySelector('.puni-btn-text')!
    const btnSpinner = createBtn.querySelector('.puni-btn-spinner')!
    btnText.textContent = '生成中…'
    btnSpinner.setAttribute('style', 'display:inline-block')

    // Simulate a tiny delay for the animation effect
    await new Promise(r => setTimeout(r, 400))

    const emo = analyzeEmotion(content)
    const orb = generateOrb(content, emo)

    const id = generateId('c')
    const shareId = generateShareId()
    const now = Date.now()

    const capsule: Capsule = {
      id, title, content,
      emotion: emo.emotion,
      emotionScore: emo.score,
      intensity: emo.intensity,
      orbColor: orb.color,
      orbColor2: orb.color2,
      orbPattern: orb.pattern,
      orbSize: orb.size,
      rarity: orb.rarity,
      shareId,
      openAt,
      opened: !openAt,
      createdAt: now
    }

    saveCapsule(capsule)

    // Check achievements
    const newBadges = checkAndUnlockAchievements(capsule)

    createBtn.removeAttribute('disabled')
    btnText.textContent = 'オーブを生成する'
    btnSpinner.setAttribute('style', 'display:none')

    // Show result
    showResult(resultArea, capsule, emo, orb)
    resultArea.style.display = 'block'
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

    // Reset form
    titleEl.value = ''
    contentEl.value = ''
    titleCounter.textContent = '0 / 60'
    contentCounter.textContent = '0 / 2000'
    tcToggle.checked = false
    tcOptions.style.display = 'none'
    openAtInput.value = ''
    tcOptions.querySelectorAll('.puni-chip').forEach(b => b.classList.remove('active'))

    // Show badge notifications
    for (const badgeId of newBadges) {
      const ach = getAchievementById(badgeId)
      if (ach) {
        setTimeout(() => showToast(`🏅 実績解除！${ach.emoji} ${ach.title}`, 'info', 4000), 500)
      }
    }
  })
}

function showResult(container: HTMLElement, cap: Capsule, emo: any, orb: any) {
  const emoLabel = EMOTION_LABELS[emo.emotion as keyof typeof EMOTION_LABELS]
  const emoEmoji = EMOTION_EMOJIS[emo.emotion as keyof typeof EMOTION_EMOJIS]
  const rLabel = { common: 'コモン', rare: 'レア', epic: 'エピック', legendary: 'レジェンダリー' }[orb.rarity as Rarity]
  const svg = renderOrbSvg({ color: orb.color, color2: orb.color2, pattern: orb.pattern, size: 140, rarity: orb.rarity })

  const scoreBar = Math.round(emo.score * 100)
  const intensityBar = Math.round(emo.intensity * 100)

  const timecapsuleNote = cap.openAt
    ? `<div class="result-capsule-note">⏳ ${formatDate(cap.openAt)} に開封されます。それまでの楽しみに！</div>`
    : ''

  container.innerHTML = `
  <div class="result-card result-orb-appear">
    <div class="result-header">
      <span class="result-rarity badge-${orb.rarity}">${rLabel}</span>
      ${orb.rarity === 'legendary' ? '<span class="result-legendary-badge">✨ 伝説のオーブ！</span>' : ''}
      ${orb.rarity === 'epic' ? '<span class="result-epic-badge">💜 エピック！</span>' : ''}
    </div>
    <div class="result-orb-wrap">
      ${svg}
      <div class="result-emotion-pill">
        ${emoEmoji} ${emoLabel}
      </div>
    </div>
    <h3 class="result-title">${escapeHtml(cap.title)}</h3>
    ${timecapsuleNote}
    <div class="result-bars">
      <div class="result-bar-row">
        <span class="result-bar-label">感情の確信度</span>
        <div class="result-bar-track"><div class="result-bar-fill" style="width:${scoreBar}%;background:${orb.color}"></div></div>
        <span class="result-bar-val">${scoreBar}%</span>
      </div>
      <div class="result-bar-row">
        <span class="result-bar-label">感情の強さ</span>
        <div class="result-bar-track"><div class="result-bar-fill" style="width:${intensityBar}%;background:${orb.color2}"></div></div>
        <span class="result-bar-val">${intensityBar}%</span>
      </div>
    </div>
    <div class="result-actions">
      <button class="result-btn" id="result-share-btn">🔗 シェアする</button>
      <button class="result-btn secondary" id="result-collection-btn">🗂️ 図鑑を見る</button>
    </div>
  </div>`

  document.getElementById('result-share-btn')?.addEventListener('click', () => {
    const text = `ぷにメモリーで「${cap.title}」のオーブを生成！感情:${emoEmoji}${emoLabel} レアリティ:${rLabel} #ぷにメモリー`
    if (navigator.share) {
      navigator.share({ title: 'ぷにメモリー', text, url: location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => showToast('テキストをコピーしました！')).catch(() => {})
    }
  })

  document.getElementById('result-collection-btn')?.addEventListener('click', () => {
    switchTab('collection')
  })
}

// =====================
// COLLECTION TAB
// =====================

let collectionFilter = 'all'

function renderCollection() {
  const grid = document.getElementById('collection-grid')!
  const caps = getCapsules()

  let filtered = caps
  if (collectionFilter === 'legendary') filtered = caps.filter(c => c.rarity === 'legendary')
  else if (collectionFilter === 'epic') filtered = caps.filter(c => c.rarity === 'epic')
  else if (collectionFilter === 'rare') filtered = caps.filter(c => c.rarity === 'rare')
  else if (collectionFilter === 'locked') filtered = caps.filter(c => !c.opened)
  else if (collectionFilter === 'timecapsule') filtered = caps.filter(c => c.openAt !== null)

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <div class="empty-orb"></div>
      <p>${caps.length === 0 ? 'まだオーブがないよ。「作る」タブから最初のオーブを生成しよう！' : 'このフィルターに一致するオーブがないよ'}</p>
    </div>`
    return
  }

  grid.innerHTML = filtered.map(c => orbCardHtml(c, { compact: true })).join('')

  // Click to open modal
  grid.querySelectorAll('.orb-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = (card as HTMLElement).dataset.id!
      const cap = getCapsules().find(c => c.id === id)
      if (cap) openCapsuleModal(cap)
    })
  })
}

function setupCollectionTab() {
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      collectionFilter = (btn as HTMLElement).dataset.filter || 'all'
      renderCollection()
    })
  })
}

function openCapsuleModal(cap: Capsule) {
  const isLocked = !cap.opened
  const emoLabel = EMOTION_LABELS[cap.emotion as keyof typeof EMOTION_LABELS] || cap.emotion
  const emoEmoji = EMOTION_EMOJIS[cap.emotion as keyof typeof EMOTION_EMOJIS] || '✨'
  const rLabel = { common: 'コモン', rare: 'レア', epic: 'エピック', legendary: 'レジェンダリー' }[cap.rarity]
  const svg = renderOrbSvg({ color: cap.orbColor, color2: cap.orbColor2, pattern: cap.orbPattern, size: 120, rarity: cap.rarity })

  const contentHtml = isLocked
    ? `<div class="modal-locked">
        <div class="modal-locked-icon">🔒</div>
        <p class="modal-locked-text">${formatDate(cap.openAt!)} に開封されます</p>
        <div class="modal-locked-countdown" id="countdown-${cap.id}"></div>
      </div>`
    : `<div class="modal-content-text">${escapeHtml(cap.content).replace(/\n/g, '<br/>')}</div>`

  openModal(`
  <div class="modal-orb-header">
    ${svg}
    <div class="modal-orb-meta">
      <div class="orb-rarity-badge badge-${cap.rarity}">${rLabel}</div>
      <h2 class="modal-orb-title">${escapeHtml(cap.title)}</h2>
      <div class="modal-orb-emotion">${emoEmoji} ${emoLabel}</div>
      <div class="modal-orb-date">${formatDateTime(cap.createdAt)}</div>
    </div>
  </div>
  ${contentHtml}
  <div class="modal-actions">
    <button class="modal-btn danger" data-delete="${cap.id}">🗑️ 削除</button>
    <button class="modal-btn secondary" data-close>✕ 閉じる</button>
  </div>
  `)

  // Countdown
  if (isLocked && cap.openAt) {
    updateCountdown(cap.id, cap.openAt)
    const timer = setInterval(() => {
      const el = document.getElementById(`countdown-${cap.id}`)
      if (!el) { clearInterval(timer); return }
      updateCountdown(cap.id, cap.openAt!)
    }, 1000)
  }

  document.querySelector('[data-delete]')?.addEventListener('click', (e) => {
    const id = (e.target as HTMLElement).dataset.delete!
    if (confirm('このオーブを削除しますか？')) {
      deleteCapsule(id)
      closeModal()
      renderCollection()
      showToast('削除しました')
    }
  })

  document.querySelector('[data-close]')?.addEventListener('click', closeModal)
}

function updateCountdown(capId: string, openAt: number) {
  const el = document.getElementById(`countdown-${capId}`)
  if (!el) return
  const diff = openAt - Date.now()
  if (diff <= 0) { el.textContent = '開封できるよ！🎉'; return }
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  el.textContent = `あと ${d}日 ${h}時間 ${m}分 ${s}秒`
}

// =====================
// CALENDAR TAB - Emotion Heatmap
// =====================

function renderCalendar() {
  const container = document.getElementById('calendar-container')!
  const onThisDayContainer = document.getElementById('on-this-day')!
  const caps = getCapsules().filter(c => c.opened)

  // Build day → emotion/count map
  const dayMap = new Map<string, { emotion: string; count: number; color: string }>()
  const EMOTION_COLORS: Record<string, string> = {
    joy: '#FFD93D', sadness: '#6B9DC2', anger: '#E63946',
    fear: '#7B2CBF', love: '#FF6B9D', surprise: '#06D6A0', calm: '#A8DADC'
  }

  for (const cap of caps) {
    const day = new Date(cap.createdAt).toISOString().slice(0, 10)
    if (!dayMap.has(day)) {
      dayMap.set(day, { emotion: cap.emotion, count: 1, color: EMOTION_COLORS[cap.emotion] || '#ccc' })
    } else {
      dayMap.get(day)!.count++
    }
  }

  // Render last 6 months as heatmap
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build months
  const months: { label: string; days: { date: string; weekday: number }[] }[] = []
  for (let m = 5; m >= 0; m--) {
    const d = new Date(today)
    d.setDate(1)
    d.setMonth(d.getMonth() - m)
    const year = d.getFullYear()
    const month = d.getMonth()
    const label = `${year}年${month + 1}月`
    const days: { date: string; weekday: number }[] = []
    const last = new Date(year, month + 1, 0).getDate()
    for (let day = 1; day <= last; day++) {
      const dd = new Date(year, month, day)
      const dateStr = dd.toISOString().slice(0, 10)
      days.push({ date: dateStr, weekday: dd.getDay() })
    }
    months.push({ label, days })
  }

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

  let html = '<div class="calendar-heatmap">'
  for (const month of months) {
    html += `<div class="cal-month">
      <div class="cal-month-label">${month.label}</div>
      <div class="cal-weekdays">${WEEKDAYS.map(w => `<span>${w}</span>`).join('')}</div>
      <div class="cal-grid">`

    // Pad start
    const firstWeekday = month.days[0].weekday
    for (let i = 0; i < firstWeekday; i++) {
      html += '<div class="cal-day cal-day-empty"></div>'
    }

    for (const { date } of month.days) {
      const info = dayMap.get(date)
      const isFuture = date > today.toISOString().slice(0, 10)
      const isToday = date === today.toISOString().slice(0, 10)
      if (isFuture) {
        html += `<div class="cal-day cal-day-future"></div>`
      } else if (info) {
        const opacity = Math.min(1, 0.5 + info.count * 0.2)
        html += `<div class="cal-day cal-day-filled${isToday ? ' cal-day-today' : ''}"
          style="background:${info.color};opacity:${opacity}"
          title="${date} ${EMOTION_LABELS[info.emotion as keyof typeof EMOTION_LABELS] || ''} ${info.count}個"
          data-date="${date}"></div>`
      } else {
        html += `<div class="cal-day cal-day-empty${isToday ? ' cal-day-today' : ''}"></div>`
      }
    }
    html += '</div></div>'
  }
  html += '</div>'

  // Legend
  html += `<div class="cal-legend">
    ${Object.entries(EMOTION_LABELS).map(([k, v]) =>
      `<span class="cal-legend-item"><span class="cal-legend-dot" style="background:${EMOTION_COLORS[k] || '#ccc'}"></span>${EMOTION_EMOJIS[k as keyof typeof EMOTION_EMOJIS]}${v}</span>`
    ).join('')}
  </div>`

  container.innerHTML = html

  // Clickable days
  container.querySelectorAll('.cal-day-filled[data-date]').forEach(el => {
    el.addEventListener('click', () => {
      const date = (el as HTMLElement).dataset.date!
      const dayCaps = caps.filter(c => c.createdAt >= new Date(date).getTime() &&
        c.createdAt < new Date(date).getTime() + 86400000)
      if (dayCaps.length === 0) return
      openModal(`
        <h3 class="modal-date-title">${formatDate(new Date(date).getTime())}</h3>
        <div class="modal-day-list">
          ${dayCaps.map(c => `
            <div class="modal-day-item" data-cap-id="${c.id}">
              ${renderOrbSvg({ color: c.orbColor, color2: c.orbColor2, pattern: c.orbPattern, size: 48, rarity: c.rarity })}
              <div class="modal-day-item-info">
                <strong>${escapeHtml(c.title)}</strong>
                <span>${EMOTION_EMOJIS[c.emotion as keyof typeof EMOTION_EMOJIS] || ''} ${EMOTION_LABELS[c.emotion as keyof typeof EMOTION_LABELS] || c.emotion}</span>
              </div>
            </div>`).join('')}
        </div>
        <button class="modal-btn secondary" data-close>閉じる</button>
      `)
      document.querySelector('[data-close]')?.addEventListener('click', closeModal)
      document.querySelectorAll('[data-cap-id]').forEach(item => {
        item.addEventListener('click', () => {
          const capId = (item as HTMLElement).dataset.capId!
          const cap = getCapsules().find(c => c.id === capId)
          if (cap) { closeModal(); openCapsuleModal(cap) }
        })
      })
    })
  })

  // "On This Day"
  const onThis = getOnThisDay()
  if (onThis.length > 0) {
    onThisDayContainer.style.display = 'block'
    onThisDayContainer.innerHTML = `
      <h3 class="section-title">📅 この日の思い出</h3>
      <div class="on-this-day-list">
        ${onThis.map(({ label, capsule: c }) => `
          <div class="otd-card" data-cap-id="${c.id}">
            ${renderOrbSvg({ color: c.orbColor, color2: c.orbColor2, pattern: c.orbPattern, size: 56, rarity: c.rarity })}
            <div class="otd-info">
              <span class="otd-label">${label}</span>
              <strong>${escapeHtml(c.title)}</strong>
              <span class="otd-date">${formatDate(c.createdAt)}</span>
            </div>
          </div>`).join('')}
      </div>`
    onThisDayContainer.querySelectorAll('[data-cap-id]').forEach(el => {
      el.addEventListener('click', () => {
        const id = (el as HTMLElement).dataset.capId!
        const cap = getCapsules().find(c => c.id === id)
        if (cap) openCapsuleModal(cap)
      })
    })
  } else {
    onThisDayContainer.style.display = 'none'
  }
}

// =====================
// STATS TAB
// =====================

function renderStats() {
  const container = document.getElementById('stats-container')!
  const stats = computeStats()
  const caps = getCapsules()
  const achievements = getAllAchievements()

  const EMOTION_COLORS: Record<string, string> = {
    joy: '#FFD93D', sadness: '#6B9DC2', anger: '#E63946',
    fear: '#7B2CBF', love: '#FF6B9D', surprise: '#06D6A0', calm: '#A8DADC'
  }

  // Emotion chart (SVG bar chart)
  const emoEntries = Object.entries(stats.byEmotion).sort((a, b) => b[1] - a[1])
  const maxEmo = Math.max(...emoEntries.map(e => e[1]), 1)
  const emoChart = emoEntries.length > 0 ? `
    <div class="stats-chart-bars">
      ${emoEntries.map(([emo, n]) => `
        <div class="stat-bar-item">
          <div class="stat-bar-track">
            <div class="stat-bar-fill" style="height:${Math.round(n / maxEmo * 100)}%;background:${EMOTION_COLORS[emo] || '#ccc'}"></div>
          </div>
          <span class="stat-bar-emoji">${EMOTION_EMOJIS[emo as keyof typeof EMOTION_EMOJIS] || ''}</span>
          <span class="stat-bar-label">${EMOTION_LABELS[emo as keyof typeof EMOTION_LABELS] || emo}</span>
          <span class="stat-bar-count">${n}</span>
        </div>`).join('')}
    </div>` : '<p class="stats-empty">まだデータがありません</p>'

  // Rarity distribution
  const rarityOrder: Rarity[] = ['legendary', 'epic', 'rare', 'common']
  const rarityColors: Record<Rarity, string> = {
    legendary: 'linear-gradient(135deg,#FFD700,#FF8C00)',
    epic: 'linear-gradient(135deg,#9B59B6,#6C3483)',
    rare: 'linear-gradient(135deg,#3498DB,#1A5276)',
    common: 'linear-gradient(135deg,#BDC3C7,#7F8C8D)'
  }
  const rarityLabels: Record<Rarity, string> = { legendary: '👑 レジェンダリー', epic: '💜 エピック', rare: '💎 レア', common: '⭐ コモン' }
  const rarityDist = rarityOrder.map(r => {
    const n = stats.byRarity[r] || 0
    const pct = stats.total > 0 ? Math.round(n / stats.total * 100) : 0
    return `<div class="rarity-row">
      <span class="rarity-label">${rarityLabels[r]}</span>
      <div class="rarity-track"><div class="rarity-bar" style="width:${pct}%;background:${rarityColors[r]}"></div></div>
      <span class="rarity-count">${n}</span>
    </div>`
  }).join('')

  // Trend chart (last 30 days)
  const trendHtml = renderTrendChart(caps)

  // Achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const achHtml = `
    <div class="achievements-header">
      <h3 class="section-title">🏅 実績バッジ</h3>
      <span class="ach-progress">${unlockedCount} / ${achievements.length}</span>
    </div>
    <div class="achievements-grid">
      ${achievements.map(a => `
        <div class="ach-badge ${a.unlocked ? 'unlocked' : 'locked'}" title="${a.desc}">
          <span class="ach-emoji">${a.unlocked ? a.emoji : '🔒'}</span>
          <span class="ach-name">${a.title}</span>
          ${a.unlocked ? '' : `<span class="ach-desc">${a.desc}</span>`}
        </div>`).join('')}
    </div>`

  // Fusion section
  const fusionHtml = renderFusionSection(caps)

  // Export/Import
  const exportHtml = `
    <div class="section-card">
      <h3 class="section-title">📦 データ管理</h3>
      <p class="section-sub">あなたのデータはこの端末のみに保存されています。バックアップを定期的に取ることをお勧めします。</p>
      <div class="data-actions">
        <button class="data-btn" id="export-btn">⬇️ エクスポート (JSON)</button>
        <label class="data-btn" for="import-file">⬆️ インポート (JSON)</label>
        <input type="file" id="import-file" accept=".json" style="display:none"/>
      </div>
    </div>`

  container.innerHTML = `
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-num">${stats.total}</div>
        <div class="stat-label">オーブ総数</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${stats.streak}</div>
        <div class="stat-label">🔥 連続日数</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${stats.byRarity['legendary'] || 0}</div>
        <div class="stat-label">👑 伝説</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${getFusions().length}</div>
        <div class="stat-label">🔮 フュージョン数</div>
      </div>
    </div>

    <div class="section-card">
      <h3 class="section-title">💖 感情の内訳</h3>
      ${emoChart}
    </div>

    <div class="section-card">
      <h3 class="section-title">📈 30日間のトレンド</h3>
      ${trendHtml}
    </div>

    <div class="section-card">
      <h3 class="section-title">💎 レアリティ分布</h3>
      <div class="rarity-dist">${rarityDist}</div>
    </div>

    <div class="section-card">
      ${achHtml}
    </div>

    <div class="section-card">
      <h3 class="section-title">🔮 オーブフュージョン</h3>
      <p class="section-sub">同じレアリティのオーブ3つを合成して、より高いレアリティのオーブを錬成しよう！</p>
      ${fusionHtml}
    </div>

    ${exportHtml}
  `

  // Export handler
  document.getElementById('export-btn')?.addEventListener('click', () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `puni-memory-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    const newBadges = unlockExportAchievement()
    for (const badgeId of newBadges) {
      const ach = getAchievementById(badgeId)
      if (ach) showToast(`🏅 実績解除！${ach.emoji} ${ach.title}`, 'info', 4000)
    }
    showToast('エクスポートしました！')
  })

  // Import handler
  document.getElementById('import-file')?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const result = importData(reader.result as string)
        showToast(`${result.count}個のオーブをインポートしました！`)
        renderStats()
      } catch {
        showToast('インポートに失敗しました。ファイルを確認してね。', 'error')
      }
    }
    reader.readAsText(file)
  })

  // Fusion button handlers
  container.querySelectorAll('[data-fuse-rarity]').forEach(btn => {
    btn.addEventListener('click', () => {
      const rarity = (btn as HTMLElement).dataset.fuseRarity as Rarity
      executeFusion(rarity)
    })
  })
}

// =====================
// TREND CHART
// =====================

function renderTrendChart(caps: Capsule[]): string {
  const opened = caps.filter(c => c.opened)
  if (opened.length < 2) return '<p class="stats-empty">データが足りません（2個以上作ろう）</p>'

  const EMOTION_COLORS: Record<string, string> = {
    joy: '#FFD93D', sadness: '#6B9DC2', anger: '#E63946',
    fear: '#7B2CBF', love: '#FF6B9D', surprise: '#06D6A0', calm: '#A8DADC'
  }

  // Last 30 days
  const days: string[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }

  // Day data
  const dayData = days.map(date => {
    const dayCaps = opened.filter(c => c.createdAt >= new Date(date).getTime() &&
      c.createdAt < new Date(date).getTime() + 86400000)
    if (dayCaps.length === 0) return null
    const emo = dayCaps[0].emotion
    const color = EMOTION_COLORS[emo] || '#ccc'
    return { date, emotion: emo, count: dayCaps.length, color }
  })

  const hasData = dayData.some(d => d !== null)
  if (!hasData) return '<p class="stats-empty">過去30日間にデータがありません</p>'

  // Simple dot chart
  return `<div class="trend-chart">
    ${dayData.map((d, i) => d
      ? `<div class="trend-dot" style="background:${d.color}" title="${d.date}: ${EMOTION_LABELS[d.emotion as keyof typeof EMOTION_LABELS] || d.emotion} ×${d.count}"></div>`
      : `<div class="trend-dot trend-dot-empty" title="${days[i]}: 記録なし"></div>`
    ).join('')}
  </div>
  <div class="trend-chart-labels">
    <span>${days[0].slice(5)}</span>
    <span>${days[14].slice(5)}</span>
    <span>${days[29].slice(5)}</span>
  </div>`
}

// =====================
// ORB FUSION
// =====================

function renderFusionSection(caps: Capsule[]): string {
  const openedCaps = caps.filter(c => c.opened && !c.fusedFrom)
  const rarityOrder: Rarity[] = ['common', 'rare', 'epic']

  return rarityOrder.map(rarity => {
    const available = openedCaps.filter(c => c.rarity === rarity)
    const canFuse = available.length >= 3
    const nextRarity = ({ common: 'rare', rare: 'epic', epic: 'legendary' } as Record<string, Rarity>)[rarity] as Rarity
    const rLabel = ({ common: 'コモン', rare: 'レア', epic: 'エピック', legendary: 'レジェンダリー' } as Record<string, string>)[rarity]
    const nextLabel = ({ common: 'レア', rare: 'エピック', epic: 'レジェンダリー', legendary: '?' } as Record<string, string>)[nextRarity]
    const RARITY_COLORS: Record<string, string> = {
      legendary: '#FFD700', epic: '#9B59B6', rare: '#3498DB', common: '#95A5A6'
    }

    return `<div class="fusion-row ${canFuse ? 'can-fuse' : 'no-fuse'}">
      <div class="fusion-info">
        <span class="fusion-from" style="color:${RARITY_COLORS[rarity]}">${rLabel} ×3</span>
        <span class="fusion-arrow">→</span>
        <span class="fusion-to" style="color:${RARITY_COLORS[nextRarity]}">${nextLabel} ×1</span>
      </div>
      <div class="fusion-count">手持ち: ${available.length}個</div>
      ${canFuse
        ? `<button class="fusion-btn" data-fuse-rarity="${rarity}">🔮 フュージョン</button>`
        : `<button class="fusion-btn disabled" disabled>あと${3 - available.length}個必要</button>`}
    </div>`
  }).join('')
}

function executeFusion(rarity: Rarity) {
  const caps = getCapsules()
  const available = caps.filter(c => c.opened && c.rarity === rarity && !c.fusedFrom)

  if (available.length < 3) {
    showToast('オーブが足りないよ！', 'error')
    return
  }

  const sources = available.slice(0, 3)
  const nextRarity = { common: 'rare', rare: 'epic', epic: 'legendary' } as Record<Rarity, Rarity>
  const newRarity = nextRarity[rarity]
  if (!newRarity) return

  // Delete source orbs
  for (const s of sources) deleteCapsule(s.id)

  // Create fused orb
  const emotions = sources.map(s => s.emotion)
  const emo = analyzeEmotion(sources.map(s => s.content).join(' '))
  const orb = generateOrb(sources.map(s => s.content).join(' '), emo)
  orb.rarity = newRarity

  const id = generateId('f')
  const now = Date.now()
  const fused: Capsule = {
    id,
    title: `フュージョン: ${sources.map(s => s.title).join('+')}`,
    content: `[フュージョンオーブ] ${sources.map(s => s.content).join(' | ')}`,
    emotion: emo.emotion,
    emotionScore: emo.score,
    intensity: emo.intensity,
    orbColor: orb.color,
    orbColor2: orb.color2,
    orbPattern: 'sparkle',
    orbSize: orb.size,
    rarity: newRarity,
    shareId: generateShareId(),
    openAt: null,
    opened: true,
    createdAt: now,
    fusedFrom: sources.map(s => s.id)
  }

  saveCapsule(fused)
  saveFusion({ id: generateId(), sourceIds: sources.map(s => s.id), resultId: id, createdAt: now })

  const newBadges = checkAndUnlockAchievements(fused)
  const rLabel = ({ rare: 'レア', epic: 'エピック', legendary: 'レジェンダリー', common: 'コモン' } as Record<string, string>)[newRarity]
  showToast(`🔮 フュージョン成功！${rLabel}オーブが誕生した！`, 'success', 5000)

  for (const badgeId of newBadges) {
    const ach = getAchievementById(badgeId)
    if (ach) setTimeout(() => showToast(`🏅 実績解除！${ach.emoji} ${ach.title}`, 'info', 4000), 1000)
  }

  renderStats()
}

// =====================
// APP HTML TEMPLATE
// =====================

function buildAppHtml(): string {
  return `
  <div class="puni-bg">
    <div class="puni-blob puni-blob-1"></div>
    <div class="puni-blob puni-blob-2"></div>
    <div class="puni-blob puni-blob-3"></div>
  </div>

  <header class="puni-header">
    <div class="puni-header-inner">
      <a href="/" class="puni-logo">
        <span class="puni-logo-orb"></span>
        <span class="puni-logo-text">ぷにメモリー</span>
      </a>
      <nav class="puni-nav">
        <button data-tab="create" class="nav-btn active">✏️ 作る</button>
        <button data-tab="collection" class="nav-btn">🗂️ 図鑑</button>
        <button data-tab="calendar" class="nav-btn">📅 カレンダー</button>
        <button data-tab="stats" class="nav-btn">📊 記録</button>
      </nav>
    </div>
  </header>

  <main class="puni-main">

    <!-- CREATE TAB -->
    <section id="tab-create" class="puni-tab puni-tab-active">
      <div class="puni-hero">
        <div class="puni-hero-orbs" aria-hidden="true">
          <div class="puni-hero-orb puni-hero-orb-1"></div>
          <div class="puni-hero-orb puni-hero-orb-2"></div>
          <div class="puni-hero-orb puni-hero-orb-3"></div>
        </div>
        <h1 class="puni-hero-title">
          今日の気持ちを<br/>
          <span class="puni-grad-text">ぷにぷにオーブ</span>に。
        </h1>
        <p class="puni-hero-sub">AIがあなたの感情を読み取って、世界に一つだけのオーブを生成します。<br/>データはあなたの端末だけに保存。完全プライベート 🔒</p>
      </div>

      <div class="puni-prompt-card">
        <span class="puni-prompt-label">🌟 今日のお題</span>
        <p class="puni-prompt-text" id="daily-prompt-text"></p>
        <button class="puni-prompt-use" id="use-prompt-btn">このお題で書く</button>
      </div>

      <div class="puni-card puni-form-card">
        <label class="puni-label">タイトル <span class="puni-label-hint">(必須)</span></label>
        <input id="capsule-title" type="text" maxlength="60" placeholder="今日のできごと…" class="puni-input" autocomplete="off"/>
        <div class="puni-counter" id="title-counter">0 / 60</div>

        <label class="puni-label">気持ち・できごと <span class="puni-label-hint">(5〜2000文字)</span></label>
        <textarea id="capsule-content" maxlength="2000" placeholder="今日あったこと、感じたこと、なんでも書いてみて。&#10;例: 「テスト終わった〜！マジで疲れた…でも遊びにいけるの楽しみ✨」&#10;AIがそれを解析して、あなただけのオーブを作るよ🪄" class="puni-textarea"></textarea>
        <div class="puni-counter" id="content-counter">0 / 2000</div>

        <div class="puni-options">
          <label class="puni-toggle">
            <input type="checkbox" id="is-timecapsule"/>
            <span class="puni-toggle-track"><span class="puni-toggle-thumb"></span></span>
            <span class="puni-toggle-text">⏳ タイムカプセルにする</span>
          </label>
          <div id="timecapsule-options" class="puni-timecapsule-options" style="display:none;">
            <label class="puni-label-sm">いつ開封する？</label>
            <div class="puni-chip-row">
              <button type="button" class="puni-chip" data-days="7">1週間後</button>
              <button type="button" class="puni-chip" data-days="30">1ヶ月後</button>
              <button type="button" class="puni-chip" data-days="180">半年後</button>
              <button type="button" class="puni-chip" data-days="365">1年後</button>
              <button type="button" class="puni-chip" data-days="custom">日付指定</button>
            </div>
            <input type="datetime-local" id="open-at-input" class="puni-input puni-input-sm" style="display:none;"/>
          </div>
        </div>

        <button id="create-btn" class="puni-btn puni-btn-primary">
          <span class="puni-btn-text">オーブを生成する 🪄</span>
          <span class="puni-btn-spinner" style="display:none;"></span>
        </button>
        <p class="puni-form-note">💡 完全無料・完全ローカル。あなたのデータはサーバーに送られません。</p>
      </div>

      <div id="result-area" style="display:none;"></div>
    </section>

    <!-- COLLECTION TAB -->
    <section id="tab-collection" class="puni-tab">
      <div class="puni-section-head">
        <h2 class="puni-section-title">🌟 あなたのオーブ図鑑</h2>
        <p class="puni-section-sub">これまでに作ったぷにオーブたち</p>
      </div>
      <div class="puni-filter-row">
        <button class="filter-chip active" data-filter="all">すべて</button>
        <button class="filter-chip" data-filter="legendary">👑 伝説</button>
        <button class="filter-chip" data-filter="epic">💜 エピック</button>
        <button class="filter-chip" data-filter="rare">💎 レア</button>
        <button class="filter-chip" data-filter="locked">⏳ 未開封</button>
        <button class="filter-chip" data-filter="timecapsule">📦 カプセル</button>
      </div>
      <div id="collection-grid" class="puni-collection-grid">
        <div class="puni-loading">読み込み中…</div>
      </div>
    </section>

    <!-- CALENDAR TAB -->
    <section id="tab-calendar" class="puni-tab">
      <div class="puni-section-head">
        <h2 class="puni-section-title">📅 感情カレンダー</h2>
        <p class="puni-section-sub">あなたの感情の軌跡を色で見てみよう</p>
      </div>
      <div id="on-this-day" style="display:none;"></div>
      <div id="calendar-container"></div>
    </section>

    <!-- STATS TAB -->
    <section id="tab-stats" class="puni-tab">
      <div class="puni-section-head">
        <h2 class="puni-section-title">📊 あなたの記録</h2>
        <p class="puni-section-sub">心の足あとを見てみよう</p>
      </div>
      <div id="stats-container">
        <div class="puni-loading">読み込み中…</div>
      </div>
    </section>

  </main>

  <footer class="puni-footer">
    <p>ぷにメモリー © 2025 — 完全プライベート・完全ローカル</p>
    <p class="footer-sub">🔒 あなたのデータはこの端末のみに保存されます</p>
  </footer>

  <div id="modal-root" class="puni-modal-root" style="display:none;">
    <div class="puni-modal-backdrop" id="modal-backdrop"></div>
    <div class="puni-modal-content" id="modal-body"></div>
  </div>

  <div id="toast-root" style="display:none;"></div>
  `
}

// =====================
// CSS
// =====================

function injectStyles() {
  const style = document.createElement('style')
  style.textContent = `
:root {
  --pink: #FFD6E8; --pink-deep: #FF8FB1;
  --purple: #E0CCFF; --purple-deep: #B69BFF;
  --blue: #C8E6FF; --blue-deep: #8AB8FF;
  --mint: #C7F0DB; --yellow: #FFF1B8;
  --text: #3D2B5C; --text-soft: #6B5B95; --text-mute: #9D90B8;
  --bg: #FDF6FF; --card: #ffffff;
  --shadow: 0 8px 24px -8px rgba(180,140,220,.25),0 2px 8px rgba(180,140,220,.1);
  --shadow-strong: 0 16px 40px -12px rgba(180,140,220,.35),0 4px 16px rgba(180,140,220,.15);
  --r-sm: 14px; --r: 22px; --r-lg: 32px;
}

*{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
html,body{margin:0;padding:0;font-family:'Zen Maru Gothic','M PLUS Rounded 1c','Hiragino Maru Gothic ProN','Hiragino Sans',-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
button{font-family:inherit;cursor:pointer}
input,textarea{font-family:inherit}
a{text-decoration:none;color:inherit}

.init-loader{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:16px;color:var(--text-soft);font-size:16px}
.init-orb{width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFD6E8,#FF8FB1 60%,#B69BFF);animation:punyPuny 2s ease-in-out infinite;box-shadow:0 8px 24px rgba(255,143,177,.4)}

.puni-bg{position:fixed;inset:0;z-index:-1;background:linear-gradient(160deg,#FFE5F1 0%,#E5F1FF 50%,#F1E5FF 100%);overflow:hidden}
.puni-blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.5;animation:blobFloat 20s ease-in-out infinite}
.puni-blob-1{top:-10%;left:-10%;width:400px;height:400px;background:var(--pink)}
.puni-blob-2{top:40%;right:-10%;width:500px;height:500px;background:var(--purple);animation-delay:-7s}
.puni-blob-3{bottom:-10%;left:30%;width:450px;height:450px;background:var(--blue);animation-delay:-14s}
@keyframes blobFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-50px) scale(1.05)}66%{transform:translate(-20px,30px) scale(.95)}}

.puni-header{position:sticky;top:0;z-index:50;background:rgba(253,246,255,.88);backdrop-filter:blur(16px) saturate(1.2);border-bottom:1px solid rgba(180,140,220,.12)}
.puni-header-inner{max-width:1100px;margin:0 auto;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px}
.puni-logo{display:flex;align-items:center;gap:10px;font-weight:900;font-size:18px}
.puni-logo-orb{width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFD6E8,#FF8FB1 60%,#B69BFF);box-shadow:0 4px 12px rgba(255,143,177,.4),inset -2px -2px 4px rgba(255,255,255,.6);animation:punyPuny 3s ease-in-out infinite;flex-shrink:0}
@keyframes punyPuny{0%,100%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.06,.94) rotate(-1deg)}75%{transform:scale(.97,1.03) rotate(1deg)}}
.puni-logo-text{letter-spacing:-.02em}
.puni-nav{display:flex;gap:3px;background:white;padding:4px;border-radius:999px;box-shadow:var(--shadow)}
.nav-btn{border:none;background:transparent;padding:7px 13px;border-radius:999px;font-weight:700;color:var(--text-soft);font-size:13px;transition:all .2s;white-space:nowrap}
.nav-btn.active{background:linear-gradient(135deg,#FFB3D9,#B69BFF);color:white;box-shadow:0 4px 12px rgba(182,155,255,.4)}
@media(max-width:600px){.nav-btn{padding:6px 8px;font-size:11px}}
@media(max-width:380px){.puni-logo-text{display:none}}

.puni-main{max-width:1100px;margin:0 auto;padding:20px 16px 80px}
.puni-tab{display:none;animation:fadeUp .35s ease}
.puni-tab-active{display:block}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

.puni-hero{text-align:center;padding:28px 0 20px;position:relative}
.puni-hero-orbs{display:flex;justify-content:center;gap:18px;margin-bottom:16px;pointer-events:none}
.puni-hero-orb{width:60px;height:60px;border-radius:50%;box-shadow:0 8px 20px -4px rgba(180,140,220,.4),inset -4px -6px 10px rgba(0,0,0,.05),inset 3px 4px 8px rgba(255,255,255,.6);animation:heroFloat 4s ease-in-out infinite;position:relative}
.puni-hero-orb::before{content:'';position:absolute;top:18%;left:22%;width:32%;height:22%;border-radius:50%;background:rgba(255,255,255,.7);filter:blur(1px)}
.puni-hero-orb-1{background:radial-gradient(circle at 35% 30%,#FFD6E8,#FF8FB1 60%,#B69BFF);animation-delay:0s}
.puni-hero-orb-2{background:radial-gradient(circle at 35% 30%,#FFF,#C8E6FF 30%,#8AB8FF 80%);animation-delay:-1.3s;transform:translateY(-8px)}
.puni-hero-orb-3{background:radial-gradient(circle at 35% 30%,#FFF1B8,#FFD93D 50%,#FF8FB1);animation-delay:-2.6s}
@keyframes heroFloat{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-6px) scale(1.04,.96)}75%{transform:translateY(4px) scale(.97,1.03)}}
@media(max-width:480px){.puni-hero-orb{width:48px;height:48px}}
.puni-hero-title{font-size:clamp(26px,6vw,42px);font-weight:900;line-height:1.3;letter-spacing:-.02em;margin:0 0 14px}
.puni-grad-text{background:linear-gradient(135deg,#FF8FB1 0%,#B69BFF 50%,#8AB8FF 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.puni-hero-sub{font-size:clamp(13px,2.5vw,15px);color:var(--text-soft);margin:0;line-height:1.7}

.puni-prompt-card{background:white;border-radius:var(--r);padding:16px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;box-shadow:var(--shadow);border:1.5px solid rgba(182,155,255,.2)}
.puni-prompt-label{font-size:12px;font-weight:700;color:var(--text-mute);white-space:nowrap}
.puni-prompt-text{flex:1;font-size:15px;font-weight:700;color:var(--text);margin:0}
.puni-prompt-use{border:none;background:linear-gradient(135deg,#FFB3D9,#B69BFF);color:white;padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700;white-space:nowrap}

.puni-card{background:white;border-radius:var(--r-lg);padding:24px;box-shadow:var(--shadow);margin-bottom:16px}
.puni-form-card{margin-bottom:16px}
.puni-label{display:block;font-size:14px;font-weight:700;color:var(--text-soft);margin-bottom:8px;margin-top:16px}
.puni-label:first-child{margin-top:0}
.puni-label-hint{font-weight:500;color:var(--text-mute);font-size:13px}
.puni-label-sm{display:block;font-size:13px;font-weight:700;color:var(--text-mute);margin-bottom:8px}
.puni-input{width:100%;border:1.5px solid rgba(180,140,220,.25);border-radius:var(--r-sm);padding:10px 14px;font-size:15px;color:var(--text);background:var(--bg);transition:border-color .2s;outline:none}
.puni-input:focus{border-color:var(--purple-deep)}
.puni-input-sm{padding:8px 12px;font-size:14px}
.puni-textarea{width:100%;border:1.5px solid rgba(180,140,220,.25);border-radius:var(--r-sm);padding:12px 14px;font-size:15px;color:var(--text);background:var(--bg);resize:vertical;min-height:140px;transition:border-color .2s;outline:none;line-height:1.7}
.puni-textarea:focus{border-color:var(--purple-deep)}
.puni-counter{font-size:12px;color:var(--text-mute);text-align:right;margin-top:4px}
.puni-counter.warn{color:#E63946;font-weight:700}
.puni-options{margin:20px 0 0;display:flex;flex-direction:column;gap:12px}
.puni-toggle{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none}
.puni-toggle input{display:none}
.puni-toggle-track{width:44px;height:24px;border-radius:999px;background:#E2D9F0;transition:background .2s;position:relative;flex-shrink:0}
.puni-toggle input:checked~.puni-toggle-track{background:linear-gradient(135deg,#FFB3D9,#B69BFF)}
.puni-toggle-thumb{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:white;transition:left .2s;box-shadow:0 2px 4px rgba(0,0,0,.15)}
.puni-toggle input:checked~.puni-toggle-track .puni-toggle-thumb{left:23px}
.puni-toggle-text{font-size:14px;font-weight:700;color:var(--text)}
.puni-timecapsule-options{background:var(--bg);border-radius:var(--r-sm);padding:14px;margin-top:8px}
.puni-chip-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.puni-chip{border:1.5px solid rgba(180,140,220,.3);background:white;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:700;color:var(--text-soft);transition:all .2s}
.puni-chip.active{background:linear-gradient(135deg,#FFB3D9,#B69BFF);color:white;border-color:transparent}
.puni-btn{border:none;padding:14px 28px;border-radius:999px;font-size:16px;font-weight:900;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.puni-btn-primary{background:linear-gradient(135deg,#FF8FB1,#B69BFF);color:white;width:100%;justify-content:center;margin-top:20px;box-shadow:0 8px 20px rgba(182,155,255,.4)}
.puni-btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(182,155,255,.5)}
.puni-btn-primary:active{transform:translateY(0)}
.puni-btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none}
@keyframes spin{to{transform:rotate(360deg)}}
.puni-btn-spinner{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.4);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite}
.puni-form-note{font-size:12px;color:var(--text-mute);text-align:center;margin:10px 0 0}

/* Result card */
.result-card{background:white;border-radius:var(--r-lg);padding:24px;box-shadow:var(--shadow-strong);text-align:center;margin-bottom:16px}
.result-orb-appear{animation:orbAppear .6s cubic-bezier(.34,1.56,.64,1)}
@keyframes orbAppear{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
.result-header{display:flex;justify-content:center;gap:8px;margin-bottom:12px}
.result-orb-wrap{position:relative;display:inline-block;margin:0 auto 12px}
.result-emotion-pill{position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);background:white;border-radius:999px;padding:4px 12px;font-size:13px;font-weight:700;color:var(--text);box-shadow:var(--shadow);white-space:nowrap}
.result-title{font-size:18px;font-weight:900;margin:12px 0 8px}
.result-capsule-note{background:var(--yellow);border-radius:var(--r-sm);padding:10px 14px;font-size:14px;color:var(--text);margin:8px 0}
.result-bars{text-align:left;margin:12px 0}
.result-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.result-bar-label{font-size:12px;color:var(--text-mute);width:90px;flex-shrink:0}
.result-bar-track{flex:1;height:8px;background:var(--bg);border-radius:999px;overflow:hidden}
.result-bar-fill{height:100%;border-radius:999px;transition:width .8s ease}
.result-bar-val{font-size:12px;font-weight:700;color:var(--text-soft);width:36px;text-align:right}
.result-actions{display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap}
.result-btn{border:none;padding:10px 20px;border-radius:999px;font-size:14px;font-weight:700;background:linear-gradient(135deg,#FF8FB1,#B69BFF);color:white;transition:all .2s}
.result-btn.secondary{background:white;color:var(--text-soft);border:1.5px solid rgba(180,140,220,.3)}
.result-legendary-badge{background:linear-gradient(135deg,#FFD700,#FF8C00);color:white;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700}
.result-epic-badge{background:linear-gradient(135deg,#9B59B6,#6C3483);color:white;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700}

/* Rarity badges */
.orb-rarity-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700}
.badge-common{background:#f0edf8;color:#9D90B8}
.badge-rare{background:#dbeaff;color:#2563eb}
.badge-epic{background:#f3e8ff;color:#7c3aed}
.badge-legendary{background:linear-gradient(135deg,#FFF8DC,#FFE4B5);color:#B8860B;border:1px solid #FFD700}

/* Section head */
.puni-section-head{text-align:center;margin-bottom:20px}
.puni-section-title{font-size:22px;font-weight:900;margin:0 0 6px}
.puni-section-sub{font-size:14px;color:var(--text-mute);margin:0}

/* Filter chips */
.puni-filter-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;justify-content:center}
.filter-chip{border:1.5px solid rgba(180,140,220,.3);background:white;padding:7px 14px;border-radius:999px;font-size:13px;font-weight:700;color:var(--text-soft);transition:all .2s}
.filter-chip.active{background:linear-gradient(135deg,#FFB3D9,#B69BFF);color:white;border-color:transparent}

/* Collection grid */
.puni-collection-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
@media(max-width:400px){.puni-collection-grid{grid-template-columns:repeat(2,1fr)}}
.orb-card{background:white;border-radius:var(--r);padding:14px;box-shadow:var(--shadow);cursor:pointer;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:8px}
.orb-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-strong)}
.orb-card.rarity-legendary{border:1.5px solid #FFD700}
.orb-card.rarity-epic{border:1.5px solid #9B59B6}
.orb-card.rarity-rare{border:1.5px solid #3498DB}
.orb-card-svg{width:80px;height:80px;display:flex;align-items:center;justify-content:center}
.orb-locked-icon{font-size:36px;line-height:80px}
.orb-card-info{width:100%;text-align:center}
.orb-title{font-size:13px;font-weight:700;margin:4px 0 2px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.orb-emotion{font-size:12px;color:var(--text-soft)}
.orb-date{font-size:11px;color:var(--text-mute);margin-top:2px}
.empty-state{grid-column:1/-1;text-align:center;padding:48px 24px;color:var(--text-mute)}
.empty-orb{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#f0edf8,#e0d9f0);margin:0 auto 16px;opacity:.5}
.puni-loading{padding:40px;text-align:center;color:var(--text-mute)}

/* Calendar */
.calendar-heatmap{display:flex;flex-direction:column;gap:20px;margin-top:8px}
.cal-month{}
.cal-month-label{font-size:14px;font-weight:700;color:var(--text-soft);margin-bottom:8px}
.cal-weekdays{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:3px}
.cal-weekdays span{font-size:11px;color:var(--text-mute);text-align:center}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
.cal-day{aspect-ratio:1;border-radius:4px;cursor:pointer;transition:transform .15s}
.cal-day-empty{background:rgba(180,140,220,.08)}
.cal-day-future{background:rgba(180,140,220,.04)}
.cal-day-filled{box-shadow:0 2px 6px rgba(0,0,0,.12)}
.cal-day-filled:hover{transform:scale(1.3);z-index:1}
.cal-day-today{ring:2px solid var(--purple-deep);outline:2px solid var(--purple-deep)}
.cal-legend{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;justify-content:center}
.cal-legend-item{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-soft)}
.cal-legend-dot{width:12px;height:12px;border-radius:3px;flex-shrink:0}

/* On This Day */
.on-this-day-list{display:flex;flex-direction:column;gap:10px;margin-bottom:24px}
.otd-card{background:white;border-radius:var(--r);padding:12px 16px;box-shadow:var(--shadow);display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s}
.otd-card:hover{transform:translateX(4px)}
.otd-info{flex:1}
.otd-label{font-size:11px;font-weight:700;color:var(--purple-deep);display:block}
.otd-info strong{font-size:14px;display:block;margin:2px 0}
.otd-date{font-size:12px;color:var(--text-mute)}

/* Stats */
.stats-overview{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px}
@media(min-width:600px){.stats-overview{grid-template-columns:repeat(4,1fr)}}
.stat-card{background:white;border-radius:var(--r);padding:16px;box-shadow:var(--shadow);text-align:center}
.stat-num{font-size:32px;font-weight:900;color:var(--text);line-height:1}
.stat-label{font-size:12px;color:var(--text-mute);margin-top:4px}
.section-card{background:white;border-radius:var(--r-lg);padding:20px;box-shadow:var(--shadow);margin-bottom:16px}
.section-title{font-size:18px;font-weight:900;margin:0 0 12px}
.section-sub{font-size:13px;color:var(--text-mute);margin:-8px 0 14px}

/* Stat bars */
.stats-chart-bars{display:flex;gap:12px;align-items:flex-end;height:120px;padding:0 4px}
.stat-bar-item{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1}
.stat-bar-track{flex:1;width:100%;background:var(--bg);border-radius:6px 6px 0 0;display:flex;align-items:flex-end}
.stat-bar-fill{width:100%;border-radius:6px 6px 0 0;transition:height .8s ease;min-height:4px}
.stat-bar-emoji{font-size:14px}
.stat-bar-label{font-size:10px;color:var(--text-mute);text-align:center}
.stat-bar-count{font-size:12px;font-weight:700;color:var(--text-soft)}

/* Rarity dist */
.rarity-dist{display:flex;flex-direction:column;gap:10px}
.rarity-row{display:flex;align-items:center;gap:10px}
.rarity-label{font-size:13px;font-weight:700;width:140px;flex-shrink:0}
.rarity-track{flex:1;height:10px;background:var(--bg);border-radius:999px;overflow:hidden}
.rarity-bar{height:100%;border-radius:999px;transition:width .8s ease;min-width:4px}
.rarity-count{font-size:13px;font-weight:700;color:var(--text-soft);width:30px;text-align:right}
.stats-empty{color:var(--text-mute);font-size:14px;padding:8px 0}

/* Trend chart */
.trend-chart{display:flex;gap:3px;align-items:center;flex-wrap:wrap;padding:8px 0}
.trend-dot{width:14px;height:14px;border-radius:50%;flex-shrink:0;transition:transform .15s;cursor:default}
.trend-dot:hover{transform:scale(1.5);z-index:1}
.trend-dot-empty{background:rgba(180,140,220,.15)}
.trend-chart-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--text-mute);padding:0 4px}

/* Achievements */
.achievements-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.ach-progress{font-size:13px;font-weight:700;color:var(--text-soft)}
.achievements-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px}
.ach-badge{background:var(--bg);border-radius:var(--r-sm);padding:12px 8px;text-align:center;display:flex;flex-direction:column;gap:4px;align-items:center;transition:all .2s}
.ach-badge.unlocked{background:linear-gradient(135deg,#fff9e6,#fff);box-shadow:var(--shadow);border:1px solid rgba(255,215,0,.3)}
.ach-badge.locked{opacity:.5}
.ach-emoji{font-size:24px}
.ach-name{font-size:11px;font-weight:700;color:var(--text)}
.ach-desc{font-size:10px;color:var(--text-mute);line-height:1.3}

/* Fusion */
.fusion-row{display:flex;align-items:center;gap:10px;padding:12px;border-radius:var(--r-sm);margin-bottom:8px;flex-wrap:wrap}
.fusion-row.can-fuse{background:linear-gradient(135deg,rgba(255,215,0,.1),rgba(182,155,255,.1))}
.fusion-row.no-fuse{background:var(--bg)}
.fusion-info{display:flex;align-items:center;gap:6px;flex:1}
.fusion-from,.fusion-to{font-weight:900;font-size:15px}
.fusion-arrow{color:var(--text-mute)}
.fusion-count{font-size:12px;color:var(--text-mute)}
.fusion-btn{border:none;padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700;background:linear-gradient(135deg,#9B59B6,#6C3483);color:white;transition:all .2s}
.fusion-btn:hover{transform:scale(1.05)}
.fusion-btn.disabled{background:#e2e2e2;color:#999;cursor:not-allowed}

/* Data actions */
.data-actions{display:flex;gap:10px;flex-wrap:wrap}
.data-btn{border:1.5px solid rgba(180,140,220,.3);background:white;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:700;color:var(--text-soft);cursor:pointer;transition:all .2s}
.data-btn:hover{background:var(--bg);border-color:var(--purple-deep)}

/* Modal */
.puni-modal-root{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.puni-modal-backdrop{position:absolute;inset:0;background:rgba(61,43,92,.5);backdrop-filter:blur(4px)}
.puni-modal-content{background:white;border-radius:var(--r-lg);padding:24px;max-width:520px;width:100%;max-height:80vh;overflow-y:auto;position:relative;z-index:1;box-shadow:var(--shadow-strong);animation:fadeUp .25s ease}
.modal-orb-header{display:flex;gap:16px;margin-bottom:16px;align-items:flex-start}
.modal-orb-meta{flex:1}
.modal-orb-title{font-size:18px;font-weight:900;margin:6px 0 4px}
.modal-orb-emotion{font-size:14px;color:var(--text-soft)}
.modal-orb-date{font-size:12px;color:var(--text-mute);margin-top:4px}
.modal-content-text{background:var(--bg);border-radius:var(--r-sm);padding:14px;font-size:15px;line-height:1.7;color:var(--text);margin-bottom:16px;max-height:200px;overflow-y:auto}
.modal-locked{text-align:center;padding:20px;background:var(--bg);border-radius:var(--r-sm);margin-bottom:16px}
.modal-locked-icon{font-size:40px}
.modal-locked-text{font-size:14px;color:var(--text-soft);margin:8px 0 0}
.modal-locked-countdown{font-size:12px;color:var(--text-mute);margin-top:6px;font-weight:700}
.modal-actions{display:flex;gap:10px;justify-content:flex-end}
.modal-btn{border:none;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:700;cursor:pointer}
.modal-btn.secondary{background:var(--bg);color:var(--text-soft)}
.modal-btn.danger{background:#ffeded;color:#E63946}
.modal-date-title{font-size:18px;font-weight:900;margin:0 0 14px}
.modal-day-list{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
.modal-day-item{display:flex;align-items:center;gap:10px;padding:8px;background:var(--bg);border-radius:var(--r-sm);cursor:pointer;transition:background .15s}
.modal-day-item:hover{background:#f0edf8}
.modal-day-item-info{flex:1}
.modal-day-item-info strong{display:block;font-size:14px}
.modal-day-item-info span{font-size:12px;color:var(--text-mute)}

/* Toast */
.toast{padding:12px 20px;border-radius:999px;font-size:14px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.15);animation:toastIn .3s ease}
@keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.toast-success{background:linear-gradient(135deg,#C7F0DB,#8FE0B8);color:#1a6b3f}
.toast-error{background:linear-gradient(135deg,#FFD6D6,#FFB3B3);color:#c0392b}
.toast-info{background:linear-gradient(135deg,#E0CCFF,#C8E6FF);color:#3D2B5C}
#toast-root{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:200;pointer-events:none;min-width:200px;max-width:calc(100vw - 40px);text-align:center}

.puni-footer{text-align:center;padding:24px;color:var(--text-mute);font-size:13px}
.footer-sub{margin:4px 0 0;font-size:11px}
  `
  document.head.appendChild(style)
}

// =====================
// MAIN INIT
// =====================

function init() {
  // Inject styles
  injectStyles()

  // Build app HTML
  const appEl = document.getElementById('app')!
  appEl.innerHTML = buildAppHtml()

  // Resolve time capsules
  const opened = resolveTimeCapsules()
  if (opened.length > 0) {
    showToast(`🎉 ${opened.length}個のタイムカプセルが開封されました！`, 'info', 5000)
  }

  // Tab navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = (btn as HTMLElement).dataset.tab!
      switchTab(tab)
    })
  })

  // Modal close on backdrop click
  document.getElementById('modal-backdrop')?.addEventListener('click', closeModal)

  // Setup create tab
  setupCreateTab()
  setupCollectionTab()

  // Mark last seen
  setLastSeen()
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
