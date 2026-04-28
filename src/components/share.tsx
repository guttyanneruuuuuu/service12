// シェア用ページ（OGP対応）
import type { EmotionType } from '../lib/emotion'
import { EMOTION_LABELS, EMOTION_EMOJIS } from '../lib/emotion'

export interface ShareData {
  shareId: string
  title: string
  content: string
  emotion: EmotionType
  color: string
  color2: string
  pattern: string
  rarity: string
  openAt: number | null
  opened: boolean
  isPublic: boolean
  createdAt: number
}

export function renderShare(d: ShareData): string {
  const safeTitle = escapeHtml(d.title)
  const safeContent = escapeHtml(d.content || '')
  const emoLabel = EMOTION_LABELS[d.emotion]
  const emoEmoji = EMOTION_EMOJIS[d.emotion]
  const dateStr = new Date(d.createdAt).toLocaleString('ja-JP', { year:'numeric', month:'long', day:'numeric' })
  const ogImgPath = `/og/${d.shareId}.svg`
  const ogTitle = `${d.title} | ぷにメモリー`
  const ogDesc = d.opened
    ? `${emoEmoji} ${emoLabel} のオーブ（${rarityLabel(d.rarity)}）。${dateStr} の思い出。`
    : `🔒 タイムカプセル「${d.title}」が ${d.openAt ? new Date(d.openAt).toLocaleDateString('ja-JP') : ''} に開封されます。`

  const orbSvgInline = renderOrbInline(d)

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="${d.color}"/>
<title>${safeTitle} | ぷにメモリー</title>
<meta name="description" content="${escapeHtml(ogDesc)}"/>
<meta property="og:title" content="${escapeHtml(ogTitle)}"/>
<meta property="og:description" content="${escapeHtml(ogDesc)}"/>
<meta property="og:type" content="article"/>
<meta property="og:image" content="${ogImgPath}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escapeHtml(ogTitle)}"/>
<meta name="twitter:description" content="${escapeHtml(ogDesc)}"/>
<meta name="twitter:image" content="${ogImgPath}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=M+PLUS+Rounded+1c:wght@400;500;700;900&display=swap" rel="stylesheet"/>
<style>${shareCss(d.color, d.color2)}</style>
</head>
<body>
<div class="puni-bg">
  <div class="puni-blob puni-blob-1"></div>
  <div class="puni-blob puni-blob-2"></div>
</div>

<header class="puni-header">
  <a href="/" class="puni-logo">
    <span class="puni-logo-orb"></span>
    <span class="puni-logo-text">ぷにメモリー</span>
  </a>
</header>

<main class="puni-share-main">
  <div class="puni-share-card">
    <div class="puni-share-orb-wrap">
      ${orbSvgInline}
    </div>
    <h1 class="puni-share-title">${safeTitle}</h1>
    <p class="puni-share-date">${dateStr}</p>
    <div class="puni-share-badges">
      <span class="puni-badge puni-badge-emotion">${emoEmoji} ${emoLabel}</span>
      <span class="puni-badge puni-badge-rarity ${d.rarity}">${rarityLabel(d.rarity)}</span>
    </div>
    ${d.opened ? `
      <div class="puni-share-content">${safeContent.replace(/\n/g, '<br>')}</div>
    ` : `
      <div class="puni-share-locked">
        <div style="font-size:48px;">🔒</div>
        <p style="font-weight:700;margin:8px 0 4px;">タイムカプセル</p>
        <p style="font-size:14px;color:#6B5B95;">${d.openAt ? new Date(d.openAt).toLocaleString('ja-JP', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) : ''} に開封されます</p>
      </div>
    `}

    <div class="puni-reactions" id="reactions">
      <button class="puni-react-btn" data-react="love">💖 <span data-count="love">0</span></button>
      <button class="puni-react-btn" data-react="sparkle">✨ <span data-count="sparkle">0</span></button>
      <button class="puni-react-btn" data-react="calm">🌿 <span data-count="calm">0</span></button>
      <button class="puni-react-btn" data-react="wow">😲 <span data-count="wow">0</span></button>
    </div>

    <div class="puni-share-actions">
      <a href="#" target="_blank" rel="noopener" class="puni-share-btn tw" id="tw-share">𝕏 でシェア</a>
      <a href="#" target="_blank" rel="noopener" class="puni-share-btn line" id="line-share">LINE</a>
      <button class="puni-share-btn" id="copy-share">🔗 コピー</button>
    </div>

    <a href="/" class="puni-cta">
      <span>あなたも作ってみる</span>
      <span class="puni-cta-arrow">→</span>
    </a>
  </div>
</main>

<div id="toast-root" class="puni-toast-root"></div>

<script>
(function() {
  const shareId = ${JSON.stringify(d.shareId)};
  const shareUrl = location.href;

  // シェアURL設定
  const tw = document.getElementById('tw-share');
  const line = document.getElementById('line-share');
  const tweetText = encodeURIComponent('わたしのぷにオーブを見て ✨ #ぷにメモリー');
  const u = encodeURIComponent(shareUrl);
  if (tw) tw.href = 'https://twitter.com/intent/tweet?text=' + tweetText + '&url=' + u;
  if (line) line.href = 'https://social-plugins.line.me/lineit/share?url=' + u;

  // コピー
  document.getElementById('copy-share').addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrl).then(() => toast('リンクをコピーしました ✨'));
  });

  // リアクション
  let reacted = JSON.parse(localStorage.getItem('puni_reacted_' + shareId) || '{}');

  async function loadReactions() {
    try {
      const r = await fetch('/api/share/' + shareId + '/reactions');
      const data = await r.json();
      const reactions = data.reactions || {};
      ['love','sparkle','calm','wow'].forEach(k => {
        const el = document.querySelector('[data-count="' + k + '"]');
        if (el) el.textContent = reactions[k] || 0;
      });
    } catch(e){}
  }

  document.querySelectorAll('.puni-react-btn').forEach(btn => {
    const reaction = btn.dataset.react;
    if (reacted[reaction]) btn.classList.add('reacted');
    btn.addEventListener('click', async () => {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.classList.add('reacted','popping');
      setTimeout(() => btn.classList.remove('popping'), 400);
      try {
        const r = await fetch('/api/share/' + shareId + '/react', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reaction })
        });
        if (r.ok) {
          reacted[reaction] = true;
          localStorage.setItem('puni_reacted_' + shareId, JSON.stringify(reacted));
          loadReactions();
        }
      } finally {
        setTimeout(() => btn.disabled = false, 1500);
      }
    });
  });

  loadReactions();

  function toast(msg) {
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'puni-toast';
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => el.style.opacity = 0, 2200);
    setTimeout(() => el.remove(), 2600);
  }

  // analytics
  fetch('/api/analytics', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ event:'share_page_view', payload:{ shareId } }) }).catch(()=>{});
})();
</script>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}

