// モジュールインポートを修正して通常の変数で対応
// generateSeminarTitlePrompt関数を直接定義
function generateSeminarTitlePrompt(userInput) {
  const prompt = 
`# 2時間フロントセミナーの魅力的なタイトル作成プロンプト

以下のペルソナ情報に基づいて、このターゲットを惹きつける2時間のフロントセミナーのタイトルを10個作成してください。セミナーで得られる具体的な学びや価値を明確に伝えるタイトルを目指します。

## ペルソナ情報

${userInput}

## タイトル作成の要件
1. 「2時間で学べる」「今日から使える」など、セミナー内で完結する価値を強調する
2. セミナーで得られる具体的なスキルや方法を明示する
3. 仕事で成功している人が私生活でも成功するための「足りないピース」を示唆する
4. 「たった2時間で」「今すぐ実践できる」など即効性を感じさせる表現を含める
5. シンプルで覚えやすいタイトルにする（30文字以内が理想）
6. 参加することで得られる明確な成果やメリットを伝える
7. 核心的課題に触れる（自己否定、理想と現実のギャップ、思い通りにならない現実）
8. 希望を示す（自信回復、目標達成、充実した人生）
9. 具体的なメソッドの存在を匂わせる
10. 即効性と確実性を感じさせる


## タイトル構成の基本パターン
「[時間軸] [学べること/得られるもの] [結果/メリット]」
例：「2時間で学ぶ 目標達成の盲点 ～仕事でできるのに私生活で詰まる理由～」

## タイトル例
「2時間で習得！仕事の成功を人生全体に広げる5つの原則」
「今日から使える！完璧主義を味方につける目標達成術」

## 作成するタイトルのバリエーション
- 疑問形で終わるタイプ
- 数字を含むタイプ
- 対比を含むタイプ
- 秘密・メソッドを示唆するタイプ
- ストーリー性のあるタイプ

10個のシンプルで魅力的なタイトルを作成してください。それぞれ「このセミナーで何を学べるのか」が明確に伝わるようにし、なぜこのペルソナに響くのか、簡潔な解説（1-2文）も添えてください。
`;
  return prompt;
}

console.log("✅ seminer-title.js が実行されました！");

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("seminar-submit-btn");
  const inputField = document.getElementById("seminar-input");
  const messageEl = document.getElementById("message");
  const outputContainer = document.getElementById("output-container");
  const outputTextarea = document.getElementById("seminar-output");
  const copyBtn = document.getElementById("copy-btn");
  const copySuccess = document.getElementById("copy-success");
  const completionMessage = document.getElementById("completion-message");
  const progressFill = document.getElementById("progress-fill");
  
  // 進捗ステップ要素
  const stepElements = {
    step1: document.getElementById("step-1"),
    step2: document.getElementById("step-2"),
    step3: document.getElementById("step-3"),
    step4: document.getElementById("step-4")
  };

  if (!submitBtn || !inputField || !messageEl) {
    console.error("必要な要素が見つかりません！");
    return;
  }

  // 進捗ステップを更新する関数
  const updateProgressStep = (stepNumber) => {
    // プログレスバーの塗りつぶし幅を計算（0%から100%まで）
    const progressPercentage = (stepNumber - 1) * 33.33; // 3ステップで100%になるよう計算
    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }
    
    // すべてのステップをリセット
    Object.values(stepElements).forEach((el, index) => {
      if (el) {
        el.classList.remove("active");
        el.classList.remove("completed");
        
        // 完了したステップにcompletedクラスを追加
        if (index + 1 < stepNumber) {
          el.classList.add("completed");
        }
        
        // 現在のステップにactiveクラスを追加
        if (index + 1 === stepNumber) {
          el.classList.add("active");
        }
      }
    });
  };

  // すべてのステップをリセットする関数
  const resetAllSteps = () => {
    Object.values(stepElements).forEach(el => {
      if (el) {
        el.classList.remove("active");
        el.classList.remove("completed");
      }
    });
    
    if (progressFill) {
      progressFill.style.width = "0%";
    }
    
    if (completionMessage) {
      completionMessage.style.display = "none";
    }
    
    if (outputContainer) {
      outputContainer.style.display = "none";
    }
  };

  // セッションストレージからペルソナデータを読み込む
  const savedPersonaData = sessionStorage.getItem("personaData");
  if (savedPersonaData) {
    inputField.value = savedPersonaData;
    messageEl.textContent = "✅ ペルソナデータをロードしました。必要に応じて編集し、送信してください。";
  }

  // 送信機能
  submitBtn.addEventListener("click", async () => {
    console.log("送信ボタンがクリックされました");
    // ユーザーの入力内容を取得
    const userInput = inputField.value;
    
    if (!userInput.trim()) {
      messageEl.textContent = "⚠️ ペルソナ情報を入力してください";
      return;
    }
    
    // 最初にすべてをリセット
    resetAllSteps();
    
    // ステップ1: データ解析開始
    updateProgressStep(1);
    messageEl.textContent = "🔍 ペルソナデータを解析中...";
    
    // ユーザー入力からプロンプトを生成
    const promptText = generateSeminarTitlePrompt(userInput);
    
    try {
      // ステップが進むごとに表示を更新（タイミングをずらす）
      setTimeout(() => {
        updateProgressStep(2);
        messageEl.textContent = "📝 タイトル構成を構築中...";
      }, 800);

      setTimeout(() => {
        updateProgressStep(3);
        messageEl.textContent = "🚀 魅力的なタイトルを生成中...";
      }, 1600);
      
      // API リクエスト
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptText }),
      });

      const data = await response.json();
      
      // ステップ4: 出力整形と完了
      setTimeout(() => {
        updateProgressStep(4);
        messageEl.textContent = "✅ タイトル生成が完了しました";
        
        // プログレスバーを完了状態に
        if (progressFill) {
          progressFill.style.width = "100%";
        }
        
        // 完了メッセージを表示
        if (completionMessage) {
          completionMessage.style.display = "flex";
        }
        
        // 結果をテキストエリアに表示
        outputTextarea.value = data.reply;
        outputContainer.style.display = "block";
        
        // スムーズにスクロール
        outputContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 2000);
      
    } catch (error) {
      console.error("エラー:", error);
      messageEl.textContent = "⚠️ エラーが発生しました: " + error.message;
      resetAllSteps();
    }
  });
  
  // コピーボタンの機能
  copyBtn.addEventListener("click", () => {
    outputTextarea.select();
    document.execCommand("copy");
    
    // コピー成功メッセージを表示
    copySuccess.classList.add("show");
    
    // 2秒後にメッセージを非表示
    setTimeout(() => {
      copySuccess.classList.remove("show");
    }, 2000);
  });
});