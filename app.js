const dimensions = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"]
};

const dimensionLabels = {
  EI: "外向 E / 内向 I",
  SN: "实感 S / 直觉 N",
  TF: "思考 T / 情感 F",
  JP: "判断 J / 知觉 P"
};

const questions = window.MBTI_QUESTIONS || [];

const typeProfiles = {
  INTJ: {
    title: "建筑师",
    description: "独立理性，擅长长期规划和系统化解决复杂问题。",
    strengths: ["战略思维", "目标感强", "善于分析"],
    careers: ["产品经理", "系统架构师", "研究分析师"]
  },
  INTP: {
    title: "逻辑学家",
    description: "好奇心强，喜欢探索原理、模型和各种可能性。",
    strengths: ["逻辑清晰", "创意丰富", "独立思考"],
    careers: ["软件工程师", "研究员", "数据分析师"]
  },
  ENTJ: {
    title: "指挥官",
    description: "目标明确、行动果断，擅长组织资源推动结果。",
    strengths: ["领导力", "决策力", "执行推动"],
    careers: ["创业者", "项目负责人", "企业管理者"]
  },
  ENTP: {
    title: "辩论家",
    description: "思维活跃，喜欢挑战旧观点并提出新方案。",
    strengths: ["反应快", "表达力强", "创新意识"],
    careers: ["市场策划", "产品创新", "咨询顾问"]
  },
  INFJ: {
    title: "提倡者",
    description: "理想感强，关注意义、成长和人与人之间的深层连接。",
    strengths: ["洞察力", "同理心", "长期愿景"],
    careers: ["心理咨询", "教育培训", "公益项目"]
  },
  INFP: {
    title: "调停者",
    description: "重视真实感受和内心价值，表达温和而有想象力。",
    strengths: ["共情能力", "文字表达", "价值感强"],
    careers: ["内容创作", "品牌文案", "用户研究"]
  },
  ENFJ: {
    title: "主人公",
    description: "热情有感染力，擅长理解他人并带动团队成长。",
    strengths: ["沟通力", "组织协调", "激励他人"],
    careers: ["教师", "人力资源", "社群运营"]
  },
  ENFP: {
    title: "竞选者",
    description: "热情开放，喜欢连接人和想法，善于发现新机会。",
    strengths: ["创意充沛", "适应力", "亲和力"],
    careers: ["新媒体运营", "品牌策划", "活动策划"]
  },
  ISTJ: {
    title: "物流师",
    description: "踏实可靠，重视规则、责任和稳定的执行结果。",
    strengths: ["责任心", "注重细节", "执行稳定"],
    careers: ["财务", "项目执行", "质量管理"]
  },
  ISFJ: {
    title: "守卫者",
    description: "温和细致，愿意为身边的人提供实际而稳定的支持。",
    strengths: ["耐心细致", "服务意识", "可靠踏实"],
    careers: ["行政支持", "护理", "客户服务"]
  },
  ESTJ: {
    title: "总经理",
    description: "务实高效，擅长建立秩序并推动任务落地。",
    strengths: ["组织能力", "结果导向", "执行力"],
    careers: ["运营管理", "行政管理", "项目管理"]
  },
  ESFJ: {
    title: "执政官",
    description: "亲和负责，重视关系氛围和团队中的实际需求。",
    strengths: ["协作能力", "责任感", "照顾他人"],
    careers: ["客户成功", "活动运营", "公共关系"]
  },
  ISTP: {
    title: "鉴赏家",
    description: "冷静灵活，喜欢通过动手实践解决现实问题。",
    strengths: ["动手能力", "临场反应", "独立判断"],
    careers: ["工程技术", "测试工程师", "设备维护"]
  },
  ISFP: {
    title: "探险家",
    description: "真诚敏感，重视审美体验和自由表达。",
    strengths: ["审美能力", "适应力", "温和真诚"],
    careers: ["视觉设计", "摄影", "内容编辑"]
  },
  ESTP: {
    title: "企业家",
    description: "行动迅速，喜欢直接体验并处理现场变化。",
    strengths: ["行动力", "社交能力", "抗压能力"],
    careers: ["销售", "商务拓展", "现场运营"]
  },
  ESFP: {
    title: "表演者",
    description: "外向热情，善于营造氛围并享受真实体验。",
    strengths: ["表现力", "亲和力", "乐于尝试"],
    careers: ["主持", "公关活动", "短视频创作"]
  }
};

const state = {
  currentQuestionNo: 1,
  answerRecords: [],
  isCompleted: false,
  result: null,
  chart: null
};

const views = {
  home: document.querySelector("#homeView"),
  quiz: document.querySelector("#quizView"),
  result: document.querySelector("#resultView")
};

