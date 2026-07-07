const assert = require("node:assert/strict");

global.window = {};
require("./questions-data.js");

const questions = global.window.MBTI_QUESTIONS;

const dimensions = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"]
};

const dimensionIndex = {
  EI: 0,
  SN: 1,
  TF: 2,
  JP: 3
};

function isLieDetectionQuestion(question) {
  return question.category === "lie_detection";
}

function optionForPole(question, targetPole) {
  const [firstPole, secondPole] = dimensions[question.dimension];
  const wantsFirstPole = targetPole === firstPole;

  if (targetPole !== firstPole && targetPole !== secondPole) {
    throw new Error(`Invalid target pole ${targetPole} for ${question.dimension}`);
  }

  if (question.direction === "positive") {
    return wantsFirstPole ? "A" : "B";
  }

  return wantsFirstPole ? "B" : "A";
}

function buildAnswersForType(type, lieOption = "B") {
  return questions.map((question) => {
    if (isLieDetectionQuestion(question)) {
      return {
        questionId: question.id,
        selectedOption: lieOption
      };
    }

    return {
      questionId: question.id,
      selectedOption: optionForPole(question, type[dimensionIndex[question.dimension]])
    };
  });
}

function expectedScoresForType(type) {
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

  Object.entries(dimensions).forEach(([dimension]) => {
    scores[type[dimensionIndex[dimension]]] = 20;
  });

  return scores;
}

function calculateMbtiResult(answerRecords) {
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
  const answerMap = new Map(answerRecords.map((answer) => [answer.questionId, answer]));

  questions.forEach((question) => {
    const answer = answerMap.get(question.id);

    if (!answer) {
      throw new Error(`Missing answer for question ${question.id}`);
    }

    if (answer.selectedOption !== "A" && answer.selectedOption !== "B") {
      throw new Error(`Invalid option for question ${question.id}: ${answer.selectedOption}`);
    }

    if (isLieDetectionQuestion(question)) {
      if (answer.selectedOption === "A") {
        lieDetectionAbnormalCount += 1;
      }
      return;
    }

    totals[question.dimension] += 1;
    const [firstPole, secondPole] = dimensions[question.dimension];
    const selectedFirstPole =
      question.direction === "positive" ? answer.selectedOption === "A" : answer.selectedOption === "B";

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

function assertQuestionDistribution() {
  assert.equal(questions.length, 82, "题库总数应为 82");
  assert.equal(questions.filter(isLieDetectionQuestion).length, 2, "测谎题应为 2 道");

  Object.keys(dimensions).forEach((dimension) => {
    const items = questions.filter((question) => question.dimension === dimension);
    assert.equal(items.length, 20, `${dimension} 应为 20 道`);
    assert.equal(
      items.filter((question) => question.direction === "positive").length,
      10,
      `${dimension} positive 应为 10 道`
    );
    assert.equal(
      items.filter((question) => question.direction === "negative").length,
      10,
      `${dimension} negative 应为 10 道`
    );
  });
}

function assertNoThreeSameDimensions() {
  const visibleDimensions = questions.map((question) =>
    isLieDetectionQuestion(question) ? "lie_detection" : question.dimension
  );

  for (let index = 0; index <= visibleDimensions.length - 3; index += 1) {
    const slice = visibleDimensions.slice(index, index + 3);
    assert.notDeepEqual(slice, [slice[0], slice[0], slice[0]], `第 ${index + 1} 题起出现连续 3 题同类型`);
  }
}

assertQuestionDistribution();
assertNoThreeSameDimensions();

["ENFJ", "ISTP", "INFP"].forEach((expectedType) => {
  const result = calculateMbtiResult(buildAnswersForType(expectedType));

  assert.equal(result.type, expectedType, `类型应为 ${expectedType}`);
  assert.deepEqual(result.scores, expectedScoresForType(expectedType), `${expectedType} 分数不符合预期`);
  assert.equal(result.lieWarning, false, `${expectedType} 正常作答不应触发测谎提示`);

  console.log(`PASS ${expectedType}:`, result.scores);
});

const suspiciousResult = calculateMbtiResult(buildAnswersForType("ENFJ", "A"));
assert.equal(suspiciousResult.lieWarning, true, "两道测谎题均选 A 时应提示答题可能不够真实");

console.log("All MBTI scoring tests passed.");
