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

  storyDiv.innerHTML = data.story;

  renderChoices(data.choices);
}
