// メインアプリのHTMLレンダリング
export function renderApp(opts: { error?: string } = {}): string {
  const errorBanner = opts.error ? `
    <div id="error-banner" class="puni-error-banner">
      ${escapeHtmlSimple(opts.error)}
    </div>` : ''

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="#FFD6E8"/>
<title>ぷにメモリー - あなたの"今"をAIが永久保存するぷにぷに思い出カプセル</title>
<meta name="description" content="日々の気持ちをAIが解析して、世界に一つだけのぷにぷにオーブを生成。タイムカプセルとして未来の自分にメッセージも送れる、新感覚の感情記録サービス。"/>
<meta name="keywords" content="ぷにメモリー,日記,タイムカプセル,感情記録,AI,オーブ,コレクション"/>
<meta property="og:title" content="ぷにメモリー｜あなたの今をぷにぷにオーブに変える"/>
<meta property="og:description" content="日々の気持ちがAIでぷにぷにオーブに。コレクションして、過去の自分と再会しよう。"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="/og.svg"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="ぷにメモリー｜あなたの今をぷにぷにオーブに変える"/>
<meta name="twitter:description" content="日々の気持ちがAIでぷにぷにオーブに。コレクションして、過去の自分と再会しよう。"/>
<meta name="twitter:image" content="/og.svg"/>
<link rel="icon" href="/favicon.ico"/>
<link rel="apple-touch-icon" href="/favicon.ico"/>
<link rel="manifest" href="/manifest.json"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=M+PLUS+Rounded+1c:wght@500;700;900&display=swap" rel="stylesheet"/>
<link rel="manifest" href="/manifest.json"/>
<style>${appCss()}</style>
</head>
<body>
${errorBanner}

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
      <button data-tab="create" class="puni-nav-btn active">作る</button>
      <button data-tab="collection" class="puni-nav-btn">図鑑</button>
      <button data-tab="gallery" class="puni-nav-btn">広場</button>
      <button data-tab="stats" class="puni-nav-btn">記録</button>
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
      <p class="puni-hero-sub">AIがあなたの感情を読み取って、世界に一つだけのオーブを生成します。<br/>未来の自分への手紙としても使える、新感覚の"気持ち日記"です ✨</p>
    </div>

    <div class="puni-prompt-card" id="daily-prompt-card" style="display:none;">
      <span class="puni-prompt-label">🌟 今日のお題</span>
      <p class="puni-prompt-text" id="daily-prompt-text">読み込み中…</p>
      <button class="puni-prompt-use" id="use-prompt-btn">このお題で書く</button>
    </div>

    <div class="puni-card puni-form-card">
      <label class="puni-label">タイトル <span class="puni-label-hint">(必須)</span></label>
      <input id="capsule-title" type="text" maxlength="60" placeholder="今日のできごと…" class="puni-input" autocomplete="off"/>
      <div class="puni-counter" id="title-counter">0 / 60</div>

      <label class="puni-label">気持ち・できごと <span class="puni-label-hint">(必須・5〜2000文字)</span></label>
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

        <label class="puni-toggle">
          <input type="checkbox" id="is-public"/>
          <span class="puni-toggle-track"><span class="puni-toggle-thumb"></span></span>
          <span class="puni-toggle-text">🌐 シェアリンクを公開する</span>
        </label>
      </div>

      <button id="create-btn" class="puni-btn puni-btn-primary">
        <span class="puni-btn-text">オーブを生成する</span>
        <span class="puni-btn-spinner" style="display:none;"></span>
      </button>
      <p class="puni-form-note">※ 1時間に20個まで作れます。あなたのデータはあなただけのもの。</p>
    </div>

    <!-- 結果表示エリア -->
    <div id="result-area" style="display:none;"></div>
  </section>

  <!-- COLLECTION TAB -->
  <section id="tab-collection" class="puni-tab">
    <div class="puni-section-head">
      <h2 class="puni-section-title">🌟 あなたのオーブ図鑑</h2>
      <p class="puni-section-sub">これまでに作ったぷにオーブたち</p>
    </div>
    <div class="puni-filter-row">
      <button class="puni-filter-chip active" data-filter="all">すべて</button>
      <button class="puni-filter-chip" data-filter="legendary">レジェンダリー</button>
      <button class="puni-filter-chip" data-filter="epic">エピック</button>
      <button class="puni-filter-chip" data-filter="rare">レア</button>
      <button class="puni-filter-chip" data-filter="locked">未開封</button>
    </div>
    <div id="collection-grid" class="puni-collection-grid">
      <div class="puni-loading">読み込み中…</div>
    </div>

    <div class="puni-section-head" style="margin-top:48px;">
      <h2 class="puni-section-title">🌍 みんなのオーブ</h2>
      <p class="puni-section-sub">公開されているオーブを覗いてみよう</p>
    </div>
    <div id="feed-grid" class="puni-collection-grid">
      <div class="puni-loading">読み込み中…</div>
    </div>
  </section>

  <!-- GALLERY TAB -->
  <section id="tab-gallery" class="puni-tab">
    <div class="puni-section-head">
      <h2 class="puni-section-title">🌈 みんなの広場</h2>
      <p class="puni-section-sub">公開されたぷにオーブをのぞいてみよう</p>
    </div>
    <div class="puni-filter-row">
      <button class="puni-gallery-tab active" data-gallery="recent">🆕 新着</button>
      <button class="puni-gallery-tab" data-gallery="popular">🔥 人気</button>
      <button class="puni-gallery-tab" data-gallery="rare">💎 レア</button>
    </div>
    <div id="gallery-grid" class="puni-collection-grid">
      <div class="puni-loading">読み込み中…</div>
    </div>
  </section>

  <!-- STATS TAB -->
  <section id="tab-stats" class="puni-tab">
    <div class="puni-section-head">
      <h2 class="puni-section-title">📊 あなたの記録</h2>
      <p class="puni-section-sub">心の足あとを見てみよう</p>
    </div>
    <div id="stats-content" class="puni-stats">
      <div class="puni-loading">読み込み中…</div>
    </div>
  </section>

</main>

<!-- サポートCTA -->
<section class="puni-support-cta">
  <div class="puni-support-card">
    <div class="puni-support-emoji">☕</div>
    <h3 class="puni-support-title">ぷにメモリーが気に入ったら</h3>
    <p class="puni-support-text">完全無料で運営中。サーバー代の支援や応援メッセージはとても嬉しいです🌸</p>
    <div class="puni-support-actions">
      <button id="open-support" class="puni-btn-support">💖 開発者を応援する</button>
      <button id="open-share-app" class="puni-btn-support secondary">🐦 友達にシェア</button>
    </div>
  </div>
</section>

<footer class="puni-footer">
  <div class="puni-footer-inner">
    <p class="puni-footer-tag">ぷにメモリー © 2025</p>
    <p class="puni-footer-sub">あなたの"今"をAIが永久保存。</p>
    <div class="puni-footer-links">
      <a href="#" id="privacy-link">プライバシー</a>
      <a href="#" id="about-link">このサービスについて</a>
      <a href="#" id="support-link">支援する</a>
    </div>
  </div>
</footer>

<!-- モーダル: カプセル詳細 -->
<div id="modal-root" class="puni-modal-root" style="display:none;">
  <div class="puni-modal-backdrop"></div>
  <div class="puni-modal-content" id="modal-content"></div>
</div>

<!-- トースト -->
<div id="toast-root" class="puni-toast-root"></div>

<script>${appJs()}</script>
</body>
</html>`
}

function escapeHtmlSimple(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function faviconSvg(): string {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><radialGradient id='g' cx='35%' cy='30%'><stop offset='0%' stop-color='%23FFD6E8'/><stop offset='100%' stop-color='%23FF8FB1'/></radialGradient></defs><circle cx='32' cy='32' r='26' fill='url(%23g)'/><ellipse cx='24' cy='22' rx='8' ry='5' fill='white' opacity='0.6'/></svg>`
}

