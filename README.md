# 🪄 ぷにメモリー (PuniMemory)

> あなたの"今"をAIが永久保存する、ぷにぷに思い出カプセル

毎日の気持ちをAIが解析して、世界に一つだけの**ぷにぷにオーブ**を生成するサービス。
タイムカプセル機能で未来の自分にメッセージも送れます。

## ✨ 特徴

- 🧠 **AI感情解析**: 文章から喜怒哀楽を自動判定（完全ローカル処理・APIレス）
- 💎 **ぷにぷにオーブ生成**: 感情・強度に応じて色・パターン・レアリティを動的生成
- 📦 **タイムカプセル**: 未来の任意日時に自動開封されるメッセージ
- 📚 **オーブ図鑑**: 集めたオーブをコレクション、レアリティ抽選あり
- 🌈 **広場（ギャラリー）**: みんなの公開オーブをのぞける（バイラル成長）
- 📊 **記録ダッシュボード**: 感情の内訳・連続記録日数・レアリティ図鑑
- 🌟 **日替わりお題**: 毎日変わるテーマでハッシュタグ拡散誘導
- 🎯 **シェア最適化**: 動的OGP画像・Twitter/LINE共有・リアクション機能
- 🛡️ **セキュリティ**: CSP, XSS対策, レート制限, IP匿名化, HttpOnly Cookie
- 📱 **PWA対応**: ホーム画面追加可、モバイル&PC対応のぷにぷにUI

## 🛠 技術スタック

- **Cloudflare Pages** + **Cloudflare D1** (SQLite)
- **Hono** (軽量フレームワーク)
- **Vite** ビルド
- **TypeScript** + Hono JSX
- 完全無料で運用可能（高校生でも作れる！）

## 🚀 デプロイ手順

### 1. Cloudflare アカウント準備

1. [Cloudflare](https://dash.cloudflare.com/sign-up) で無料アカウント作成
2. APIトークンを発行: https://dash.cloudflare.com/profile/api-tokens
   - "Edit Cloudflare Workers" テンプレートを使用

### 2. D1 データベース作成

```bash
# 環境変数設定
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"

# D1データベース作成
npx wrangler d1 create puni-memory-db
# → 出力された database_id を wrangler.jsonc にコピー
```

### 3. wrangler.jsonc を編集

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "puni-memory-db",
    "database_id": "ここにD1作成時に出力されたID",
    "migrations_dir": "migrations"
  }
]
```

### 4. マイグレーション & デプロイ

```bash
# 本番DBへスキーマ適用
npx wrangler d1 migrations apply puni-memory-db

# ビルド
npm run build

# Cloudflare Pages にデプロイ
npx wrangler pages deploy dist --project-name=service12
```

## 🧑‍💻 ローカル開発

```bash
npm install
npx wrangler d1 execute puni-memory-db --local --file=./migrations/0001_init.sql
npm run build
npm run dev
# → http://localhost:3000
```

## 💰 収益化導線

1. **プレミアム会員（月額300円）**
   - 無制限カプセル保存
   - 限定スキン
   - 5年タイムカプセル
   - 図鑑エクスポート
2. **ぷにオーブ限定スキンガチャ**（投げ銭式）
3. **アフィリエイト**（日記帳・文房具リンク）
4. **SNSバイラル拡散**による広告収入

## 🔒 セキュリティ対策

- ✅ Content-Security-Policy（XSS防御）
- ✅ X-Frame-Options: DENY（クリックジャッキング対策）
- ✅ Permissions-Policy（不要な権限の禁止）
- ✅ レート制限（1時間20カプセル / 10リアクション）
- ✅ 入力値検証・サニタイズ
- ✅ IP アドレスはハッシュ化のみ保存
- ✅ HttpOnly + Secure + SameSite Cookie
- ✅ HTML エスケープ徹底

## 📊 アナリティクス

すべての主要イベント（page_view, capsule_created, share_view, react など）を
匿名で D1 に記録。`analytics_events` テーブルで分析可能。

## 📝 ライセンス

MIT
