// testOpenAI.js

// OpenAIライブラリのインポート（CommonJS版の書き方）
const OpenAI = require("openai");

// APIキーを環境変数から取得
const openai = new OpenAI({
  apiKey: process.env.OnLine_API_KEY1, // 環境変数からAPIキーを取得
});

// テスト用の非同期関数
async function testGPT() {
  try {
    // ChatCompletion APIを呼び出し
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "こんにちは！あなたは誰ですか？" }],
      max_tokens: 400,
    });

    // 応答テキストを取得
    const gptReply = response.choices[0].message.content;

    // コンソールに出力
    console.log("GPTからの応答:", gptReply);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

// 関数を実行
testGPT();
