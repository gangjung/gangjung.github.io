// 가위바위보 전략을 객체로 관리

window.botList = [
  {
    name: "랜덤봇",
    func: "strategyRandom",
    desc: "가위, 바위, 보 중에서 완전히 무작위로 하나를 선택합니다. 예측이 불가능한 순수 랜덤 전략입니다.",
    strategy: function(history) {
      return moves[Math.floor(Math.random() * 3)];
    }
  },
  {
    name: "가위만내봇",
    func: "strategyAlwaysScissors",
    desc: "항상 '가위'만을 내는 단순한 전략입니다. 상대가 이를 파악하면 쉽게 이길 수 있습니다.",
    strategy: function(history) {
      return "scissors";
    }
  },
  {
    name: "순환봇",
    func: "strategyCycle",
    desc: "'가위'→'바위'→'보' 순서로 계속 반복해서 냅니다. 일정한 패턴을 가지고 있습니다.",
    strategy: function(history) {
      if (!history.length) return "rock";
      const last = history[history.length - 1].me;
      if (last === "rock") return "paper";
      if (last === "paper") return "scissors";
      return "rock";
    }
  },
  {
    name: "미러링봇",
    func: "strategyMirror",
    desc: "상대가 직전에 낸 손동작을 그대로 따라 냅니다. 첫 판은 무작위로 냅니다.",
    strategy: function(history) {
      if (!history.length) return moves[Math.floor(Math.random() * 3)];
      return history[history.length - 1].opponent;
    }
  },
  {
    name: "카운터봇",
    func: "strategyCounter",
    desc: "상대가 직전에 낸 손동작을 이길 수 있는 손동작을 냅니다. 첫 판은 무작위로 냅니다.",
    strategy: function(history) {
      if (!history.length) return moves[Math.floor(Math.random() * 3)];
      const last = history[history.length - 1].opponent;
      if (last === "rock") return "paper";
      if (last === "paper") return "scissors";
      return "rock";
    }
  },
  {
    name: "빈도봇",
    func: "strategyFrequency",
    desc: "상대가 지금까지 가장 많이 낸 손동작을 분석하여, 그 손동작을 이길 수 있는 손동작을 냅니다.",
    strategy: function(history) {
      if (!history.length) return moves[Math.floor(Math.random() * 3)];
      const freq = { rock: 0, paper: 0, scissors: 0 };
      history.forEach(h => freq[h.opponent]++);
      const maxMove = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
      if (maxMove === "rock") return "paper";
      if (maxMove === "paper") return "scissors";
      return "rock";
    }
  },
  {
    name: "마르코프봇",
    func: "strategyMarkov",
    desc: "상대의 최근 패턴(마르코프 체인)을 분석하여, 다음에 낼 확률이 높은 손동작을 예측하고 그에 대응합니다.",
    strategy: function(history) {
      if (history.length < 2) return moves[Math.floor(Math.random() * 3)];
      const transitions = { rock: { rock: 0, paper: 0, scissors: 0 }, paper: { rock: 0, paper: 0, scissors: 0 }, scissors: { rock: 0, paper: 0, scissors: 0 } };
      for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1].opponent;
        const curr = history[i].opponent;
        transitions[prev][curr]++;
      }
      const last = history[history.length - 1].opponent;
      const probs = transitions[last];
      const predicted = Object.keys(probs).reduce((a, b) => probs[a] > probs[b] ? a : b);
      if (predicted === "rock") return "paper";
      if (predicted === "paper") return "scissors";
      return "rock";
    }
  },
  {
    name: "메타봇",
    func: "strategyMeta",
    desc: "여러 전략(랜덤, 순환, 빈도 등)을 동시에 사용해, 가장 성적이 좋은 전략을 선택하여 냅니다.",
    strategy: function(history) {
      if (!history.length) return moves[Math.floor(Math.random() * 3)];
      const last = history[history.length - 1].me;
      if (last === "rock") return "scissors";
      if (last === "paper") return "rock";
      return "paper";
    }
  },
  {
    name: "미끼봇",
    func: "strategyBaiting",
    desc: "일정 횟수 같은 수(rock)만 내다가, 갑자기 다른 수를 내어 상대의 예측을 방해하는 전략입니다.",
    strategy: function(history) {
      if (history.length % 5 === 4) {
        return "paper";
      }
      return "rock";
    }
  },
  {
    name: "반복탐지봇",
    func: "strategyRepetitionSniffer",
    desc: "상대가 반복적으로 내는 패턴을 감지하여, 그 패턴을 이길 수 있는 손동작을 냅니다.",
    strategy: function(history) {
      if (history.length < 2) return moves[Math.floor(Math.random() * 3)];
      const last = history[history.length - 1].opponent;
      const prev = history[history.length - 2].opponent;
      if (last === prev) {
        if (last === "rock") return "paper";
        if (last === "paper") return "scissors";
        return "rock";
      }
      return moves[Math.floor(Math.random() * 3)];
    }
  },
  {
    name: "혼합봇",
    func: "strategyEnsemble",
    desc: "여러 전략 중 하나를 무작위로 선택하여 사용합니다.",
    strategy: function(history) {
      const strategies = [
        window.botList.find(b => b.func === "strategyRandom").strategy,
        window.botList.find(b => b.func === "strategyCounter").strategy,
        window.botList.find(b => b.func === "strategyFrequency").strategy,
        window.botList.find(b => b.func === "strategyCycle").strategy
      ];
      const idx = Math.floor(Math.random() * strategies.length);
      return strategies[idx](history);
    }
  },
  {
    name: "트렌드봇",
    func: "strategyTrend",
    desc: "상대가 최근에 자주 내는 손동작의 경향(트렌드)을 분석하여, 그에 맞춰 대응합니다.",
    strategy: function(history) {
      if (history.length < 3) return moves[Math.floor(Math.random() * 3)];
      const recent = history.slice(-3).map(h => h.opponent);
      const freq = { rock: 0, paper: 0, scissors: 0 };
      recent.forEach(m => freq[m]++);
      const maxMove = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
      if (maxMove === "rock") return "paper";
      if (maxMove === "paper") return "scissors";
      return "rock";
    }
  },
  {
    name: "2차예측봇",
    func: "strategySecondOrder",
    desc: "상대가 자신의 전략을 예측한다고 가정하고, 그 예측을 한 번 더 예측하여 대응하는 고차원 전략입니다.",
    strategy: function(history) {
      if (history.length < 3) return moves[Math.floor(Math.random() * 3)];
      const response = { rock: { rock: 0, paper: 0, scissors: 0 }, paper: { rock: 0, paper: 0, scissors: 0 }, scissors: { rock: 0, paper: 0, scissors: 0 } };
      for (let i = 1; i < history.length; i++) {
        const myPrev = history[i - 1].me;
        const oppNow = history[i].opponent;
        response[myPrev][oppNow]++;
      }
      const myLast = history[history.length - 1].me;
      const probs = response[myLast];
      const predicted = Object.keys(probs).reduce((a, b) => probs[a] > probs[b] ? a : b);
      if (predicted === "rock") return "paper";
      if (predicted === "paper") return "scissors";
      return "rock";
    }
  }
];

// 각 전략을 전역 함수로도 등록 (기존 코드 호환)
window.botList.forEach(bot => {
  window[bot.func] = bot.strategy;
});