function appCss(): string {
  return `
:root {
  --puni-pink: #FFD6E8;
  --puni-pink-deep: #FF8FB1;
  --puni-purple: #E0CCFF;
  --puni-purple-deep: #B69BFF;
  --puni-blue: #C8E6FF;
  --puni-blue-deep: #8AB8FF;
  --puni-mint: #C7F0DB;
  --puni-yellow: #FFF1B8;
  --puni-text: #3D2B5C;
  --puni-text-soft: #6B5B95;
  --puni-text-mute: #9D90B8;
  --puni-bg: #FDF6FF;
  --puni-card: #ffffff;
  --puni-shadow: 0 8px 24px -8px rgba(180, 140, 220, 0.25), 0 2px 8px rgba(180, 140, 220, 0.1);
  --puni-shadow-strong: 0 16px 40px -12px rgba(180, 140, 220, 0.35), 0 4px 16px rgba(180, 140, 220, 0.15);
  --radius-sm: 14px;
  --radius: 22px;
  --radius-lg: 32px;
}

* { -webkit-tap-highlight-color: transparent; }

html, body {
  margin: 0; padding: 0;
  font-family: 'Zen Maru Gothic','M PLUS Rounded 1c','Hiragino Maru Gothic ProN','Hiragino Sans',-apple-system,sans-serif;
  background: var(--puni-bg);
  color: var(--puni-text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

button { font-family: inherit; cursor: pointer; }
input, textarea { font-family: inherit; }

/* 背景ぼやぼや */
.puni-bg {
  position: fixed; inset: 0; z-index: -1;
  background: linear-gradient(160deg, #FFE5F1 0%, #E5F1FF 50%, #F1E5FF 100%);
  overflow: hidden;
}
.puni-blob {
  position: absolute; border-radius: 50%;
  filter: blur(60px); opacity: 0.5;
  animation: blobFloat 20s ease-in-out infinite;
}
.puni-blob-1 { top: -10%; left: -10%; width: 400px; height: 400px; background: var(--puni-pink); }
.puni-blob-2 { top: 40%; right: -10%; width: 500px; height: 500px; background: var(--puni-purple); animation-delay: -7s; }
.puni-blob-3 { bottom: -10%; left: 30%; width: 450px; height: 450px; background: var(--puni-blue); animation-delay: -14s; }
@keyframes blobFloat {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px,-50px) scale(1.05); }
  66% { transform: translate(-20px,30px) scale(0.95); }
}
.puni-md-only { display: none; }
@media (min-width: 768px) { .puni-md-only { display: inline; } }

/* エラーバナー */
.puni-error-banner {
  position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
  background: white; border: 2px solid #FFB3B3;
  color: #C0392B; padding: 10px 18px; border-radius: 999px;
  font-weight: 700; box-shadow: var(--puni-shadow);
  z-index: 200; font-size: 14px;
}

/* ヘッダー */
.puni-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(253, 246, 255, 0.85);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border-bottom: 1px solid rgba(180, 140, 220, 0.12);
}
.puni-header-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 12px 20px;
  display: flex; justify-content: space-between; align-items: center;
  gap: 12px;
}
.puni-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; color: var(--puni-text);
  font-weight: 900; font-size: 18px;
}
.puni-logo-orb {
  width: 32px; height: 32px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #FFD6E8, #FF8FB1 60%, #B69BFF);
  box-shadow: 0 4px 12px rgba(255,143,177,0.4), inset -2px -2px 4px rgba(255,255,255,0.6);
  animation: punyPuny 3s ease-in-out infinite;
}
@keyframes punyPuny {
  0%,100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.06,0.94) rotate(-1deg); }
  75% { transform: scale(0.97,1.03) rotate(1deg); }
}
.puni-logo-text { letter-spacing: -0.02em; }

.puni-nav { display: flex; gap: 4px; background: white; padding: 4px; border-radius: 999px; box-shadow: var(--puni-shadow); }
.puni-nav-btn {
  border: none; background: transparent;
  padding: 8px 16px; border-radius: 999px;
  font-weight: 700; color: var(--puni-text-soft);
  font-size: 14px; transition: all 0.2s;
}
.puni-nav-btn.active {
  background: linear-gradient(135deg, #FFB3D9, #B69BFF);
  color: white; box-shadow: 0 4px 12px rgba(182,155,255,0.4);
}
@media (max-width: 480px) {
  .puni-nav-btn { padding: 7px 12px; font-size: 13px; }
}

/* メイン */
.puni-main {
  max-width: 1100px; margin: 0 auto;
  padding: 24px 20px 80px;
}

.puni-tab { display: none; animation: fadeUp 0.4s ease; }
.puni-tab-active { display: block; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ヒーロー */
.puni-hero { text-align: center; padding: 32px 0 24px; position: relative; }
.puni-hero-orbs { display: flex; justify-content: center; gap: 18px; margin-bottom: 18px; pointer-events: none; }
.puni-hero-orb {
  width: 64px; height: 64px; border-radius: 50%;
  position: relative;
  box-shadow: 0 8px 20px -4px rgba(180,140,220,0.4), inset -4px -6px 10px rgba(0,0,0,0.05), inset 3px 4px 8px rgba(255,255,255,0.6);
  animation: heroFloat 4s ease-in-out infinite;
}
.puni-hero-orb::before {
  content: ''; position: absolute; top: 18%; left: 22%;
  width: 32%; height: 22%; border-radius: 50%;
  background: rgba(255,255,255,0.7); filter: blur(1px);
}
.puni-hero-orb-1 { background: radial-gradient(circle at 35% 30%, #FFD6E8, #FF8FB1 60%, #B69BFF); animation-delay: 0s; }
.puni-hero-orb-2 { background: radial-gradient(circle at 35% 30%, #FFF, #C8E6FF 30%, #8AB8FF 80%); animation-delay: -1.3s; transform: translateY(-8px); }
.puni-hero-orb-3 { background: radial-gradient(circle at 35% 30%, #FFF1B8, #FFD93D 50%, #FF8FB1); animation-delay: -2.6s; }
@keyframes heroFloat {
  0%,100% { transform: translateY(0) scale(1,1); }
  25% { transform: translateY(-6px) scale(1.04,0.96); }
  75% { transform: translateY(4px) scale(0.97,1.03); }
}
@media (max-width: 480px) {
  .puni-hero-orb { width: 52px; height: 52px; }
}
.puni-hero-title {
  font-size: clamp(28px, 6vw, 44px);
  font-weight: 900; line-height: 1.3;
  letter-spacing: -0.02em; margin: 0 0 16px;
}
.puni-grad-text {
  background: linear-gradient(135deg, #FF8FB1 0%, #B69BFF 50%, #8AB8FF 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent;
}
.puni-hero-sub {
  font-size: clamp(14px, 2.5vw, 16px);
  color: var(--puni-text-soft); margin: 0;
  line-height: 1.7;
}

/* カード */
.puni-card {
  background: var(--puni-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--puni-shadow);
  border: 1px solid rgba(180,140,220,0.08);
}
@media (max-width: 480px) { .puni-card { padding: 18px; border-radius: var(--radius); } }

.puni-form-card { max-width: 640px; margin: 0 auto; }

.puni-prompt-card {
  max-width: 640px; margin: 0 auto 16px;
  background: linear-gradient(135deg, #FFF1B8, #FFD6E8);
  border-radius: var(--radius); padding: 16px 20px;
  display: flex; flex-direction: column; gap: 8px;
  box-shadow: var(--puni-shadow);
  border: 2px dashed rgba(180,140,220,0.25);
  position: relative;
}
.puni-prompt-label { font-size: 12px; font-weight: 700; color: #B68C5C; }
.puni-prompt-text { font-size: 16px; font-weight: 700; color: var(--puni-text); margin: 0; line-height: 1.5; }
.puni-prompt-use {
  align-self: flex-end;
  background: white; border: 2px solid #FFB3D9;
  padding: 6px 14px; border-radius: 999px;
  font-weight: 700; color: var(--puni-text); font-size: 13px;
}
.puni-prompt-use:hover { background: #FFE5F1; }

.puni-gallery-tab {
  flex-shrink: 0; border: 2px solid #E8DEF5; background: white;
  padding: 6px 14px; border-radius: 999px;
  font-size: 13px; font-weight: 700; color: var(--puni-text-soft);
}
.puni-gallery-tab.active { background: linear-gradient(135deg,#FFB3D9,#B69BFF); color: white; border-color: transparent; }

.puni-label { display: block; font-weight: 700; font-size: 14px; color: var(--puni-text); margin: 8px 0 6px; }
.puni-label-hint { color: var(--puni-text-mute); font-weight: 500; font-size: 12px; }
.puni-label-sm { display: block; font-size: 13px; font-weight: 600; color: var(--puni-text-soft); margin: 8px 0 6px; }

.puni-input, .puni-textarea {
  width: 100%; box-sizing: border-box;
  background: #FAFAFC;
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-size: 16px; color: var(--puni-text);
  transition: all 0.2s;
  outline: none;
}
.puni-input:focus, .puni-textarea:focus {
  background: white;
  border-color: var(--puni-pink-deep);
  box-shadow: 0 0 0 4px rgba(255,143,177,0.12);
}
.puni-textarea { min-height: 120px; resize: vertical; line-height: 1.6; }
.puni-input-sm { padding: 10px 14px; font-size: 14px; }

.puni-counter {
  text-align: right; font-size: 12px; color: var(--puni-text-mute);
  margin-top: 4px; margin-bottom: 8px;
}

/* オプション */
.puni-options { margin: 16px 0 8px; display: flex; flex-direction: column; gap: 10px; }
.puni-toggle {
  display: flex; align-items: center; gap: 12px;
  cursor: pointer; user-select: none;
  padding: 8px 4px;
}
.puni-toggle input { display: none; }
.puni-toggle-track {
  width: 44px; height: 26px; border-radius: 999px;
  background: #E8DEF5; position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}
.puni-toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 20px; height: 20px; border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.puni-toggle input:checked + .puni-toggle-track { background: linear-gradient(135deg, #FFB3D9, #B69BFF); }
.puni-toggle input:checked + .puni-toggle-track .puni-toggle-thumb { transform: translateX(18px); }
.puni-toggle-text { font-weight: 600; color: var(--puni-text); font-size: 15px; }

.puni-timecapsule-options {
  background: linear-gradient(135deg, #FFF5FA, #F5F0FF);
  border-radius: var(--radius-sm);
  padding: 14px; margin: 4px 0 8px;
}
.puni-chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.puni-chip {
  border: 2px solid #E8DEF5; background: white;
  padding: 6px 14px; border-radius: 999px;
  font-size: 13px; font-weight: 600; color: var(--puni-text-soft);
  transition: all 0.15s;
}
.puni-chip.active {
  background: linear-gradient(135deg, #FFB3D9, #B69BFF);
  color: white; border-color: transparent;
}

/* ボタン */
.puni-btn {
  width: 100%; border: none;
  padding: 16px 24px;
  border-radius: var(--radius);
  font-weight: 800; font-size: 16px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 8px;
  position: relative; overflow: hidden;
}
.puni-btn-primary {
  background: linear-gradient(135deg, #FF8FB1 0%, #B69BFF 50%, #8AB8FF 100%);
  color: white;
  box-shadow: 0 8px 20px -4px rgba(182,155,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.4);
}
.puni-btn-primary:active { transform: scale(0.97); box-shadow: 0 4px 10px -2px rgba(182,155,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.05); }
.puni-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -4px rgba(182,155,255,0.6), inset 0 -3px 6px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.4); }
.puni-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.puni-btn-spinner {
  width: 18px; height: 18px;
  border: 3px solid rgba(255,255,255,0.4); border-top-color: white;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.puni-btn-secondary {
  background: white; color: var(--puni-text);
  border: 2px solid #E8DEF5;
  box-shadow: var(--puni-shadow);
}
.puni-btn-secondary:hover { border-color: #B69BFF; }

.puni-btn-icon {
  width: auto; padding: 10px 16px; font-size: 14px;
  background: white; color: var(--puni-text);
  border: 2px solid #E8DEF5;
}

.puni-form-note {
  font-size: 12px; color: var(--puni-text-mute);
  text-align: center; margin: 12px 0 0; line-height: 1.6;
}

/* 結果カード */
.puni-result-card {
  margin-top: 24px;
  background: white; border-radius: var(--radius-lg);
  padding: 32px 24px; text-align: center;
  box-shadow: var(--puni-shadow-strong);
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative; overflow: hidden;
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
.puni-result-orb-wrap { display: flex; justify-content: center; margin: 8px 0 20px; }
.puni-result-orb { animation: orbFloat 4s ease-in-out infinite; }
@keyframes orbFloat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.puni-result-title { font-size: 22px; font-weight: 800; margin: 0 0 6px; }
.puni-result-sub { color: var(--puni-text-soft); font-size: 14px; margin: 0 0 18px; }
.puni-result-badges { display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.puni-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 999px;
  font-weight: 700; font-size: 13px;
}
.puni-badge-emotion { background: linear-gradient(135deg, #FFD6E8, #E0CCFF); color: var(--puni-text); }
.puni-badge-rarity { color: white; }
.puni-badge-rarity.common { background: #B0BEC5; }
.puni-badge-rarity.rare { background: linear-gradient(135deg, #4FC3F7, #7E57C2); }
.puni-badge-rarity.epic { background: linear-gradient(135deg, #BA68C8, #7E57C2); box-shadow: 0 0 16px rgba(186,104,200,0.4); }
.puni-badge-rarity.legendary {
  background: linear-gradient(135deg, #FFD700, #FFA500, #FF6347);
  box-shadow: 0 0 20px rgba(255,165,0,0.6);
  animation: legendShine 2s linear infinite;
}
@keyframes legendShine { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.2); } }

.puni-share-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 16px; }
.puni-share-btn {
  background: white; border: 2px solid #E8DEF5;
  padding: 10px 18px; border-radius: 999px;
  font-weight: 700; font-size: 14px; color: var(--puni-text);
  display: inline-flex; align-items: center; gap: 6px;
  transition: all 0.15s;
}
.puni-share-btn:hover { border-color: #B69BFF; transform: translateY(-2px); }
.puni-share-btn.tw { background: #1DA1F2; color: white; border-color: #1DA1F2; }
.puni-share-btn.line { background: #06C755; color: white; border-color: #06C755; }

/* セクションヘッド */
.puni-section-head { text-align: center; margin: 16px 0 24px; }
.puni-section-title { font-size: 24px; font-weight: 900; margin: 0 0 4px; }
.puni-section-sub { color: var(--puni-text-soft); font-size: 14px; margin: 0; }

/* フィルタ */
.puni-filter-row {
  display: flex; gap: 6px; margin-bottom: 16px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  padding: 4px; scrollbar-width: none;
}
.puni-filter-row::-webkit-scrollbar { display: none; }
.puni-filter-chip {
  flex-shrink: 0; border: 2px solid #E8DEF5; background: white;
  padding: 6px 14px; border-radius: 999px;
  font-size: 13px; font-weight: 700; color: var(--puni-text-soft);
}
.puni-filter-chip.active { background: linear-gradient(135deg,#FFB3D9,#B69BFF); color: white; border-color: transparent; }

/* コレクション */
.puni-collection-grid {
  display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
@media (min-width: 768px) {
  .puni-collection-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
}
.puni-orb-card {
  background: white; border-radius: var(--radius);
  padding: 16px 12px; text-align: center;
  box-shadow: var(--puni-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer; position: relative;
  border: 1px solid rgba(180,140,220,0.08);
}
.puni-orb-card:hover { transform: translateY(-4px); box-shadow: var(--puni-shadow-strong); }
.puni-orb-card .orb-img { width: 88px; height: 88px; margin: 4px auto 8px; }
.puni-orb-card .orb-title {
  font-size: 13px; font-weight: 700; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.puni-orb-card .orb-date { font-size: 11px; color: var(--puni-text-mute); margin: 2px 0 0; }
.puni-orb-card .orb-locked-overlay {
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(4px);
  border-radius: var(--radius);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: var(--puni-text-soft);
}
.puni-orb-card.legendary { border-color: #FFD700; }
.puni-orb-card.legendary::before {
  content: ''; position: absolute; inset: -1px;
  border-radius: var(--radius);
  padding: 2px;
  background: linear-gradient(135deg, #FFD700, #FF6347, #FFD700);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
.puni-orb-card.epic { border-color: #BA68C8; }

.puni-empty {
  text-align: center; padding: 60px 20px;
  color: var(--puni-text-soft); font-size: 14px;
}
.puni-empty-icon { font-size: 48px; margin-bottom: 12px; }

/* 統計 */
.puni-stats { display: grid; gap: 16px; }
.puni-stat-card {
  background: white; border-radius: var(--radius);
  padding: 20px; box-shadow: var(--puni-shadow);
}
.puni-stat-num {
  font-size: 36px; font-weight: 900;
  background: linear-gradient(135deg,#FF8FB1,#B69BFF);
  -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent;
  line-height: 1;
}
.puni-stat-label { font-size: 13px; color: var(--puni-text-soft); font-weight: 600; margin-top: 4px; }
.puni-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 480px) { .puni-stats-grid { grid-template-columns: repeat(2, 1fr); } }

.puni-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.puni-bar-label { width: 80px; font-size: 13px; font-weight: 600; color: var(--puni-text); }
.puni-bar-track { flex: 1; height: 12px; background: #F0E8FA; border-radius: 999px; overflow: hidden; }
.puni-bar-fill { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
.puni-bar-num { width: 32px; text-align: right; font-size: 12px; color: var(--puni-text-mute); font-weight: 700; }

/* 図鑑系プログレス */
.puni-rarity-badges { display: flex; flex-wrap: wrap; gap: 8px; }
.puni-rarity-badge {
  background: white; border-radius: 999px;
  padding: 6px 12px; font-size: 12px; font-weight: 700;
  border: 2px solid #E8DEF5;
}

/* ローディング */
.puni-loading { text-align: center; padding: 40px; color: var(--puni-text-soft); font-size: 14px; }

/* サポートCTA */
.puni-support-cta {
  max-width: 720px; margin: 60px auto 0; padding: 0 20px;
}
.puni-support-card {
  background: linear-gradient(135deg, #FFF1F8, #F1EAFF);
  border-radius: var(--radius-lg);
  padding: 28px 24px; text-align: center;
  box-shadow: var(--puni-shadow);
  border: 1.5px solid rgba(255,255,255,0.8);
}
.puni-support-emoji { font-size: 38px; margin-bottom: 6px; }
.puni-support-title { font-size: 18px; font-weight: 900; margin: 0 0 6px; color: var(--puni-text); }
.puni-support-text { font-size: 13px; color: var(--puni-text-soft); margin: 0 0 16px; line-height: 1.6; }
.puni-support-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.puni-btn-support {
  background: linear-gradient(180deg, #FF9FC5, #FF6BA8);
  color: white; border: none; border-radius: 999px;
  padding: 12px 22px; font-weight: 800; font-size: 14px;
  box-shadow: 0 4px 0 rgba(220,80,140,0.25), 0 6px 14px rgba(255,107,168,0.3), inset 0 -2px 4px rgba(0,0,0,0.06);
  transition: transform .15s cubic-bezier(.34,1.56,.64,1);
}
.puni-btn-support:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(220,80,140,0.25), 0 2px 6px rgba(255,107,168,0.2); }
.puni-btn-support.secondary {
  background: linear-gradient(180deg, #B5EAEA, #6FCFCF);
  box-shadow: 0 4px 0 rgba(80,180,180,0.25), 0 6px 14px rgba(120,210,210,0.3), inset 0 -2px 4px rgba(0,0,0,0.06);
}

/* フッター */
.puni-footer {
  border-top: 1px solid rgba(180,140,220,0.12);
  background: rgba(255,255,255,0.5);
  margin-top: 40px;
}
.puni-footer-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 24px 20px;
  text-align: center;
}
.puni-footer-tag { font-weight: 800; margin: 0 0 4px; color: var(--puni-text); }
.puni-footer-sub { color: var(--puni-text-soft); font-size: 13px; margin: 0 0 12px; }
.puni-footer-links { display: flex; justify-content: center; gap: 16px; }
.puni-footer-links a { color: var(--puni-text-mute); font-size: 12px; text-decoration: none; }
.puni-footer-links a:hover { color: var(--puni-text-soft); }

/* モーダル */
.puni-modal-root {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.puni-modal-backdrop {
  position: absolute; inset: 0;
  background: rgba(60,40,80,0.5);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.puni-modal-content {
  position: relative; z-index: 1;
  background: white; border-radius: var(--radius-lg);
  padding: 28px 24px;
  width: 100%; max-width: 500px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: var(--puni-shadow-strong);
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.puni-modal-close {
  position: absolute; top: 14px; right: 14px;
  width: 32px; height: 32px; border-radius: 50%;
  border: none; background: #F0E8FA;
  font-size: 18px; color: var(--puni-text-soft);
}

/* トースト */
.puni-toast-root {
  position: fixed; bottom: 24px; left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex; flex-direction: column; gap: 8px;
  pointer-events: none;
}
.puni-toast {
  background: rgba(60,40,80,0.92);
  color: white; padding: 12px 20px;
  border-radius: 999px;
  font-weight: 600; font-size: 14px;
  box-shadow: var(--puni-shadow-strong);
  animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.puni-toast.error { background: #C0392B; }
.puni-toast.success { background: linear-gradient(135deg,#FF8FB1,#B69BFF); }

/* タイムカプセルカウントダウン */
.puni-countdown {
  display: inline-flex; gap: 8px; align-items: baseline;
  background: linear-gradient(135deg, #FFF5FA, #F5F0FF);
  padding: 14px 18px; border-radius: var(--radius);
  margin: 12px 0;
}
.puni-countdown-num { font-size: 22px; font-weight: 900; color: var(--puni-text); }
.puni-countdown-label { font-size: 12px; color: var(--puni-text-soft); }
`
}