const els = {
  startBtn: document.querySelector("#startBtn"),
  backHomeBtn: document.querySelector("#backHomeBtn"),
  progressText: document.querySelector("#progressText"),
  dimensionText: document.querySelector("#dimensionText"),
  progressBar: document.querySelector("#progressBar"),
  questionCard: document.querySelector("#questionCard"),
  questionNumber: document.querySelector("#questionNumber"),
  questionText: document.querySelector("#questionText"),
  optionA: document.querySelector("#optionA"),
  optionB: document.querySelector("#optionB"),
  prevBtn: document.querySelector("#prevBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  resultType: document.querySelector("#resultType"),
  resultTitle: document.querySelector("#resultTitle"),
  resultDescription: document.querySelector("#resultDescription"),
  chartSummary: document.querySelector("#chartSummary"),
  scoreChart: document.querySelector("#scoreChart"),
  chartFallback: document.querySelector("#chartFallback"),
  strengthList: document.querySelector("#strengthList"),
  careerList: document.querySelector("#careerList"),
  retryBtn: document.querySelector("#retryBtn"),
  shareBtn: document.querySelector("#shareBtn"),
  toast: document.querySelector("#toast")
};

function showView(name) {
  Object.values(views).forEach((view) => view.classList.remove("view-active"));
  views[name].classList.add("view-active");
}

function resetState() {
  state.currentQuestionNo = 1;
  state.answerRecords = [];
  state.isCompleted = false;
  state.result = null;
  destroyChart();
}

function getCurrentIndex() {
  return state.currentQuestionNo - 1;
}

function getCurrentQuestion() {
  return questions[getCurrentIndex()];
}

function getAnswerRecord(questionId) {
  return state.answerRecords.find((record) => record.questionId === questionId);
}

function hasAnsweredCurrentQuestion() {
  const question = getCurrentQuestion();
  return Boolean(question && getAnswerRecord(question.id));
}

function areAllQuestionsAnswered() {
  return questions.every((question) => getAnswerRecord(question.id));
}

function saveAnswer(questionId, selectedOption) {
  const existingRecord = getAnswerRecord(questionId);

  if (existingRecord) {
    existingRecord.selectedOption = selectedOption;
    existingRecord.answeredAt = new Date().toISOString();
    return;
  }

  state.answerRecords.push({
    questionId,
    selectedOption,
    answeredAt: new Date().toISOString()
  });
}

function isLieDetectionQuestion(question) {
  return question.category === "lie_detection";
}

function destroyChart() {
  if (!state.chart) return;
  state.chart.destroy();
  state.chart = null;
}

function startQuiz() {
  resetState();
  showView("quiz");
  renderQuestion();
}

function renderQuestion(direction = "forward") {
  const question = getCurrentQuestion();
  const answerRecord = getAnswerRecord(question.id);
  const selected = answerRecord?.selectedOption;

  els.questionCard.classList.remove("slide-in");
  els.questionCard.classList.add(direction === "backward" ? "slide-out-right" : "slide-out-left");

  window.setTimeout(() => {
    els.questionNumber.textContent = `Q${question.id}`;
    els.questionText.textContent = question.text;
    els.optionA.innerHTML = `<span>选项 A</span>${question.options.A}`;
    els.optionB.innerHTML = `<span>选项 B</span>${question.options.B}`;
    els.progressText.textContent = `${state.currentQuestionNo} / ${questions.length}`;
    els.dimensionText.textContent = isLieDetectionQuestion(question)
      ? "答题一致性"
      : dimensionLabels[question.dimension];
    els.progressBar.style.width = `${(state.currentQuestionNo / questions.length) * 100}%`;

    setSelectedOption(selected);
    els.prevBtn.disabled = state.currentQuestionNo === 1;
    els.nextBtn.textContent = state.currentQuestionNo === questions.length ? "查看结果" : "下一题";
    els.nextBtn.disabled = !selected;

    els.questionCard.classList.remove("slide-out-left", "slide-out-right");
    els.questionCard.classList.add("slide-in");
  }, 180);
}

function setSelectedOption(selected) {
  els.optionA.classList.toggle("selected", selected === "A");
  els.optionB.classList.toggle("selected", selected === "B");
}

function selectOption(option) {
  const question = getCurrentQuestion();
  saveAnswer(question.id, option);
  setSelectedOption(option);
  els.nextBtn.disabled = false;
}

function goPrev() {
  if (state.currentQuestionNo === 1) return;
  state.currentQuestionNo -= 1;
  renderQuestion("backward");
}

function goNext() {
  if (!hasAnsweredCurrentQuestion()) {
    showToast("请先选择一个选项");
    return;
  }

  if (state.currentQuestionNo === questions.length) {
    completeQuiz();
    return;
  }

  state.currentQuestionNo += 1;
  renderQuestion("forward");
}

function completeQuiz() {
  if (!areAllQuestionsAnswered()) {
    showToast("还有题目没有完成");
    return;
  }

  state.isCompleted = true;
  showResult();
}

function calculateResult() {
  const scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0
  };

  const totals = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };

  let lieDetectionAbnormalCount = 0;

  questions.forEach((question) => {
    const answerRecord = getAnswerRecord(question.id);
    const selected = answerRecord?.selectedOption;

    if (isLieDetectionQuestion(question)) {
      if (selected === "A") {
        lieDetectionAbnormalCount += 1;
      }
      return;
    }

    totals[question.dimension] += 1;
    const [firstPole, secondPole] = dimensions[question.dimension];
    const selectedFirstPole =
      question.direction === "positive" ? selected === "A" : selected === "B";

    scores[selectedFirstPole ? firstPole : secondPole] += 1;
  });

  const type = Object.entries(dimensions)
    .map(([dimension, [firstPole, secondPole]]) => {
      return scores[firstPole] >= totals[dimension] / 2 ? firstPole : secondPole;
    })
    .join("");

  return {
    type,
    scores,
    totals,
    lieDetectionAbnormalCount,
    lieWarning: lieDetectionAbnormalCount > 1
  };
}

