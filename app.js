/**
 * AIプロンプト生成ツール - メインアプリケーション
 * ===================================================
 * IT知識の浅い新入社員向けに、生成AIで使えるプロンプトを自動生成
 */

// =========================================
// プロンプトテンプレート設定
// =========================================

const PromptTemplates = {
    // ベースプロンプト（全形式共通）
    base: `あなたは、IT知識の浅い新入社員にもわかりやすく技術用語を解説する専門家です。

■ 解説対象
「{keyword}」について解説してください。

■ 出力形式
以下の要件を満たす、**完全に動作するHTMLファイル**（Webページ形式のインフォグラフィック）を1つ出力してください：

1. HTML、CSS、JavaScriptを1つのHTMLファイルにまとめる
2. スタイルは<style>タグ内に記述
3. スクリプトは<script>タグ内に記述
4. 外部ファイルへの依存なしで、そのままブラウザで開いて動作する
5. モダンでプロフェッショナルなデザイン
6. レスポンシブ対応（スマホでも見やすい）

■ 解説の要件
- IT知識がない人でも理解できる平易な言葉で説明
- 専門用語には必ず簡単な補足説明を付ける
- 具体的な例え話や日常生活との関連付けを含める
- 「なぜ重要なのか」「どう役立つのか」を明確にする

■ 情報の品質
- 今日の日付は {date} です。最新の情報を反映してください
- 信頼できる情報源に基づいた正確な内容にしてください
- 誤解を招く表現は避けてください

`,

    // 形式別の追加指示
    formats: {
        interactive: {
            name: 'インタラクティブ表示',
            instruction: `■ インタラクティブ要素の要件
以下のインタラクティブ機能を含めてください：

1. **クリック/タップで展開する詳細セクション**
   - 各主要概念をカード形式で表示
   - クリックすると詳細説明がスライドダウンで表示
   - もう一度クリックで閉じる

2. **ホバー（マウスオーバー）効果**
   - 重要な用語にホバーすると補足説明がツールチップ表示
   - カードにホバーで軽い浮き上がりアニメーション

3. **タブ切り替え機能**
   - 「基本説明」「具体例」「活用シーン」などをタブで切り替え
   - 選択中のタブは視覚的に強調

4. **プログレスバーまたはステップ表示**
   - 理解度を視覚化するステップインジケーター

JavaScriptでの実装例：
- addEventListener('click', ...) でクリックイベント処理
- classList.toggle() でクラスの切り替え
- CSS transitionと組み合わせたアニメーション
`
        },
        
        comparison: {
            name: '比較表形式',
            instruction: `■ 比較表の要件
以下の形式で比較表を作成してください：

1. **メイン比較表**
   - 「{keyword}」と関連する類似概念を2〜3つ選び比較
   - 比較項目：定義、主な用途、メリット、デメリット、具体例
   - 表はレスポンシブ対応（スマホでは縦並びに変化）

2. **視覚的な差別化**
   - 各概念を異なる色でカラーコーディング
   - 重要な違いはハイライト表示
   - アイコンや絵文字で視覚的に区別

3. **補足説明セクション**
   - 「いつどちらを選ぶべきか」の判断基準
   - よくある間違いや混同ポイント

4. **インタラクティブ要素**
   - 行にホバーでハイライト
   - 列のソート機能（オプション）

CSSでの表デザイン例：
- border-collapse: collapse でシンプルな表
- :nth-child(even) で交互の背景色
- @media クエリでモバイル対応
`
        },
        
        diagram: {
            name: '図解形式',
            instruction: `■ 図解・ダイアグラムの要件
以下の視覚的要素を含めてください：

1. **概念図（SVGまたはCSS）**
   - 「{keyword}」の構造や関係性を図で表現
   - SVGタグまたはCSSのflexbox/gridで図を作成
   - 矢印、接続線、ボックスで関係性を明示

2. **フローチャート**
   - 処理の流れや手順をステップで図示
   - 開始→処理→分岐→終了の流れ
   - 各ステップに簡潔な説明

3. **アイコンと視覚要素**
   - CSS絵文字またはSVGアイコンを活用
   - 色分けで情報のカテゴリを区別
   - グラデーションやシャドウで立体感

4. **レイヤー構造図**（該当する場合）
   - 階層構造を視覚的に表現
   - 上位/下位の関係を明確に

5. **インタラクティブ機能**
   - 図の要素にホバーで詳細表示
   - クリックで関連情報へスクロール

CSS/SVGでの図作成例：
- display: flex/grid でレイアウト
- position: relative/absolute で配置調整
- SVG path で矢印や接続線
`
        },
        
        animation: {
            name: 'アニメーション解説',
            instruction: `■ アニメーションの要件
以下のアニメーション効果を含めてください：

1. **説明アニメーション**
   - 概念の動きや流れをCSSアニメーションで表現
   - データの流れ、処理の順序などを動きで説明
   - @keyframes で滑らかなアニメーション

2. **ステップバイステップ表示**
   - 情報が順番に表示されるシーケンスアニメーション
   - 「次へ」ボタンで進む、または自動再生
   - プログレスインジケーター付き

3. **インタラクティブアニメーション**
   - ボタンクリックで動作デモが再生
   - 再生/一時停止/リセットコントロール
   - 再生速度の調整（オプション）

4. **視覚効果**
   - フェードイン/スライドインで要素が登場
   - パルスやハイライトで重要ポイントを強調
   - スクロールに連動したアニメーション（Intersection Observer）

5. **パフォーマンス考慮**
   - transform と opacity を使用（GPUアクセラレーション）
   - prefers-reduced-motion でアニメーション無効化オプション

CSS/JSアニメーション例：
- @keyframes で複雑なアニメーション定義
- animation-delay で順次表示
- requestAnimationFrame で滑らかな動き
`
        }
    }
};

