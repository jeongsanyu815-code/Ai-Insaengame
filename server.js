require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/story", async (req, res) => {
  try {
    const { history, choice } = req.body;

    const prompt = `
당신은 텍스트 기반 인생 시뮬레이션 게임 AI입니다.

현재까지의 이야기:
${history}

플레이어 선택:
${choice}

다음을 생성하세요:
1. 새로운 이야기
2. 다음 선택지 3개

반드시 JSON 형식으로:
{
  "story": "내용",
  "choices": ["선택1", "선택2", "선택3"]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
    });

    const text = response.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        story: text,
        choices: ["계속한다", "다른 길을 간다", "포기한다"],
      };
    }

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI 오류 발생" });
  }
});

app.listen(3000, () => {
  console.log("서버 실행중");
});