function showResult() {
  state.result = calculateResult();
  const profile = typeProfiles[state.result.type];
  const truthfulnessHint = state.result.lieWarning ? " 答题可能不够真实，建议重新测试。" : "";

  els.resultType.textContent = state.result.type;
  els.resultTitle.textContent = profile.title;
  els.resultDescription.textContent = `${profile.description}${truthfulnessHint}`;
  els.strengthList.innerHTML = profile.strengths.map((item) => `<li>${item}</li>`).join("");
  els.careerList.innerHTML = profile.careers.map((item) => `<li>${item}</li>`).join("");
  els.chartSummary.textContent = "含 2 道一致性题，不计入类型";

  showView("result");
  renderChart();
}

function getDimensionPercents() {
  return Object.entries(dimensions).map(([dimension, [firstPole]]) => {
    const total = state.result.totals[dimension];
    const value = state.result.scores[firstPole];
    return {
      label: dimensionLabels[dimension].replace(" / ", " vs "),
      value,
      percent: Math.round((value / total) * 100)
    };
  });
}

function renderChart() {
  const rows = getDimensionPercents();
  const labels = rows.map((row) => row.label);
  const data = rows.map((row) => row.percent);

  destroyChart();

  if (!window.Chart) {
    renderFallbackChart(rows);
    return;
  }

  els.scoreChart.hidden = false;
  els.chartFallback.hidden = true;

  state.chart = new Chart(els.scoreChart, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "第一极倾向占比",
          data,
          borderRadius: 8,
          backgroundColor: ["#246bfe", "#14a46c", "#f1b83b", "#e85c87"]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.raw}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`
          },
          grid: { color: "rgba(104, 112, 131, 0.16)" }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#687083" }
        }
      }
    }
  });
}

function renderFallbackChart(rows) {
  els.scoreChart.hidden = true;
  els.chartFallback.hidden = false;
  els.chartFallback.innerHTML = rows
    .map(
      (row) => `
        <div class="fallback-row">
          <span>${row.label.split(" ")[0]}</span>
          <div class="fallback-track">
            <div class="fallback-fill" style="width: ${row.percent}%"></div>
          </div>
          <strong>${row.percent}%</strong>
        </div>
      `
    )
    .join("");
}

async function copyResult() {
  if (!state.result) return;
  const profile = typeProfiles[state.result.type];
  const warning = state.result.lieWarning ? "（答题可能不够真实）" : "";
  const text = `我的 MBTI 测试结果是 ${state.result.type} ${profile.title}${warning}：${profile.description}`;

  try {
    await navigator.clipboard.writeText(text);
    showToast("结果文案已复制");
  } catch {
    showToast(text);
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2200);
}

els.startBtn.addEventListener("click", startQuiz);
els.backHomeBtn.addEventListener("click", () => showView("home"));
els.optionA.addEventListener("click", () => selectOption("A"));
els.optionB.addEventListener("click", () => selectOption("B"));
els.prevBtn.addEventListener("click", goPrev);
els.nextBtn.addEventListener("click", goNext);
els.retryBtn.addEventListener("click", startQuiz);
els.shareBtn.addEventListener("click", copyResult);
