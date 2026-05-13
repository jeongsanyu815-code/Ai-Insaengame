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

반드시 JSON 형식으로 대답:

{
  "story": "내용",
  "choices": ["선택1", "선택2", "선택3"]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.9,
    });

    const text = response.choices[0].message.content;

    console.log("AI 응답:");
    console.log(text);

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = {
        story: text || "AI 응답 오류",
        choices: [
          "계속한다",
          "다른 길을 간다",
          "포기한다",
        ],
      };
    }

    res.json(parsed);

  } catch (err) {

    console.error("서버 오류:");
    console.error(err);

    res.status(500).json({
      story: "서버 오류 발생",
      choices: [
        "다시 시도",
        "처음으로",
        "종료"
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버 실행중: ${PORT}`);
});