function rarityLabel(r: string): string {
  return ({ common:'コモン', rare:'レア', epic:'エピック', legendary:'レジェンダリー' } as any)[r] || r
}

function renderOrbInline(d: ShareData): string {
  const size = 240
  const cx = size/2, cy = size/2, r = size*0.42
  const id = 'sh' + Math.random().toString(36).slice(2,6)

  let grad = ''
  switch (d.pattern) {
    case 'sparkle':
      grad = `<radialGradient id="g${id}" cx="40%" cy="35%"><stop offset="0%" stop-color="white" stop-opacity="0.95"/><stop offset="20%" stop-color="${d.color2}"/><stop offset="100%" stop-color="${d.color}"/></radialGradient>`
      break
    case 'nebula':
      grad = `<radialGradient id="g${id}" cx="35%" cy="30%"><stop offset="0%" stop-color="${d.color2}"/><stop offset="60%" stop-color="${d.color}"/><stop offset="100%" stop-color="${d.color}" stop-opacity="0.7"/></radialGradient>`
      break
    case 'marble':
      grad = `<linearGradient id="g${id}"><stop offset="0%" stop-color="${d.color}"/><stop offset="50%" stop-color="${d.color2}"/><stop offset="100%" stop-color="${d.color}"/></linearGradient>`
      break
    case 'glow':
      grad = `<radialGradient id="g${id}"><stop offset="0%" stop-color="${d.color2}" stop-opacity="0.9"/><stop offset="60%" stop-color="${d.color}"/><stop offset="100%" stop-color="${d.color}" stop-opacity="0.6"/></radialGradient>`
      break
    default:
      grad = `<radialGradient id="g${id}"><stop offset="0%" stop-color="${d.color}"/><stop offset="40%" stop-color="${d.color2}" stop-opacity="0.7"/><stop offset="80%" stop-color="${d.color}"/></radialGradient>`
  }

  let sparkles = ''
  if (d.pattern === 'sparkle' || d.rarity === 'legendary') {
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 * i) / 8
      const dist = r * (0.75 + (i % 3) * 0.1)
      sparkles += `<circle cx="${cx + Math.cos(a) * dist}" cy="${cy + Math.sin(a) * dist}" r="${2 + (i%2)}" fill="white" opacity="0.85"/>`
    }
  }

  let ring = ''
  if (d.rarity === 'legendary') {
    ring = `<circle cx="${cx}" cy="${cy}" r="${r * 1.15}" fill="none" stroke="gold" stroke-width="2" opacity="0.8"><animate attributeName="r" values="${r*1.15};${r*1.25};${r*1.15}" dur="2s" repeatCount="indefinite"/></circle>`
  } else if (d.rarity === 'epic') {
    ring = `<circle cx="${cx}" cy="${cy}" r="${r * 1.1}" fill="none" stroke="${d.color2}" stroke-width="1.5" opacity="0.6"/>`
  }

  // 開封前は錠前
  if (!d.opened) {
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="lk${id}"><stop offset="0%" stop-color="#E8DEF5"/><stop offset="100%" stop-color="#C5B5E0"/></radialGradient></defs>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#lk${id})" opacity="0.85"/>
      <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-size="72">🔒</text>
    </svg>`
  }

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${grad}
      <filter id="sh${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="8"/><feOffset dx="0" dy="3"/><feFlood flood-color="${d.color2}" flood-opacity="0.6"/><feComposite in2="SourceAlpha" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    ${ring}
    <g filter="url(#sh${id})">
      <g transform-origin="${cx} ${cy}">
        <animateTransform attributeName="transform" type="scale" values="1,1;1.04,0.96;0.97,1.03;1,1" dur="3.5s" repeatCount="indefinite" additive="sum"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g${id})"/>
        <ellipse cx="${cx - r*0.3}" cy="${cy - r*0.35}" rx="${r*0.32}" ry="${r*0.18}" fill="white" opacity="0.55"/>
        <ellipse cx="${cx - r*0.25}" cy="${cy - r*0.3}" rx="${r*0.16}" ry="${r*0.09}" fill="white" opacity="0.4"/>
        ${sparkles}
      </g>
    </g>
  </svg>`
}