// =========================================
// プロンプトビルダークラス
// =========================================

class PromptBuilder {
    constructor(templates) {
        this.templates = templates;
    }

    /**
     * 今日の日付を取得（YYYY年MM月DD日形式）
     */
    getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

    /**
     * テンプレート内の変数を置換
     */
    replaceVariables(template, variables) {
        let result = template;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            result = result.replace(regex, value);
        }
        return result;
    }

    /**
     * プロンプトを生成
     */
    build(keyword, formatType) {
        // バリデーション
        if (!keyword || keyword.trim() === '') {
            throw new Error('キーワードを入力してください');
        }

        if (!this.templates.formats[formatType]) {
            throw new Error('無効な形式が選択されています');
        }

        // 変数の準備
        const variables = {
            keyword: keyword.trim(),
            date: this.getCurrentDate()
        };

        // ベースプロンプトの構築
        let prompt = this.replaceVariables(this.templates.base, variables);

        // 形式別指示の追加
        const formatInstruction = this.templates.formats[formatType].instruction;
        prompt += this.replaceVariables(formatInstruction, variables);

        // 最終指示の追加
        prompt += `
■ 出力について
- HTMLコードのみを出力してください（説明文は不要）
- コードブロック（\`\`\`html など）で囲んでください
- 文字コードはUTF-8を指定してください
- そのままファイルに保存してブラウザで開ける完全なHTMLを出力してください
`;

        return prompt;
    }

    /**
     * 利用可能な形式の一覧を取得
     */
    getAvailableFormats() {
        return Object.entries(this.templates.formats).map(([key, value]) => ({
            id: key,
            name: value.name
        }));
    }
}

// =========================================
// UIコントローラークラス
// =========================================

