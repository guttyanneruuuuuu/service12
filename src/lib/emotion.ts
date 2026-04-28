// 感情解析エンジン（完全無料・APIレス・日本語対応）
// 単語辞書ベース + ヒューリスティック

export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'love' | 'surprise' | 'calm'

export interface EmotionResult {
  emotion: EmotionType
  score: number // 0.0 - 1.0 (信頼度)
  scores: Record<EmotionType, number>
  intensity: number // 感情の強度 0-1
}

// 感情語辞書 (日本語 + 英語)
const EMOTION_WORDS: Record<EmotionType, string[]> = {
  joy: [
    '嬉しい','うれしい','楽しい','たのしい','幸せ','しあわせ','喜び','よろこび','最高','さいこう',
    'ハッピー','happy','笑','わら','ニコニコ','にこにこ','すごい','すげー','やったー','やった',
    'わくわく','ワクワク','ウキウキ','うきうき','ご機嫌','満足','まんぞく','ラッキー','ありがとう',
    '感謝','かんしゃ','大好き','だいすき','成功','せいこう','勝った','クリア','達成','たっせい',
    '面白い','おもしろい','最高','かわいい','可愛い','綺麗','きれい','美味しい','おいしい'
  ],
  sadness: [
    '悲しい','かなしい','つらい','辛い','寂しい','さびしい','涙','なみだ','泣','な','切ない',
    'sad','落ち込','おちこ','憂鬱','ゆううつ','虚しい','むなしい','孤独','こどく','失った','失敗',
    'しっぱい','後悔','こうかい','残念','ざんねん','がっかり','ガッカリ','凹','へこ','疲れ','つかれ',
    'しんどい','きつい','嫌','いや','だめ','ダメ','終わった','むり','無理','病んで'
  ],
  anger: [
    '怒','おこ','イライラ','いらいら','ムカつく','むかつく','腹立','はらだ','うざい','ウザい',
    'angry','キレ','きれ','許せない','ゆるせない','最悪','さいあく','クソ','くそ','ふざけ','ぶちぎれ',
    'ブチギレ','激怒','げきど','憎','にく','頭にきた','ありえない','クズ','ばか','バカ','うるさい'
  ],
  fear: [
    '怖い','こわい','不安','ふあん','心配','しんぱい','緊張','きんちょう','ドキドキ','どきどき',
    'fear','scared','ビビ','びび','恐怖','きょうふ','焦','あせ','逃げ','にげ','震え','ふるえ',
    'やばい','ヤバい','危ない','あぶない','嫌だ','どうしよう','どうしたら','失敗したら'
  ],
  love: [
    '好き','すき','大好き','だいすき','愛','あい','恋','こい','love','ラブ','ハート','胸キュン',
    'ときめき','トキメキ','片想い','片思い','両思い','付き合','つきあ','彼氏','彼女','カップル',
    'デート','プロポーズ','結婚','けっこん','大切','たいせつ','宝物','たからもの','一生','永遠'
  ],
  surprise: [
    'びっくり','ビックリ','驚','おどろ','まじ','マジ','え！','えっ','うそ','ウソ','嘘','まさか',
    'ありえ','信じられ','しんじられ','surprise','wow','すごっ','ぎゃー','ギャー','どっひゃ','衝撃',
    'しょうげき','予想外','よそうがい','ハッとした','ハッと'
  ],
  calm: [
    '落ち着','おちつ','穏やか','おだやか','静か','しずか','安心','あんしん','ゆったり','のんびり',
    'まったり','癒','いや','リラックス','calm','peaceful','心地よい','ここちよい','幸福','こうふく',
    '平和','へいわ','普通','ふつう','まあまあ','大丈夫','だいじょうぶ','okay','OK','いい感じ'
  ]
}

// 強度修飾語
const INTENSIFIERS = ['とても','すごく','超','めちゃ','めっちゃ','ものすごく','本当に','ほんとに','まじで','マジで','激','very','really','so','!','！']
const NEGATORS = ['ない','じゃない','ではない','じゃなかった','not','no']

