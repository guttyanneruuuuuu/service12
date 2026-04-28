-- ぷにメモリー DB スキーマ
-- ユーザーテーブル（匿名 + 任意でメール）
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  display_name TEXT,
  email TEXT UNIQUE,
  premium INTEGER DEFAULT 0,
  premium_until INTEGER,
  total_capsules INTEGER DEFAULT 0,
  total_orbs INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL
);

-- カプセル（思い出）テーブル
CREATE TABLE IF NOT EXISTS capsules (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  emotion TEXT NOT NULL,        -- joy, sadness, anger, fear, love, surprise, calm
  emotion_score REAL NOT NULL,  -- 0.0-1.0
  orb_color TEXT NOT NULL,      -- HEXカラー
  orb_color_2 TEXT,             -- 副色
  orb_pattern TEXT NOT NULL,    -- nebula, marble, glow, sparkle, ripple
  orb_size INTEGER DEFAULT 50,
  rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
  share_id TEXT UNIQUE,         -- 公開用ID
  is_public INTEGER DEFAULT 0,
  open_at INTEGER,              -- タイムカプセル開封日時 (NULLなら即時)
  opened INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- いいね / リアクション
CREATE TABLE IF NOT EXISTS reactions (
  id TEXT PRIMARY KEY,
  capsule_id TEXT NOT NULL,
  user_id TEXT,
  reaction TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (capsule_id) REFERENCES capsules(id)
);

-- アナリティクスイベント
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  event_type TEXT NOT NULL,
  payload TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at INTEGER NOT NULL
);

-- レート制限テーブル
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER DEFAULT 1,
  reset_at INTEGER NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_capsules_user ON capsules(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_capsules_share ON capsules(share_id);
CREATE INDEX IF NOT EXISTS idx_capsules_open_at ON capsules(open_at) WHERE open_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_capsules_public ON capsules(is_public, created_at DESC) WHERE is_public = 1;
CREATE INDEX IF NOT EXISTS idx_reactions_capsule ON reactions(capsule_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id, created_at DESC);
