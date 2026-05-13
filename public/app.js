const storyDiv = document.getElementById("story");
const choicesDiv = document.getElementById("choices");
const historyList = document.getElementById("history");

let historyText = "게임 시작";

const startChoices = [
  "초대장을 연다",
  "버린다",
  "친구에게 보여준다",
];

renderChoices(startChoices);

function renderChoices(choices) {

  choicesDiv.innerHTML = "";

  choices.forEach(choice => {

    const btn = document.createElement("button");

    btn.className = "choice-btn";
    btn.innerText = choice;

    btn.onclick = () => next(choice);

    choicesDiv.appendChild(btn);
  });
}

async function next(choice) {

  const li = document.createElement("li");

  li.innerText = choice;

  historyList.appendChild(li);

  historyText += `\n- ${choice}`;

  storyDiv.innerHTML = "AI가 이야기 생성 중...";

  try {

    const res = await fetch("/story", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        history: historyText,
        choice,
      }),
    });

    const data = await res.json();

    console.log(data);

    storyDiv.innerHTML =
      data.story || "스토리 생성 실패";

    renderChoices(
      data.choices || [
        "계속한다",
        "다른 길을 간다",
        "포기한다",
      ]
    );

  } catch (err) {

    console.error(err);

    storyDiv.innerHTML =
      "서버 연결 실패";

    renderChoices([
      "다시 시도",
      "처음으로",
      "종료"
    ]);
  }
}
