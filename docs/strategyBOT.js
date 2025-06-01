// 다양한 연습 상대 전략 함수

// 1. 무작위 전략 (이미 있음)
function strategyRandom(history) {
  return moves[Math.floor(Math.random() * 3)];
}

// 2. 상대 최근 수 카운터 (이미 있음)
function strategyCounter(history) {
  if (!history.length) return moves[Math.floor(Math.random() * 3)];
  const last = history[history.length - 1].opponent;
  if (last === "rock") return "paper";
  if (last === "paper") return "scissors";
  return "rock";
}

// 3. 빈도 기반 전략(Frequency)
function strategyFrequency(history) {
  if (!history.length) return moves[Math.floor(Math.random() * 3)];
  const freq = { rock: 0, paper: 0, scissors: 0 };
  history.forEach(h => freq[h.opponent]++);
  // 상대가 가장 많이 낸 수를 이기는 수를 낸다
  const maxMove = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
  if (maxMove === "rock") return "paper";
  if (maxMove === "paper") return "scissors";
  return "rock";
}

// 4. 마르코프 예측 전략
function strategyMarkov(history) {
  if (history.length < 2) return moves[Math.floor(Math.random() * 3)];
  // 직전 상대 수를 기준으로 다음 수를 예측
  const transitions = { rock: { rock: 0, paper: 0, scissors: 0 }, paper: { rock: 0, paper: 0, scissors: 0 }, scissors: { rock: 0, paper: 0, scissors: 0 } };
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1].opponent;
    const curr = history[i].opponent;
    transitions[prev][curr]++;
  }
  const last = history[history.length - 1].opponent;
  const probs = transitions[last];
  const predicted = Object.keys(probs).reduce((a, b) => probs[a] > probs[b] ? a : b);
  // 예측한 수를 이기는 수
  if (predicted === "rock") return "paper";
  if (predicted === "paper") return "scissors";
  return "rock";
}

// 5. 메타 전략(2단 예측)
function strategyMeta(history) {
  // 상대가 카운터 전략을 쓴다고 가정하고, 그 카운터를 다시 카운터
  if (!history.length) return moves[Math.floor(Math.random() * 3)];
  const last = history[history.length - 1].me;
  // 내가 낸 수를 이기는 수를 상대가 낼 것이라 예측하고, 그걸 이기는 수를 낸다
  if (last === "rock") return "scissors";      // rock → 상대는 paper → 나는 scissors
  if (last === "paper") return "rock";         // paper → 상대는 scissors → 나는 rock
  return "paper";                              // scissors → 상대는 rock → 나는 paper
}

// 6. 순환 전략(Cycle) (이미 있음)
function strategyCycle(history) {
  if (!history.length) return "rock";
  const last = history[history.length - 1].me;
  if (last === "rock") return "paper";
  if (last === "paper") return "scissors";
  return "rock";
}

// 7. 미러링 전략
function strategyMirror(history) {
  if (!history.length) return moves[Math.floor(Math.random() * 3)];
  return history[history.length - 1].opponent;
}

// 8. 미끼 전략(Baiting)
function strategyBaiting(history) {
  // 일정 횟수 같은 수(rock)만 내다가, 갑자기 다른 수를 낸다
  if (history.length % 5 === 4) {
    return "paper";
  }
  return "rock";
}

// 9. 반복 탐지 전략(Repetition Sniffer)
function strategyRepetitionSniffer(history) {
  if (history.length < 2) return moves[Math.floor(Math.random() * 3)];
  const last = history[history.length - 1].opponent;
  const prev = history[history.length - 2].opponent;
  // 상대가 같은 수를 반복하면 그걸 이기는 수를 낸다
  if (last === prev) {
    if (last === "rock") return "paper";
    if (last === "paper") return "scissors";
    return "rock";
  }
  // 아니면 랜덤
  return moves[Math.floor(Math.random() * 3)];
}

// 10. 혼합 전략(Ensemble / Adaptive)
function strategyEnsemble(history) {
  // 여러 전략 중 랜덤하게 하나를 선택
  const strategies = [strategyRandom, strategyCounter, strategyFrequency, strategyCycle];
  const idx = Math.floor(Math.random() * strategies.length);
  return strategies[idx](history);
}

// 11. 트렌드 기반 전략
function strategyTrend(history) {
  if (history.length < 3) return moves[Math.floor(Math.random() * 3)];
  // 최근 3회의 상대 수 중 가장 많이 나온 수를 이기는 수
  const recent = history.slice(-3).map(h => h.opponent);
  const freq = { rock: 0, paper: 0, scissors: 0 };
  recent.forEach(m => freq[m]++);
  const maxMove = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
  if (maxMove === "rock") return "paper";
  if (maxMove === "paper") return "scissors";
  return "rock";
}

// 12. 2차 예측 전략(Second-Order)
function strategySecondOrder(history) {
  if (history.length < 3) return moves[Math.floor(Math.random() * 3)];
  // 상대가 내 직전 수에 어떻게 반응하는지 통계
  const response = { rock: { rock: 0, paper: 0, scissors: 0 }, paper: { rock: 0, paper: 0, scissors: 0 }, scissors: { rock: 0, paper: 0, scissors: 0 } };
  for (let i = 1; i < history.length; i++) {
    const myPrev = history[i - 1].me;
    const oppNow = history[i].opponent;
    response[myPrev][oppNow]++;
  }
  const myLast = history[history.length - 1].me;
  const probs = response[myLast];
  const predicted = Object.keys(probs).reduce((a, b) => probs[a] > probs[b] ? a : b);
  // 예측한 수를 이기는 수
  if (predicted === "rock") return "paper";
  if (predicted === "paper") return "scissors";
  return "rock";
}

// === 이미 있던 전략 ===

// 항상 가위만 내는 봇
function strategyAlwaysScissors(history) {
  return "scissors";
}