export function analyzeEmotion(text: string): EmotionResult {
  const normalized = text.toLowerCase()
  const scores: Record<EmotionType, number> = {
    joy: 0, sadness: 0, anger: 0, fear: 0, love: 0, surprise: 0, calm: 0
  }

  // 各感情の単語マッチ
  for (const [emo, words] of Object.entries(EMOTION_WORDS) as [EmotionType, string[]][]) {
    for (const word of words) {
      let idx = 0
      let count = 0
      while ((idx = normalized.indexOf(word, idx)) !== -1) {
        count++
        idx += word.length
      }
      scores[emo] += count
    }
  }

  // 強度修飾語ボーナス
  let intensity = 0.3
  for (const intf of INTENSIFIERS) {
    const matches = (normalized.match(new RegExp(intf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
    intensity += matches * 0.15
  }
  intensity = Math.min(1, intensity)

  // 文末感嘆符
  const exclamations = (text.match(/[!！]/g) || []).length
  intensity = Math.min(1, intensity + exclamations * 0.1)

  // 否定検出（簡易）→ joyとsadnessを反転させる効果
  const negCount = NEGATORS.reduce((acc, n) => {
    return acc + (normalized.match(new RegExp(n, 'g')) || []).length
  }, 0)

  // 否定が多いとjoyが下がってsadnessが上がる
  if (negCount > 0 && scores.joy > 0) {
    scores.sadness += scores.joy * 0.3
    scores.joy *= 0.5
  }

  // 最大の感情を取得
  let maxEmo: EmotionType = 'calm'
  let maxScore = 0
  for (const [emo, score] of Object.entries(scores) as [EmotionType, number][]) {
    if (score > maxScore) {
      maxScore = score
      maxEmo = emo
    }
  }

  // テキスト長による補正（長文ほど確度UP）
  const textLength = text.length
  const lengthFactor = Math.min(1, textLength / 50)

  // どの感情も検出されなかった場合 calm
  if (maxScore === 0) {
    maxEmo = 'calm'
    intensity = 0.4
  }

  // 信頼度: 1位と2位の差で算出
  const sortedScores = Object.values(scores).sort((a, b) => b - a)
  const gap = sortedScores[0] - (sortedScores[1] || 0)
  const total = sortedScores.reduce((a, b) => a + b, 0)
  const score = total > 0
    ? Math.min(1, 0.5 + (gap / total) * 0.5) * lengthFactor + 0.2
    : 0.4

  return {
    emotion: maxEmo,
    score: Math.min(1, score),
    scores,
    intensity
  }
}

// 感情に基づくぷにオーブのビジュアルパラメータ生成
export interface OrbVisual {
  color: string       // 主色
  color2: string      // 副色
  pattern: string     // パターン
  size: number        // 50-100
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const EMOTION_PALETTES: Record<EmotionType, { primary: string[]; secondary: string[] }> = {
  joy:      { primary: ['#FFD93D','#FFB84D','#FFA07A','#FFE066','#FFC857'], secondary: ['#FF6B6B','#FF9F1C','#F4D35E','#FFEDB5'] },
  sadness:  { primary: ['#6B9DC2','#5B8DC4','#4A6FA5','#7BA7BC','#8DAFCC'], secondary: ['#A8DADC','#B8E0D2','#9FC5E8','#CDD7D6'] },
  anger:    { primary: ['#E63946','#D62828','#FF4D4D','#C9302C','#E53E3E'], secondary: ['#F77F00','#FCA311','#FF6B35','#FF8C42'] },
  fear:     { primary: ['#6A4C93','#7B2CBF','#5A189A','#9D4EDD','#7251B5'], secondary: ['#3A0CA3','#480CA8','#560BAD','#B5179E'] },
  love:     { primary: ['#FF6B9D','#FF8FAB','#FFB3C6','#FFC2D1','#FF80AB'], secondary: ['#FFCAD4','#F4ACB7','#E8909C','#F8AFA6'] },
  surprise: { primary: ['#06D6A0','#1B9AAA','#00BBF9','#00F5D4','#3DDC97'], secondary: ['#F15BB5','#FEE440','#9B5DE5','#00BBF9'] },
  calm:     { primary: ['#A8DADC','#B5EAEA','#CDFAD5','#E8F3F1','#C7F0DB'], secondary: ['#F8F9FA','#E9ECEF','#DEE2E6','#F1F3F4'] }
}

const PATTERNS = ['nebula','marble','glow','sparkle','ripple']

// 単純なseedハッシュ
export function hashSeed(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export function generateOrb(text: string, emotion: EmotionResult): OrbVisual {
  const seed = hashSeed(text + Date.now())
  const palette = EMOTION_PALETTES[emotion.emotion]
  const color = palette.primary[seed % palette.primary.length]
  const color2 = palette.secondary[(seed >> 4) % palette.secondary.length]

  // 強度が高いほどパターンが派手
  let pattern: string
  if (emotion.intensity > 0.85) pattern = 'sparkle'
  else if (emotion.intensity > 0.65) pattern = 'nebula'
  else if (emotion.intensity > 0.45) pattern = 'glow'
  else if (emotion.intensity > 0.25) pattern = 'marble'
  else pattern = 'ripple'

  // たまにランダムで他のパターンに（驚き要素）
  if (seed % 17 === 0) pattern = PATTERNS[seed % PATTERNS.length]

  // サイズ: 強度 + ランダム
  const size = Math.floor(60 + emotion.intensity * 30 + (seed % 10))

  // レアリティ抽選
  const rarityRoll = (seed % 1000) / 1000
  let rarity: OrbVisual['rarity']
  if (rarityRoll < 0.005) rarity = 'legendary'      // 0.5%
  else if (rarityRoll < 0.05) rarity = 'epic'       // 4.5%
  else if (rarityRoll < 0.20) rarity = 'rare'       // 15%
  else rarity = 'common'                             // 80%

  return { color, color2, pattern, size, rarity }
}

export const EMOTION_LABELS: Record<EmotionType, string> = {
  joy: 'よろこび',
  sadness: 'かなしみ',
  anger: 'いかり',
  fear: 'ふあん',
  love: 'あい',
  surprise: 'おどろき',
  calm: 'やすらぎ'
}

export const EMOTION_EMOJIS: Record<EmotionType, string> = {
  joy: '✨',
  sadness: '💧',
  anger: '🔥',
  fear: '🌀',
  love: '💖',
  surprise: '⭐',
  calm: '🌿'
}
