const moves = ["rock", "paper", "scissors"];

// 승부 판정 함수
function judge(a, b) {
  if (a === b) return 0;
  if (
    (a === "rock" && b === "scissors") ||
    (a === "paper" && b === "rock") ||
    (a === "scissors" && b === "paper")
  ) return 1; // A 승
  return -1; // B 승
}

// 이름 색상 함수
function colorizeName(name, isA) {
  return isA
    ? `<span style="color:#FF4136;font-weight:bold;">${name}</span>`   // A: 빨강
    : `<span style="color:#0074D9;font-weight:bold;">${name}</span>`;  // B: 파랑
}

// 패 색상 함수 (공통, 이긴 쪽만 bold, 모두 검정)
function colorizeMove(move, isWinner) {
  if (isWinner) {
    return `<span style="color:#111;font-weight:bold;">${move}</span>`;
  }
  return `<span style="color:#111;">${move}</span>`;
}

// 전략 함수는 별도 파일에서 불러옴
// strategyA와 strategyB는 각각 strategyA.js, strategyB.js에서 정의되어야 함

async function playMultipleMatches() {
  const playerAName = window.playerAName || "Player A";
  const playerBName = window.playerBName || "Player B";
  let count;
  if (window.promptInput !== undefined) {
    count = parseInt(window.promptInput, 10);
  } else {
    count = parseInt(prompt("몇 판을 대결하시겠습니까?"), 10);
  }
  if (isNaN(count) || count <= 0) {
    document.getElementById('output').innerHTML = "잘못된 입력입니다.";
    return;
  }

  if (typeof strategyA !== "function" || typeof strategyB !== "function") {
    document.getElementById('output').innerHTML = "strategyA.js 또는 strategyB.js 파일에서 전략 함수를 정의하세요.";
    return;
  }

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = ""; // 이전 결과 지우기

  let historyA = [];
  let historyB = [];
  let scoreA = 0, scoreB = 0, draws = 0;

  let roundLines = [];
  for (let i = 1; i <= count; i++) {
    const moveA = strategyA(historyA);
    const moveB = strategyB(historyB);
    const result = judge(moveA, moveB);

    let moveAHtml = colorizeMove(moveA, result === 1);
    let moveBHtml = colorizeMove(moveB, result === -1);

    let line = `<b>Round ${i}</b> - ${colorizeName(playerAName, true)}: ${moveAHtml} | ${colorizeName(playerBName, false)}: ${moveBHtml}<br>`;

    if (result === 1) {
      scoreA++;
      line += `➡️ ${colorizeName(playerAName, true)} wins! (${scoreA} : ${scoreB})<br>`;
    } else if (result === -1) {
      scoreB++;
      line += `➡️ ${colorizeName(playerBName, false)} wins! (${scoreA} : ${scoreB})<br>`;
    } else {
      draws++;
      line += `➡️ It's a draw! (${scoreA} : ${scoreB})<br>`;
    }
    line += `<br>`;

    roundLines.unshift(line); // 최신 라운드가 위에

    // 라운드별 실시간 출력
    outputDiv.innerHTML =
      `<b>${playerAName} vs ${playerBName} 대결 시작!</b><br>` +
      `총 ${count}번의 대결을 진행합니다.<br><br>` +
      roundLines.join("");

    historyA.push({ me: moveA, opponent: moveB });
    historyB.push({ me: moveB, opponent: moveA });

    await new Promise(res => setTimeout(res, 100));
  }

  // 대결 종료 후 결과 요약을 마지막 라운드 위에 삽입
  const summary =
    `<br><b>=== 결과 요약 ===</b><br>` +
    `${colorizeName(playerAName, true)} 승: ${scoreA}<br>` +
    `${colorizeName(playerBName, false)} 승: ${scoreB}<br>` +
    `무승부: ${draws}<br><br>`;

  // // roundLines[0]이 최신 라운드, 마지막 라운드 위에 summary 삽입
  // if (roundLines.length > 1) {
  //   roundLines.splice(1, 0, summary);
  // } else if (roundLines.length === 1) {
  //   roundLines.push(summary);
  // }

  roundLines.unshift(summary); // summary를 가장 위에 추가

  outputDiv.innerHTML =
    `<b>${playerAName} vs ${playerBName} 대결 시작!</b><br>` +
    `총 ${count}번의 대결을 진행합니다.<br><br>` +
    roundLines.join("");
}

// playMultipleMatches(); // <-- 이 줄은 주석 처리 또는 삭제!
window.playMultipleMatches = playMultipleMatches; // <- 추가