function shareCss(color: string, color2: string): string {
  return `
:root {
  --orb-color: ${color};
  --orb-color2: ${color2};
  --puni-text: #3D2B5C;
  --puni-text-soft: #6B5B95;
  --puni-text-mute: #9D90B8;
  --puni-bg: #FDF6FF;
  --puni-shadow: 0 8px 24px -8px rgba(180, 140, 220, 0.25), 0 2px 8px rgba(180, 140, 220, 0.1);
  --puni-shadow-strong: 0 16px 40px -12px rgba(180, 140, 220, 0.35);
}
* { -webkit-tap-highlight-color: transparent; }
html,body { margin:0; padding:0; font-family:'Zen Maru Gothic','M PLUS Rounded 1c',sans-serif; background:var(--puni-bg); color:var(--puni-text); min-height:100vh; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
button { font-family:inherit; cursor:pointer; }

.puni-bg { position:fixed; inset:0; z-index:-1; background:linear-gradient(160deg, ${color}33 0%, ${color2}33 50%, #F1E5FF 100%); overflow:hidden; }
.puni-blob { position:absolute; border-radius:50%; filter:blur(60px); opacity:0.5; animation:blobFloat 22s ease-in-out infinite; }
.puni-blob-1 { top:-15%; left:-15%; width:500px; height:500px; background:${color}; }
.puni-blob-2 { bottom:-10%; right:-15%; width:550px; height:550px; background:${color2}; animation-delay:-10s; }
@keyframes blobFloat {
  0%,100% { transform:translate(0,0) scale(1); }
  50% { transform:translate(30px,-40px) scale(1.05); }
}

.puni-header { display:flex; justify-content:center; padding:16px; background:rgba(253,246,255,0.6); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
.puni-logo { display:flex; align-items:center; gap:10px; text-decoration:none; color:var(--puni-text); font-weight:900; }
.puni-logo-orb { width:32px; height:32px; border-radius:50%; background:radial-gradient(circle at 35% 30%, ${color}, ${color2} 60%); box-shadow:0 4px 12px ${color2}66, inset -2px -2px 4px rgba(255,255,255,0.6); animation:punyPuny 3s ease-in-out infinite; }
@keyframes punyPuny { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05,0.95); } }

.puni-share-main { max-width:560px; margin:0 auto; padding:20px; }
.puni-share-card { background:white; border-radius:32px; padding:32px 24px 24px; box-shadow:var(--puni-shadow-strong); text-align:center; animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1); border:1px solid rgba(180,140,220,0.08); }
@keyframes popIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }

.puni-share-orb-wrap { display:flex; justify-content:center; margin-bottom:20px; }
.puni-share-orb-wrap > svg { animation:orbFloat 4s ease-in-out infinite; }
@keyframes orbFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }

.puni-share-title { font-size:24px; font-weight:900; margin:0 0 4px; line-height:1.4; word-break:break-word; }
.puni-share-date { color:var(--puni-text-soft); font-size:13px; margin:0 0 16px; }

.puni-share-badges { display:flex; justify-content:center; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
.puni-badge { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:999px; font-weight:700; font-size:13px; }
.puni-badge-emotion { background:linear-gradient(135deg, ${color}, ${color2}); color:white; }
.puni-badge-rarity { color:white; }
.puni-badge-rarity.common { background:#B0BEC5; }
.puni-badge-rarity.rare { background:linear-gradient(135deg,#4FC3F7,#7E57C2); }
.puni-badge-rarity.epic { background:linear-gradient(135deg,#BA68C8,#7E57C2); box-shadow:0 0 16px rgba(186,104,200,0.4); }
.puni-badge-rarity.legendary { background:linear-gradient(135deg,#FFD700,#FFA500,#FF6347); box-shadow:0 0 20px rgba(255,165,0,0.6); animation:shine 2s linear infinite; }
@keyframes shine { 0%,100% { filter:brightness(1); } 50% { filter:brightness(1.2); } }

.puni-share-content {
  background:linear-gradient(135deg, ${color}22, ${color2}22);
  border-radius:22px; padding:18px 20px;
  text-align:left; line-height:1.85; font-size:15px;
  color:var(--puni-text); margin-bottom:20px;
  white-space:pre-wrap; word-wrap:break-word;
  border:1px solid ${color}33;
}
.puni-share-locked {
  background:linear-gradient(135deg,#F5F0FF,#FFF5FA);
  border:2px dashed #E0CCFF;
  border-radius:22px; padding:24px; margin-bottom:20px;
}

.puni-reactions { display:flex; gap:8px; justify-content:center; margin-bottom:20px; flex-wrap:wrap; }
.puni-react-btn {
  background:white; border:2px solid #E8DEF5;
  padding:8px 14px; border-radius:999px;
  font-weight:700; font-size:14px; color:var(--puni-text);
  display:inline-flex; align-items:center; gap:6px;
  transition:all 0.15s;
}
.puni-react-btn:hover { transform:translateY(-2px); border-color:${color2}; }
.puni-react-btn.reacted { background:linear-gradient(135deg,${color}66,${color2}66); border-color:transparent; }
.puni-react-btn.popping { animation:pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes pop { 0% { transform:scale(1); } 50% { transform:scale(1.25); } 100% { transform:scale(1); } }

.puni-share-actions { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-bottom:20px; }
.puni-share-btn {
  background:white; border:2px solid #E8DEF5;
  padding:10px 18px; border-radius:999px;
  font-weight:700; font-size:14px; color:var(--puni-text);
  text-decoration:none; display:inline-flex; align-items:center; gap:6px;
  transition:all 0.15s;
}
.puni-share-btn:hover { transform:translateY(-2px); border-color:${color2}; }
.puni-share-btn.tw { background:#1DA1F2; color:white; border-color:#1DA1F2; }

.puni-cta {
  display:flex; align-items:center; justify-content:center; gap:8px;
  background:linear-gradient(135deg, ${color}, ${color2});
  color:white; text-decoration:none; font-weight:800; font-size:16px;
  padding:16px; border-radius:22px;
  box-shadow:0 8px 20px -4px ${color2}99, inset 0 -3px 6px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.4);
  transition:transform 0.2s;
}
.puni-cta:hover { transform:translateY(-2px); }
.puni-cta:active { transform:scale(0.97); }
.puni-cta-arrow { transition:transform 0.2s; }
.puni-cta:hover .puni-cta-arrow { transform:translateX(4px); }

.puni-toast-root { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); z-index:200; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
.puni-toast { background:rgba(60,40,80,0.92); color:white; padding:12px 20px; border-radius:999px; font-weight:600; font-size:14px; box-shadow:var(--puni-shadow-strong); animation:toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1); transition:opacity 0.3s; }
@keyframes toastIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

@media (max-width:480px) {
  .puni-share-card { padding:24px 18px 20px; border-radius:24px; }
  .puni-share-title { font-size:20px; }
}
`
}
