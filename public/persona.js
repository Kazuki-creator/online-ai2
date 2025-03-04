import generatePersonaPrompt from './persona_prompt.js';

console.log("✅ persona.js が実行されました！");

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("persona-submit-btn");
  const inputField = document.getElementById("persona-input");
  const messageEl = document.getElementById("message");
  const outputContainer = document.getElementById("output-container");
  const outputTextarea = document.getElementById("persona-output");
  const copyBtn = document.getElementById("copy-btn");
  const copySuccess = document.getElementById("copy-success");
  const completionMessage = document.getElementById("completion-message");
  const progressFill = document.getElementById("progress-fill");
  const createSeminarBtn = document.getElementById("create-seminar-btn");
  
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

  // 進捗ステップを更新する関数（新しい進捗バー用）
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
    
    // セミナー作成ボタンも非表示に
    if (createSeminarBtn) {
      createSeminarBtn.style.display = "none";
    }
  };

  submitBtn.addEventListener("click", async () => {
    // ユーザーの入力内容を取得
    const userInput = inputField.value;
    
    if (!userInput.trim()) {
      messageEl.textContent = "⚠️ 商品名を入力してください";
      return;
    }
    
    // 最初にすべてをリセット
    resetAllSteps();
    
    // ステップ1: データ解析開始
    updateProgressStep(1);
    messageEl.textContent = "🔍 データを解析中...";
    
    // ユーザー入力からプロンプトを生成
    const promptText = generatePersonaPrompt(userInput);
    
    try {
      // ステップが進むごとに表示を更新（タイミングをずらす）
      setTimeout(() => {
        updateProgressStep(2);
        messageEl.textContent = "👤 ペルソナを構築中...";
      }, 800);

      setTimeout(() => {
        updateProgressStep(3);
        messageEl.textContent = "📝 背景ストーリーを作成中...";
      }, 1600);
      
      // Deepseek APIリクエスト
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptText }),
      });

      const data = await response.json();
      
      // ステップ4: 出力整形と完了
      setTimeout(() => {
        updateProgressStep(4);
        messageEl.textContent = "✅ 処理が完了しました";
        
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
        
        // セミナー作成ボタンを表示し、ペルソナデータを保存
        if (createSeminarBtn) {
          createSeminarBtn.style.display = "block";
          // ペルソナデータをセッションストレージに保存
          sessionStorage.setItem("personaData", data.reply);
        }
        
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