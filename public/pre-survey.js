// pre-survey.js
// pre-survey_prompt.js からプロンプト生成関数をインポート
import generatePreSurveyPrompt from './pre-survey_prompt.js';

console.log("✅ pre-survey.js が実行されました！");

document.addEventListener("DOMContentLoaded", () => {
  // 各質問のテキストエリア取得
  const question1Input = document.getElementById("question1");
  const question2Input = document.getElementById("question2");
  const question3Input = document.getElementById("question3");
  const question4Input = document.getElementById("question4");
  const question5Input = document.getElementById("question5");

  // 送信ボタンと結果表示エリア取得
  const submitBtn = document.getElementById("pre-survey-submit-btn");
  const messageEl = document.getElementById("pre-survey-message");

  if (!submitBtn || !messageEl || !question1Input || !question2Input ||
      !question3Input || !question4Input || !question5Input) {
    console.error("必要な要素が見つかりません！");
    return;
  }

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // デフォルト送信をキャンセル

    // ユーザー回答をオブジェクトにまとめる
    const responses = {
      question1: question1Input.value,
      question2: question2Input.value,
      question3: question3Input.value,
      question4: question4Input.value,
      question5: question5Input.value
    };

    console.log("ユーザー回答:", responses);

    // プロンプトテキスト生成
    const promptText = generatePreSurveyPrompt(responses);
    console.log("生成されたプロンプト:", promptText);

    // 結果表示エリアに考え中のメッセージをセット
    messageEl.textContent = "🤖 AIが考え中…";

    try {
      // GPT API エンドポイントへプロンプトを送信
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptText })
      });
      const data = await response.json();
      const formattedReply = data.reply.replace(/\n/g, "<br>");
      messageEl.innerHTML = "💡 AIの答え: " + formattedReply;
    } catch (error) {
      console.error("エラー:", error);
      messageEl.textContent = "⚠️ エラーが発生しました";
    }
  });
});