class UIController {
    constructor() {
        this.promptBuilder = new PromptBuilder(PromptTemplates);
        this.elements = {};
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        // DOM要素の取得
        this.elements = {
            keywordInput: document.getElementById('keyword-input'),
            generateBtn: document.getElementById('generate-btn'),
            generateHint: document.getElementById('generate-hint'),
            resultSection: document.getElementById('result-section'),
            resultText: document.getElementById('result-text'),
            copyBtn: document.getElementById('copy-btn'),
            copyFeedback: document.getElementById('copy-feedback'),
            formatOptions: document.querySelectorAll('input[name="format"]')
        };

        // イベントリスナーの設定
        this.setupEventListeners();

        // 初期状態の設定
        this.updateGenerateButton();
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // キーワード入力時
        this.elements.keywordInput.addEventListener('input', () => {
            this.updateGenerateButton();
        });

        // Enterキーで生成
        this.elements.keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.elements.generateBtn.disabled) {
                this.generatePrompt();
            }
        });

        // 生成ボタンクリック
        this.elements.generateBtn.addEventListener('click', () => {
            this.generatePrompt();
        });

        // コピーボタンクリック
        this.elements.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // 形式選択時のビジュアルフィードバック
        this.elements.formatOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateFormatSelection();
            });
        });
    }

    /**
     * 生成ボタンの状態を更新
     */
    updateGenerateButton() {
        const keyword = this.elements.keywordInput.value.trim();
        const isEmpty = keyword === '';
        
        this.elements.generateBtn.disabled = isEmpty;
        
        if (isEmpty) {
            this.elements.generateHint.textContent = 'まず単語を入力してください';
            this.elements.generateHint.style.opacity = '0.8';
        } else {
            this.elements.generateHint.textContent = `「${keyword}」のプロンプトを生成できます`;
            this.elements.generateHint.style.opacity = '1';
        }
    }

    /**
     * 形式選択のビジュアル更新
     */
    updateFormatSelection() {
        // アニメーション効果（選択時に軽くバウンス）
        const selectedOption = document.querySelector('input[name="format"]:checked');
        if (selectedOption) {
            const card = selectedOption.nextElementSibling;
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        }
    }

    /**
     * 選択中の形式を取得
     */
    getSelectedFormat() {
        const selected = document.querySelector('input[name="format"]:checked');
        return selected ? selected.value : 'interactive';
    }

    /**
     * プロンプトを生成
     */
    generatePrompt() {
        const keyword = this.elements.keywordInput.value.trim();
        const format = this.getSelectedFormat();

        try {
            // プロンプト生成
            const prompt = this.promptBuilder.build(keyword, format);

            // 結果を表示
            this.showResult(prompt);

            // Google Analytics等のトラッキング（将来的な拡張用）
            this.trackGeneration(keyword, format);

        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * 結果を表示
     */
    showResult(prompt) {
        this.elements.resultText.textContent = prompt;
        this.elements.resultSection.style.display = 'block';
        
        // 結果セクションまでスクロール
        setTimeout(() => {
            this.elements.resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);

        // コピーフィードバックをリセット
        this.elements.copyFeedback.classList.remove('visible');
    }

    /**
     * エラーを表示
     */
    showError(message) {
        alert(`エラー: ${message}`);
    }

    /**
     * クリップボードにコピー
     */
    async copyToClipboard() {
        const text = this.elements.resultText.textContent;

        try {
            // モダンなClipboard API
            await navigator.clipboard.writeText(text);
            this.showCopySuccess();
        } catch (err) {
            // フォールバック（古いブラウザ対応）
            this.fallbackCopy(text);
        }
    }

    /**
     * フォールバックコピー（古いブラウザ用）
     */
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (err) {
            this.showError('コピーに失敗しました。手動でコピーしてください。');
        }
        
        document.body.removeChild(textarea);
    }

    /**
     * コピー成功のフィードバック
     */
    showCopySuccess() {
        // ボタンの一時的な変更
        const originalText = this.elements.copyBtn.querySelector('.copy-text').textContent;
        const originalIcon = this.elements.copyBtn.querySelector('.copy-icon').textContent;
        
        this.elements.copyBtn.querySelector('.copy-text').textContent = 'コピーしました！';
        this.elements.copyBtn.querySelector('.copy-icon').textContent = '✅';
        this.elements.copyBtn.style.background = '#059669';
        
        // フィードバックメッセージ表示
        this.elements.copyFeedback.classList.add('visible');

        // 2秒後に元に戻す
        setTimeout(() => {
            this.elements.copyBtn.querySelector('.copy-text').textContent = originalText;
            this.elements.copyBtn.querySelector('.copy-icon').textContent = originalIcon;
            this.elements.copyBtn.style.background = '';
            this.elements.copyFeedback.classList.remove('visible');
        }, 2000);
    }

    /**
     * 生成イベントのトラッキング（拡張用）
     */
    trackGeneration(keyword, format) {
        // 将来的なアナリティクス連携用
        console.log(`[Analytics] Generated prompt for "${keyword}" with format "${format}"`);
        
        // ローカルストレージに使用履歴を保存（オプション）
        this.saveToHistory(keyword, format);
    }

    /**
     * 使用履歴の保存（拡張用）
     */
    saveToHistory(keyword, format) {
        try {
            const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
            history.unshift({
                keyword,
                format,
                timestamp: new Date().toISOString()
            });
            // 最新10件のみ保持
            localStorage.setItem('promptHistory', JSON.stringify(history.slice(0, 10)));
        } catch (e) {
            // ローカルストレージが使えない場合は無視
        }
    }
}

// =========================================
// アプリケーション起動
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // メインコントローラーの初期化
    window.app = new UIController();
    
    console.log('🎯 AIプロンプト生成ツール v1.0.0 起動完了');
});

// =========================================
// ユーティリティ関数（将来の拡張用）
// =========================================

/**
 * デバウンス関数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * エスケープ処理
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =========================================
// 拡張機能の設定（将来用）
// =========================================

const AppConfig = {
    version: '1.0.0',
    features: {
        history: true,      // 使用履歴機能
        analytics: false,   // アナリティクス
        darkMode: true,     // ダークモード（CSS側で対応済み）
        customTemplates: false  // カスタムテンプレート（将来実装）
    }
};
