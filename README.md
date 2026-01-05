# DX人材セルフチェック診断

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/dx-skills-assessment)

DX（デジタルトランスフォーメーション）人材として必要なスキルを、4つの層（技術理解・組織影響力・哲学的軸・サステナビリティ）から診断するWebアプリケーションです。

![診断結果のサンプル](docs/screenshot.png)

## 🎯 このツールについて

DX推進には、単なる技術スキルだけでなく、組織を動かす力、変革の哲学、そして自分自身を持続させる力が必要です。

このセルフチェック診断は、**「今の自分がどこに立っているか」を可視化し、次の一歩を見つけるための羅針盤**として設計されています。

### 特徴

- ✅ **4層スキル診断**: 技術・組織・哲学・サステナビリティの4つの観点から総合評価
- 📊 **レーダーチャート**: Chart.jsを使った視覚的なスコア表示
- 💡 **具体的なアドバイス**: 強みと伸びしろに応じたパーソナライズされた成長提案
- 📱 **レスポンシブ対応**: スマホ・タブレット・PCどの端末でも快適に利用可能
- 💾 **進捗保存**: 途中で中断しても、続きから再開できます
- 📄 **PDF出力**: 診断結果をPDFでダウンロード・保存可能

## 🚀 デモ

[👉 診断を体験する](https://yourusername.github.io/dx-skills-assessment/)

## 📖 使い方

### 基本的な使い方

1. リポジトリをクローンまたはダウンロード
```bash
git clone https://github.com/yourusername/dx-skills-assessment.git
cd dx-skills-assessment
```

2. `index.html`をブラウザで開く
```bash
# macOS/Linux
open index.html

# Windows
start index.html
```

3. 診断を開始
   - STEP1: 現在地確認（5問）
   - STEP2: スキルチェック（48問）
   - 結果画面でレーダーチャートと詳細なアドバイスを確認

### GitHub Pagesで公開する

1. リポジトリをGitHubにプッシュ
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. GitHubのリポジトリページで `Settings` > `Pages` を開く

3. `Source` で `main` ブランチを選択

4. 数分後、`https://yourusername.github.io/dx-skills-assessment/` で公開されます

## 🛠️ 技術スタック

- **HTML5/CSS3**: セマンティックなマークアップとモダンなスタイリング
- **Vanilla JavaScript**: フレームワーク不要のシンプルな実装
- **Chart.js**: レーダーチャートの描画
- **html2canvas**: 結果画面のキャプチャ
- **jsPDF**: PDF出力機能

## 📐 診断の構成

### STEP1: 現在地確認（5問）

- 現在の役割・ポジション
- DX推進における課題
- 過去の経験
- 大切にしたい価値観
- 3年後のビジョン

### STEP2: 4層スキルチェック（48問）

#### 第1層: 技術的理解（12問）
- 技術の目利き力
- データとビジネスの接続
- セキュリティとコンプライアンス

#### 第2層: 組織的影響力（16問）
- 対話と翻訳の力
- 変化への伴走
- 人材育成と文化づくり
- 政治力と資源確保

#### 第3層: 哲学的軸（12問）
- 組織の存在意義との接続
- 不確実性への向き合い方
- 倫理と人間中心
- 外部との接続

#### 第4層: サステナビリティ（8問）
- 自分の芯のメンテナンス
- 楽しさと意味の両立

### 結果表示

- レーダーチャートでの4層スコア可視化
- 各層の詳細スコア（0-100%）
- 強みと伸びしろの特定
- バランスチェック
- 具体的な成長アドバイス

## 🎨 カスタマイズ

### 質問内容の変更

`app.js` の `preQuestions` と `mainQuestions` 配列を編集します。

```javascript
const mainQuestions = [
  {
    icon: "star",
    text: "あなたの質問内容",
    type: "check",
    layer: "tech", // tech, org, philosophy, sustain
    category: "judgment"
  },
  // ...
];
```

### スタイルの変更

`index.html` の `<style>` タグ内で、カラースキームやレイアウトを調整できます。

```css
/* グラデーションの変更 */
body {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### アドバイスメッセージの編集

`app.js` の以下の関数を編集します：

- `getStrengthAdvice(layer)`: 強みに対するアドバイス
- `getGrowthAdvice(layer)`: 伸びしろに対するアドバイス
- `getBalanceAdvice(scores)`: バランスに関するアドバイス

詳細は [カスタマイズガイド](docs/customization.md) を参照してください。

## 📂 ファイル構成

```
dx-skills-assessment/
├── index.html          # メインHTML
├── app.js              # JavaScript（ロジック・UI）
├── README.md           # このファイル
├── LICENSE             # MITライセンス
└── docs/
    ├── usage.md        # 使い方ガイド
    └── customization.md # カスタマイズガイド
```

## 🤝 コントリビューション

バグ報告、機能リクエスト、プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 👤 作者

**みぃ**

- Role: DX Instructor, Educational Content Creator
- Twitter: [@your-twitter](https://twitter.com/your-twitter)
- Website: [your-website.com](https://your-website.com)

## 🙏 謝辞

このツールは、DX人材育成の現場で多くの方々との対話から生まれました。
DXに取り組むすべての人々への敬意と応援の気持ちを込めて。

---

**あなたの「今」を知り、次の一歩を照らす光になりますように 😊**
