const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 ここで `public/` フォルダを静的ファイル用ディレクトリとして登録
app.use(express.static("public"));

// OpenAI API の設定
const openai = new OpenAI({
  apiKey: process.env.OnLine_API_KEY1,
});

// 🎯 GPTのAPIエンドポイント `/api/gpt`
app.post("/api/gpt", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // OpenAI API 呼び出し
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      //model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 2000,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("エラー:", error);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

// 🔹 ルートアクセス `/` に `index.html` を返す
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
