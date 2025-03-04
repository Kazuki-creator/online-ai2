// goal-setting_prompt.js からプロンプト生成関数をインポート
import generateGoalSettingPrompt from './goal-setting_prompt.js';

console.log("✅ goal-setting.js が実行されました！");

document.addEventListener("DOMContentLoaded", () => {
  // 各テキストエリアの取得
  const valueInput = document.getElementById("value");
  const futureInput = document.getElementById("future");
  const currentInput = document.getElementById("current");
  const strengthInput = document.getElementById("strength");
  const ngListInput = document.getElementById("ngList");
  const achievedImageInput = document.getElementById("achievedImage");
  const skillsInput = document.getElementById("skills");
  const obstaclesInput = document.getElementById("obstacles");

  // 送信ボタンと結果表示エリアの取得
  const submitBtn = document.getElementById("goal-setting-submit-btn");
  const messageEl = document.getElementById("goal-setting-message");

  if (!submitBtn || !messageEl || !valueInput || !futureInput || !currentInput ||
      !strengthInput || !ngListInput || !achievedImageInput || !skillsInput || !obstaclesInput) {
    console.error("必要な要素が見つかりません！");
    return;
  }

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // ページリロードを防ぐ

    // ユーザーの各入力値を取得してオブジェクトにまとめる
    const userInputs = {
      value: valueInput.value,
      future: futureInput.value,
      current: currentInput.value,
      strength: strengthInput.value,
      ngList: ngListInput.value,
      achievedImage: achievedImageInput.value,
      skills: skillsInput.value,
      obstacles: obstaclesInput.value
    };

    console.log("ユーザー入力:", userInputs);

    // 送信するプロンプトテキストを生成
    const promptText = generateGoalSettingPrompt(userInputs);
    console.log("生成されたプロンプト:", promptText);

    // 結果表示エリアに「考え中…」をセット
    messageEl.textContent = "🤖 AIが考え中…";

    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptText })
      });
      const data = await response.json();
      if (!data.reply) {
        throw new Error("reply プロパティが返されていません");
      }
      const formattedReply = data.reply.replace(/\n/g, "<br>");
      messageEl.innerHTML = "<br>💡 GPTの答え:<br><br> " + formattedReply;
    } catch (error) {
      console.error("エラー:", error);
      messageEl.textContent = "⚠️ エラーが発生しました";
    }

  });
});