function appJs(): string {
  return `
(function() {
'use strict';

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

// アナリティクス送信
function track(event, payload) {
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload })
    }).catch(()=>{});
  } catch(e){}
}

// トースト
function toast(msg, type='') {
  const root = $('#toast-root');
  const el = document.createElement('div');
  el.className = 'puni-toast ' + type;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = 0; el.style.transition='opacity 0.3s'; }, 2200);
  setTimeout(() => el.remove(), 2600);
}

// タブ切替
$$('.puni-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    $$('.puni-nav-btn').forEach(b => b.classList.toggle('active', b === btn));
    $$('.puni-tab').forEach(t => t.classList.toggle('puni-tab-active', t.id === 'tab-' + tab));
    track('tab_change', { tab });
    if (tab === 'collection') loadCollection();
    if (tab === 'gallery') loadGallery();
    if (tab === 'stats') loadStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// お題ロード
(async function loadPrompt() {
  try {
    const r = await fetch('/api/daily-prompt');
    const d = await r.json();
    const card = $('#daily-prompt-card');
    $('#daily-prompt-text').textContent = d.prompt;
    card.style.display = '';
    $('#use-prompt-btn').addEventListener('click', () => {
      titleInput.value = d.prompt.replace(/[？?]$/, '');
      titleInput.dispatchEvent(new Event('input'));
      contentInput.focus();
      track('prompt_used', { date: d.date });
    });
  } catch(e){}
})();

// ギャラリー
let galleryTab = 'recent';
async function loadGallery() {
  const grid = $('#gallery-grid');
  grid.innerHTML = '<div class="puni-loading">読み込み中…</div>';
  try {
    const r = await fetch('/api/gallery?tab=' + galleryTab);
    const d = await r.json();
    if (!d.items || !d.items.length) {
      grid.innerHTML = '<div class="puni-empty"><div class="puni-empty-icon">🌌</div>まだ公開オーブがないよ。<br>あなたが最初に公開してみない？</div>';
      return;
    }
    grid.innerHTML = d.items.map(item => \`
      <a class="puni-orb-card \${item.orb.rarity}" href="/c/\${item.shareId}" target="_blank" rel="noopener">
        <div class="orb-img">\${orbSvgInline(item.orb).replace('width="200" height="200"','width="88" height="88"')}</div>
        <p class="orb-title">\${escapeHtml(item.title)}</p>
        <p class="orb-date">\${item.emotionEmoji} 💗\${item.reactions || 0}</p>
      </a>
    \`).join('');
  } catch(e) {
    grid.innerHTML = '<div class="puni-empty">読み込みに失敗しました</div>';
  }
}
$$('.puni-gallery-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    galleryTab = btn.dataset.gallery;
    $$('.puni-gallery-tab').forEach(b => b.classList.toggle('active', b === btn));
    loadGallery();
    track('gallery_tab', { tab: galleryTab });
  });
});

// 入力カウンター
const titleInput = $('#capsule-title');
const contentInput = $('#capsule-content');
titleInput.addEventListener('input', () => {
  $('#title-counter').textContent = titleInput.value.length + ' / 60';
});
contentInput.addEventListener('input', () => {
  $('#content-counter').textContent = contentInput.value.length + ' / 2000';
});

// タイムカプセルトグル
const tcToggle = $('#is-timecapsule');
tcToggle.addEventListener('change', () => {
  $('#timecapsule-options').style.display = tcToggle.checked ? '' : 'none';
});

// チップ選択
let selectedDays = null;
let customOpenAt = null;
$$('.puni-chip[data-days]').forEach(chip => {
  chip.addEventListener('click', () => {
    $$('.puni-chip[data-days]').forEach(c => c.classList.toggle('active', c === chip));
    if (chip.dataset.days === 'custom') {
      $('#open-at-input').style.display = '';
      selectedDays = 'custom';
    } else {
      $('#open-at-input').style.display = 'none';
      selectedDays = parseInt(chip.dataset.days);
      customOpenAt = null;
    }
  });
});
$('#open-at-input').addEventListener('change', e => {
  customOpenAt = new Date(e.target.value).getTime();
});

// 作成ボタン
const createBtn = $('#create-btn');
createBtn.addEventListener('click', async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (title.length < 1) { toast('タイトルを入力してね', 'error'); return; }
  if (content.length < 5) { toast('5文字以上書いてね', 'error'); return; }

  let openAt = null;
  if (tcToggle.checked) {
    if (selectedDays === 'custom') {
      if (!customOpenAt || customOpenAt <= Date.now()) { toast('未来の日付を選んでね', 'error'); return; }
      openAt = customOpenAt;
    } else if (typeof selectedDays === 'number') {
      openAt = Date.now() + selectedDays * 24 * 60 * 60 * 1000;
    } else {
      toast('開封タイミングを選んでね', 'error'); return;
    }
  }

  setLoading(true);
  track('create_attempt', { hasOpenAt: !!openAt, isPublic: $('#is-public').checked, length: content.length });

  try {
    const res = await fetch('/api/capsules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, content, openAt,
        isPublic: $('#is-public').checked
      })
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || '生成に失敗しました', 'error');
      track('create_error', { status: res.status });
      return;
    }
    track('create_success', { emotion: data.emotion, rarity: data.orb.rarity });
    showResult(data);
    titleInput.value = ''; contentInput.value = '';
    $('#title-counter').textContent = '0 / 60';
    $('#content-counter').textContent = '0 / 2000';
  } catch(e) {
    console.error(e);
    toast('通信エラー', 'error');
  } finally {
    setLoading(false);
  }
});

function setLoading(b) {
  createBtn.disabled = b;
  $('#create-btn .puni-btn-text').textContent = b ? '生成中…' : 'オーブを生成する';
  $('#create-btn .puni-btn-spinner').style.display = b ? '' : 'none';
}

// 結果表示
function showResult(d) {
  const area = $('#result-area');
  const isLocked = !d.opened && d.openAt;
  const orbHtml = isLocked ? lockedOrbHtml() : orbSvgInline(d.orb);
  const openAtStr = d.openAt ? new Date(d.openAt).toLocaleString('ja-JP', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '';
  const shareUrl = location.origin + '/c/' + d.shareId;
  const rarityLine = ({legendary:'🌟 LEGENDARY が出た！',epic:'💜 EPIC オーブ！',rare:'💎 RARE オーブ！',common:''})[d.orb.rarity] || '';
  const baseText = isLocked ? '未来のわたしへ手紙を書いた 💌' : 'わたしの今日のぷにオーブができた ✨';
  const shareText = encodeURIComponent((rarityLine ? rarityLine + '\\n' : '') + baseText + ' #ぷにメモリー');

  // レジェンダリー時は紙吹雪
  if (d.orb.rarity === 'legendary' || d.orb.rarity === 'epic') {
    confetti(d.orb.color, d.orb.color2);
  }

  area.innerHTML = \`
    <div class="puni-result-card">
      <div class="puni-result-orb-wrap"><div class="puni-result-orb">\${orbHtml}</div></div>
      <h3 class="puni-result-title">\${escapeHtml(d.title)}</h3>
      <p class="puni-result-sub">\${isLocked ? '🔒 タイムカプセルとして保存しました' : 'オーブが生成されました ✨'}</p>
      <div class="puni-result-badges">
        <span class="puni-badge puni-badge-emotion">\${d.emotionEmoji} \${escapeHtml(d.emotionLabel)}</span>
        <span class="puni-badge puni-badge-rarity \${d.orb.rarity}">\${rarityLabel(d.orb.rarity)}</span>
      </div>
      \${isLocked ? \`<div class="puni-countdown"><span class="puni-countdown-label">開封予定:</span><span class="puni-countdown-num">\${openAtStr}</span></div>\` : ''}
      <div class="puni-share-row">
        <button class="puni-share-btn" data-copy-url="\${escapeHtml(shareUrl)}">🔗 リンクをコピー</button>
        <a class="puni-share-btn tw" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=\${shareText}&url=\${encodeURIComponent(shareUrl)}">𝕏 でシェア</a>
        <a class="puni-share-btn line" target="_blank" rel="noopener" href="https://social-plugins.line.me/lineit/share?url=\${encodeURIComponent(shareUrl)}">LINEでシェア</a>
      </div>
    </div>
  \`;
  area.style.display = '';
  area.querySelector('[data-copy-url]').addEventListener('click', function(e) {
    const url = e.currentTarget.getAttribute('data-copy-url');
    navigator.clipboard.writeText(url).then(() => toast('リンクをコピーしたよ ✨','success'));
  });
  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener('puni-toast', e => toast(e.detail, 'success'));

// シンプルなSVGオーブインライン
function orbSvgInline(orb) {
  const size = 200;
  const cx = size/2, cy = size/2, r = size*0.42;
  const id = Math.random().toString(36).slice(2,8);
  let grad;
  if (orb.pattern === 'sparkle') {
    grad = \`<radialGradient id="g\${id}" cx="40%" cy="35%"><stop offset="0%" stop-color="white" stop-opacity="0.95"/><stop offset="20%" stop-color="\${orb.color2}"/><stop offset="100%" stop-color="\${orb.color}"/></radialGradient>\`;
  } else if (orb.pattern === 'nebula') {
    grad = \`<radialGradient id="g\${id}" cx="35%" cy="30%"><stop offset="0%" stop-color="\${orb.color2}"/><stop offset="60%" stop-color="\${orb.color}"/><stop offset="100%" stop-color="\${orb.color}" stop-opacity="0.7"/></radialGradient>\`;
  } else if (orb.pattern === 'marble') {
    grad = \`<linearGradient id="g\${id}"><stop offset="0%" stop-color="\${orb.color}"/><stop offset="50%" stop-color="\${orb.color2}"/><stop offset="100%" stop-color="\${orb.color}"/></linearGradient>\`;
  } else if (orb.pattern === 'glow') {
    grad = \`<radialGradient id="g\${id}"><stop offset="0%" stop-color="\${orb.color2}" stop-opacity="0.9"/><stop offset="60%" stop-color="\${orb.color}"/><stop offset="100%" stop-color="\${orb.color}" stop-opacity="0.6"/></radialGradient>\`;
  } else {
    grad = \`<radialGradient id="g\${id}"><stop offset="0%" stop-color="\${orb.color}"/><stop offset="40%" stop-color="\${orb.color2}" stop-opacity="0.7"/><stop offset="80%" stop-color="\${orb.color}"/></radialGradient>\`;
  }
  let sparkles = '';
  if (orb.pattern === 'sparkle' || orb.rarity === 'legendary') {
    for (let i=0;i<6;i++) {
      const a = Math.PI*2*i/6;
      const d = r*(0.8+Math.random()*0.3);
      sparkles += \`<circle cx="\${cx+Math.cos(a)*d}" cy="\${cy+Math.sin(a)*d}" r="2" fill="white" opacity="0.85"/>\`;
    }
  }
  let ring = '';
  if (orb.rarity === 'legendary') {
    ring = \`<circle cx="\${cx}" cy="\${cy}" r="\${r*1.15}" fill="none" stroke="gold" stroke-width="1.5" opacity="0.8"><animate attributeName="r" values="\${r*1.15};\${r*1.25};\${r*1.15}" dur="2s" repeatCount="indefinite"/></circle>\`;
  }
  return \`<svg viewBox="0 0 \${size} \${size}" width="\${size}" height="\${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>\${grad}<filter id="sh\${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="6"/><feOffset dx="0" dy="2"/><feFlood flood-color="\${orb.color2}" flood-opacity="0.6"/><feComposite in2="SourceAlpha" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    \${ring}
    <g filter="url(#sh\${id})"><g><animateTransform attributeName="transform" type="scale" values="1,1;1.04,0.96;0.97,1.03;1,1" dur="3s" repeatCount="indefinite" additive="sum"/>
    <circle cx="\${cx}" cy="\${cy}" r="\${r}" fill="url(#g\${id})"/>
    <ellipse cx="\${cx-r*0.3}" cy="\${cy-r*0.35}" rx="\${r*0.32}" ry="\${r*0.18}" fill="white" opacity="0.55"/>
    \${sparkles}</g></g>
  </svg>\`;
}
function lockedOrbHtml() {
  return \`<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="lk"><stop offset="0%" stop-color="#E8DEF5"/><stop offset="100%" stop-color="#C5B5E0"/></radialGradient></defs>
    <circle cx="100" cy="100" r="84" fill="url(#lk)" opacity="0.85"/>
    <text x="100" y="120" text-anchor="middle" font-size="64">🔒</text>
  </svg>\`;
}

function rarityLabel(r) {
  return ({common:'コモン',rare:'レア',epic:'エピック',legendary:'レジェンダリー'})[r] || r;
}

function confetti(c1, c2) {
  const colors = [c1, c2, '#FFD93D', '#FF8FB1', '#B69BFF', '#8AB8FF'];
  const n = 80;
  const root = document.body;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    const c = colors[i % colors.length];
    el.style.cssText = 'position:fixed;left:'+(50+(Math.random()-0.5)*60)+'%;top:30%;width:'+(6+Math.random()*8)+'px;height:'+(8+Math.random()*10)+'px;background:'+c+';border-radius:'+(Math.random()>0.5?'50%':'2px')+';pointer-events:none;z-index:300;';
    const dx = (Math.random()-0.5)*600;
    const dy = 400+Math.random()*400;
    const rot = Math.random()*720;
    el.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: 'translate('+dx+'px,'+dy+'px) rotate('+rot+'deg)', opacity: 0 }
    ], { duration: 1500+Math.random()*1000, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' });
    root.appendChild(el);
    setTimeout(() => el.remove(), 2700);
  }
}
function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// === コレクション ===
let allItems = [];
let currentFilter = 'all';

async function loadCollection() {
  const grid = $('#collection-grid');
  grid.innerHTML = '<div class="puni-loading">読み込み中…</div>';
  try {
    const res = await fetch('/api/capsules');
    const data = await res.json();
    allItems = data.items || [];
    renderCollection();
  } catch(e) {
    grid.innerHTML = '<div class="puni-empty">読み込みに失敗しました</div>';
  }
  loadFeed();
}

async function loadFeed() {
  const grid = $('#feed-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="puni-loading">読み込み中…</div>';
  try {
    const res = await fetch('/api/feed?limit=12');
    const data = await res.json();
    const items = data.items || [];
    if (!items.length) {
      grid.innerHTML = '<div class="puni-empty">まだ公開オーブがないよ。最初のひとつになろう！</div>';
      return;
    }
    grid.innerHTML = items.map(function(item) {
      return '<a href="/c/' + item.shareId + '" class="puni-orb-card ' + item.orb.rarity + '" style="text-decoration:none;color:inherit;display:block;">' +
        '<div class="orb-img">' + orbSvgInline(item.orb).replace('width="200" height="200"','width="88" height="88"') + '</div>' +
        '<p class="orb-title">' + escapeHtml(item.title) + '</p>' +
        '<p class="orb-date">' + item.emotionEmoji + ' ' + new Date(item.createdAt).toLocaleDateString('ja-JP',{month:'numeric',day:'numeric'}) + '</p>' +
      '</a>';
    }).join('');
  } catch(e) {
    grid.innerHTML = '<div class="puni-empty">読み込みに失敗しました</div>';
  }
}

$$('.puni-filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    currentFilter = chip.dataset.filter;
    $$('.puni-filter-chip').forEach(c => c.classList.toggle('active', c === chip));
    renderCollection();
  });
});

function renderCollection() {
  const grid = $('#collection-grid');
  let items = allItems;
  if (currentFilter === 'locked') items = items.filter(i => !i.opened);
  else if (currentFilter !== 'all') items = items.filter(i => i.orb.rarity === currentFilter);

  if (!items.length) {
    grid.innerHTML = '<div class="puni-empty"><div class="puni-empty-icon">🪄</div>まだオーブがないよ。<br>気持ちを書いて、最初のオーブを生成してみよう！</div>';
    return;
  }

  grid.innerHTML = items.map(item => {
    const isLocked = !item.opened;
    const orbHtml = isLocked ? lockedOrbHtml().replace('width="200" height="200"','width="88" height="88"') : orbSvgInline(item.orb).replace('width="200" height="200"','width="88" height="88"');
    return \`
      <div class="puni-orb-card \${item.orb.rarity}" data-id="\${item.id}">
        <div class="orb-img">\${orbHtml}</div>
        <p class="orb-title">\${escapeHtml(item.title)}</p>
        <p class="orb-date">\${new Date(item.createdAt).toLocaleDateString('ja-JP',{month:'numeric',day:'numeric'})}</p>
        \${isLocked ? \`<div class="orb-locked-overlay">🔒<br><small>\${item.openAt ? new Date(item.openAt).toLocaleDateString('ja-JP',{month:'short',day:'numeric'}) : ''} 開封</small></div>\` : ''}
      </div>
    \`;
  }).join('');

  $$('.puni-orb-card').forEach(card => {
    card.addEventListener('click', () => {
      const item = allItems.find(i => i.id === card.dataset.id);
      if (item) showItemModal(item);
    });
  });
}

function showItemModal(item) {
  const root = $('#modal-root');
  const content = $('#modal-content');
  const isLocked = !item.opened;
  const orbHtml = isLocked ? lockedOrbHtml() : orbSvgInline(item.orb);
  const shareUrl = location.origin + '/c/' + item.shareId;
  content.innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <div class="puni-result-orb-wrap">\${orbHtml}</div>
    <h3 class="puni-result-title" style="text-align:center;">\${escapeHtml(item.title)}</h3>
    <p class="puni-result-sub" style="text-align:center;">\${new Date(item.createdAt).toLocaleString('ja-JP')}</p>
    <div class="puni-result-badges">
      <span class="puni-badge puni-badge-emotion">\${item.emotionEmoji} \${escapeHtml(item.emotionLabel)}</span>
      <span class="puni-badge puni-badge-rarity \${item.orb.rarity}">\${rarityLabel(item.orb.rarity)}</span>
    </div>
    \${isLocked ? \`<div class="puni-countdown"><span class="puni-countdown-label">開封日:</span><span class="puni-countdown-num">\${new Date(item.openAt).toLocaleString('ja-JP')}</span></div>\` : 
      \`<div style="background:#FAFAFC;border-radius:14px;padding:14px;margin:14px 0;white-space:pre-wrap;line-height:1.7;font-size:14px;color:#3D2B5C;">\${escapeHtml(item.content||'')}</div>\`}
    <div class="puni-share-row">
      <button class="puni-share-btn" data-copy-url="\${escapeHtml(shareUrl)}">🔗 コピー</button>
      <a class="puni-share-btn tw" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=\${encodeURIComponent('わたしのぷにオーブを見て ✨ #ぷにメモリー')}&url=\${encodeURIComponent(shareUrl)}">𝕏</a>
      <button class="puni-share-btn" data-delete style="color:#C0392B;border-color:#FFB3B3;">🗑 削除</button>
    </div>
  \`;
  root.style.display = '';
  root.querySelector('[data-close]').onclick = () => root.style.display = 'none';
  root.querySelector('.puni-modal-backdrop').onclick = () => root.style.display = 'none';
  root.querySelector('[data-copy-url]').addEventListener('click', e => {
    navigator.clipboard.writeText(e.currentTarget.getAttribute('data-copy-url')).then(()=>toast('リンクをコピーしたよ ✨','success'));
  });
  root.querySelector('[data-delete]').onclick = async () => {
    if (!confirm('このオーブを削除しますか？')) return;
    const r = await fetch('/api/capsules/' + item.id, { method: 'DELETE' });
    if (r.ok) { toast('削除しました'); root.style.display = 'none'; loadCollection(); track('delete', {}); }
  };
}

// === 統計 ===
async function loadStats() {
  const el = $('#stats-content');
  el.innerHTML = '<div class="puni-loading">読み込み中…</div>';
  try {
    const res = await fetch('/api/stats');
    const s = await res.json();

    const emoLabels = {joy:'よろこび ✨',sadness:'かなしみ 💧',anger:'いかり 🔥',fear:'ふあん 🌀',love:'あい 💖',surprise:'おどろき ⭐',calm:'やすらぎ 🌿'};
    const emoColors = {joy:'#FFD93D',sadness:'#6B9DC2',anger:'#E63946',fear:'#7B2CBF',love:'#FF6B9D',surprise:'#06D6A0',calm:'#A8DADC'};
    const total = s.total || 0;
    const maxByEmo = Math.max(1, ...Object.values(s.byEmotion || {}));

    let bars = '';
    for (const [k, label] of Object.entries(emoLabels)) {
      const n = s.byEmotion[k] || 0;
      const pct = (n / maxByEmo) * 100;
      bars += \`<div class="puni-bar-row">
        <span class="puni-bar-label">\${label}</span>
        <div class="puni-bar-track"><div class="puni-bar-fill" style="width:\${pct}%;background:\${emoColors[k]};"></div></div>
        <span class="puni-bar-num">\${n}</span>
      </div>\`;
    }

    const rarityCounts = s.byRarity || {};

    el.innerHTML = \`
      <div class="puni-stats-grid">
        <div class="puni-stat-card"><div class="puni-stat-num">\${total}</div><div class="puni-stat-label">オーブ総数</div></div>
        <div class="puni-stat-card"><div class="puni-stat-num">\${s.streak || 0}</div><div class="puni-stat-label">連続記録日数</div></div>
        <div class="puni-stat-card"><div class="puni-stat-num">\${rarityCounts.legendary || 0}</div><div class="puni-stat-label">✨ レジェンダリー</div></div>
      </div>
      <div class="puni-stat-card">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px;">気持ちの内訳</div>
        \${bars}
      </div>
      <div class="puni-stat-card">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px;">レアリティ図鑑</div>
        <div class="puni-rarity-badges">
          <span class="puni-rarity-badge">コモン × \${rarityCounts.common || 0}</span>
          <span class="puni-rarity-badge" style="border-color:#4FC3F7;">レア × \${rarityCounts.rare || 0}</span>
          <span class="puni-rarity-badge" style="border-color:#BA68C8;">エピック × \${rarityCounts.epic || 0}</span>
          <span class="puni-rarity-badge" style="border-color:#FFD700;background:linear-gradient(135deg,#FFF8E1,#FFE082);">レジェンダリー × \${rarityCounts.legendary || 0}</span>
        </div>
      </div>
      <div class="puni-stat-card" style="background:linear-gradient(135deg,#FFF5FA,#F5F0FF);border:2px dashed #E0CCFF;">
        <div style="font-weight:800;font-size:15px;margin-bottom:6px;">💎 プレミアム機能（近日公開）</div>
        <div style="font-size:13px;color:#6B5B95;line-height:1.7;">月額300円で無制限保存・限定スキン・5年タイムカプセル・図鑑エクスポートが解放されます。</div>
        <button class="puni-btn-icon" style="margin-top:10px;" onclick="window.dispatchEvent(new CustomEvent('puni-toast',{detail:'リリース通知を予約したよ ✨'}));window.__t&&window.__t('premium_interest',{})">通知を受け取る</button>
      </div>
    \`;
  } catch(e) {
    el.innerHTML = '<div class="puni-empty">読み込みに失敗しました</div>';
  }
}
window.__t = track;

// 初回オンボーディング
function showOnboarding() {
  if (localStorage.getItem('puni_onboarded')) return;
  $('#modal-content').innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <div style="text-align:center;padding:8px 0;">
      <div style="font-size:60px;margin-bottom:8px;">🪄</div>
      <h3 style="margin:0 0 8px;font-size:22px;">ようこそ、ぷにメモリーへ</h3>
      <p style="line-height:1.8;color:#6B5B95;font-size:14px;margin:0 0 16px;">
        今日の気持ちを書くと、AIが <span style="font-weight:800;color:#FF8FB1;">ぷにぷにオーブ</span> に変えるよ。<br>
        集めて図鑑を埋めたり、未来の自分にタイムカプセルとして送ったり。<br><br>
        <span style="color:#9D90B8;font-size:12px;">レアなオーブが出たら…✨ お楽しみに！</span>
      </p>
      <button class="puni-btn puni-btn-primary" data-start>はじめる</button>
    </div>
  \`;
  $('#modal-root').style.display = '';
  const close = () => {
    $('#modal-root').style.display = 'none';
    localStorage.setItem('puni_onboarded', '1');
    track('onboarding_complete', {});
  };
  $('#modal-root [data-close]').onclick = close;
  $('#modal-root [data-start]').onclick = close;
  $('#modal-root .puni-modal-backdrop').onclick = close;
  track('onboarding_shown', {});
}
setTimeout(showOnboarding, 600);

// 初期表示
track('app_loaded', { ua: navigator.userAgent.slice(0,40) });

// PWA風: 追加ヘルプ
$('#about-link').addEventListener('click', e => {
  e.preventDefault();
  $('#modal-content').innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <h3 style="margin:0 0 10px;">ぷにメモリーって？ 🪄</h3>
    <p style="line-height:1.8;color:#6B5B95;font-size:14px;">日々の気持ちをAIが解析して、あなただけのぷにぷにオーブを生成するサービスです。</p>
    <ul style="line-height:1.8;color:#6B5B95;font-size:14px;padding-left:20px;">
      <li>感情AIが文章から色・形・レアリティを決定</li>
      <li>未来の自分への手紙＝タイムカプセル機能</li>
      <li>図鑑コレクション・連続記録・レアリティ抽選</li>
      <li>シェア機能でSNSに共有可能</li>
      <li>あなたのデータはあなただけのもの</li>
    </ul>
  \`;
  $('#modal-root').style.display = '';
  $('#modal-root [data-close]').onclick = () => $('#modal-root').style.display='none';
  $('#modal-root .puni-modal-backdrop').onclick = () => $('#modal-root').style.display='none';
});
$('#privacy-link').addEventListener('click', e => {
  e.preventDefault();
  $('#modal-content').innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <h3 style="margin:0 0 10px;">プライバシー 🛡</h3>
    <p style="line-height:1.8;color:#6B5B95;font-size:14px;">
      ・あなたが書いた内容は暗号化された Cloudflare D1 に保存されます。<br>
      ・公開設定をしない限り、誰にも見えません。<br>
      ・IPアドレスはハッシュ化のみ保存（個人特定なし）。<br>
      ・解析イベントは匿名で記録されます。<br>
      ・カプセルはいつでも削除できます。<br>
      ・第三者にデータを売却することはありません。
    </p>
  \`;
  $('#modal-root').style.display = '';
  $('#modal-root [data-close]').onclick = () => $('#modal-root').style.display='none';
  $('#modal-root .puni-modal-backdrop').onclick = () => $('#modal-root').style.display='none';
});

// === サポートモーダル ===
function openSupportModal() {
  $('#modal-content').innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <div style="text-align:center;padding:8px 0 4px;">
      <div style="font-size:48px;margin-bottom:4px;">☕</div>
      <h3 style="margin:0 0 8px;font-size:20px;">開発者を応援する</h3>
      <p style="line-height:1.7;color:#6B5B95;font-size:14px;margin:0 0 18px;">
        サーバー代やオーブの拡充に充てられます。<br>
        どんな金額でもとても励みになります🌸
      </p>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <a href="https://www.buymeacoffee.com/punimemory" target="_blank" rel="noopener nofollow"
         class="puni-support-link"
         style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:linear-gradient(180deg,#FFDD00,#FFB300);color:#3D2B5C;text-decoration:none;font-weight:800;box-shadow:0 4px 0 rgba(0,0,0,0.08);"
         data-track="support_bmac">
        <span style="font-size:22px;">☕</span>
        <span>Buy Me a Coffee で応援する</span>
      </a>
      <a href="https://ko-fi.com/punimemory" target="_blank" rel="noopener nofollow"
         class="puni-support-link"
         style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:linear-gradient(180deg,#FF5E5B,#FF3D3D);color:white;text-decoration:none;font-weight:800;box-shadow:0 4px 0 rgba(0,0,0,0.1);"
         data-track="support_kofi">
        <span style="font-size:22px;">💖</span>
        <span>Ko-fi で応援する</span>
      </a>
      <button id="copy-support-share" class="puni-support-link"
              style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:linear-gradient(180deg,#B5EAEA,#6FCFCF);color:white;border:none;font-family:inherit;font-weight:800;box-shadow:0 4px 0 rgba(80,180,180,0.25);cursor:pointer;font-size:14px;">
        <span style="font-size:22px;">🐦</span>
        <span>SNSでアプリをシェアする</span>
      </button>
    </div>
    <p style="text-align:center;color:#9D90B8;font-size:11px;margin:16px 0 0;">※ 外部リンクは新しいタブで開きます</p>
  \`;
  $('#modal-root').style.display = '';
  $('#modal-root [data-close]').onclick = () => $('#modal-root').style.display='none';
  $('#modal-root .puni-modal-backdrop').onclick = () => $('#modal-root').style.display='none';
  $$('#modal-content [data-track]').forEach(el => {
    el.addEventListener('click', () => track(el.dataset.track));
  });
  const cs = $('#copy-support-share');
  if (cs) {
    cs.onclick = () => {
      const url = location.origin;
      const text = 'AIが日記をぷにぷにオーブに変えてくれる「ぷにメモリー」面白い ✨ #ぷにメモリー';
      if (navigator.share) {
        navigator.share({ title:'ぷにメモリー', text, url }).catch(()=>{});
      } else {
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + '\\n' + url), '_blank', 'noopener');
      }
      track('support_share_app');
    };
  }
  track('support_modal_open');
}
$('#open-support').addEventListener('click', openSupportModal);
$('#support-link').addEventListener('click', e => { e.preventDefault(); openSupportModal(); });
$('#open-share-app').addEventListener('click', () => {
  const url = location.origin;
  const text = 'AIが日記をぷにぷにオーブに変える「ぷにメモリー」🪄 完全無料！ #ぷにメモリー';
  if (navigator.share) {
    navigator.share({ title:'ぷにメモリー', text, url }).catch(()=>{});
  } else {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + '\\n' + url), '_blank', 'noopener');
  }
  track('share_app_btn');
});

})();
`
}
