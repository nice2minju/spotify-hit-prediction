const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title  = "Spotify 히트곡 예측";

// ── 색상 팔레트 (Spotify 스타일) ──────────────────────────
const C = {
  dark:    "121212",  // Spotify 다크
  green:   "1DB954",  // Spotify 그린
  green2:  "158A3E",  // 진한 그린
  white:   "FFFFFF",
  offwhite:"F5F5F5",
  gray:    "B3B3B3",
  darkgray:"535353",
  text:    "1C1C1C",
  subtext: "535353",
  card:    "FFFFFF",
  red:     "E74C3C",
  amber:   "F39C12",
  blue:    "2980B9",
};

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.12
});

// ════════════════════════════════════════════════════════════
// SLIDE 1 — 제목 (다크)
// ════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // 왼쪽 초록 사이드바
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: C.green }, line: { color: C.green }
  });

  // 장식 원들
  s.addShape(pres.shapes.OVAL, {
    x: 7.0, y: -0.4, w: 3.5, h: 3.5,
    fill: { color: C.green, transparency: 88 }, line: { color: C.green, transparency: 88 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: 8.2, y: 3.2, w: 2.2, h: 2.2,
    fill: { color: C.green, transparency: 92 }, line: { color: C.green, transparency: 92 }
  });

  // 태그
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.55, w: 2.4, h: 0.38,
    fill: { color: C.green }, line: { color: C.green }
  });
  s.addText("ML TERM PROJECT", {
    x: 0.5, y: 0.55, w: 2.4, h: 0.38,
    fontSize: 10, bold: true, color: C.dark,
    align: "center", valign: "middle", margin: 0
  });

  // 메인 타이틀
  s.addText("소리만으로\n히트곡을\n예측할 수 있을까?", {
    x: 0.5, y: 1.1, w: 6.8, h: 3.2,
    fontSize: 40, bold: true, color: C.white,
    fontFace: "Arial", align: "left", valign: "top",
    lineSpacingMultiple: 1.15
  });

  // 서브타이틀
  s.addText("Spotify 오디오 피처 기반 인기곡 분류", {
    x: 0.5, y: 4.45, w: 7, h: 0.5,
    fontSize: 16, color: C.gray, align: "left", margin: 0
  });

  // 데이터 배지
  const badges = [
    { label: "114,000곡", icon: "🎵" },
    { label: "13개 피처",  icon: "📊" },
    { label: "3개 모델",   icon: "🤖" },
  ];
  badges.forEach((b, i) => {
    const bx = 0.5 + i * 2.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 5.0, w: 1.8, h: 0.45,
      fill: { color: "1E1E1E" }, line: { color: C.darkgray }
    });
    s.addText(`${b.icon}  ${b.label}`, {
      x: bx, y: 5.0, w: 1.8, h: 0.45,
      fontSize: 11, color: C.gray, align: "center", valign: "middle", margin: 0
    });
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 2 — 문제 정의
// ════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offwhite };

  // 헤더
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("왜 이 문제인가?", {
    x: 0.5, y: 0, w: 9, h: 0.9,
    fontSize: 26, bold: true, color: C.white,
    align: "left", valign: "middle", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.07,
    fill: { color: C.green }, line: { color: C.green }
  });

  // 왼쪽 — 텍스트
  s.addText("Spotify에는 매일 6만 곡이 새로 올라온다.", {
    x: 0.5, y: 1.3, w: 5.5, h: 0.5,
    fontSize: 15, color: C.text, bold: false
  });
  s.addText("하지만 대부분의 곡은 거의 재생되지 않는다.", {
    x: 0.5, y: 1.75, w: 5.5, h: 0.5,
    fontSize: 15, color: C.text
  });

  // 질문 박스
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.45, w: 5.5, h: 1.2,
    fill: { color: C.green, transparency: 10 },
    line: { color: C.green, width: 2 },
    shadow: makeShadow()
  });
  s.addText("\" 유명세·마케팅 없이,\n소리 자체만으로 인기곡을 구분할 수 있는가? \"", {
    x: 0.5, y: 2.45, w: 5.5, h: 1.2,
    fontSize: 13.5, bold: true, color: C.dark,
    align: "center", valign: "middle", italic: true
  });

  s.addText("Spotify는 모든 곡의 음향 특성을\n자동 수치화 → 발매 전에도 계산 가능!", {
    x: 0.5, y: 3.85, w: 5.5, h: 0.8,
    fontSize: 13, color: C.subtext
  });

  // 오른쪽 — 큰 숫자 카드들
  const stats = [
    { n: "1억+",   sub: "Spotify 전체 트랙 수" },
    { n: "60,000", sub: "하루 신규 업로드 곡 수" },
    { n: "11%",    sub: "인기곡 비율 (이 데이터셋)" },
  ];
  stats.forEach((st, i) => {
    const sy = 1.15 + i * 1.35;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.8, y: sy, w: 2.8, h: 1.15,
      fill: { color: C.card }, line: { color: "E0E0E0" },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.8, y: sy, w: 0.08, h: 1.15,
      fill: { color: C.green }, line: { color: C.green }
    });
    s.addText(st.n, {
      x: 7.05, y: sy + 0.12, w: 2.5, h: 0.55,
      fontSize: 28, bold: true, color: C.green, align: "left", margin: 0
    });
    s.addText(st.sub, {
      x: 7.05, y: sy + 0.65, w: 2.5, h: 0.38,
      fontSize: 11, color: C.subtext, align: "left", margin: 0
    });
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 3 — 데이터 소개
// ════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offwhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("114,000곡의 소리를 수치로", {
    x: 0.5, y: 0, w: 9, h: 0.9,
    fontSize: 26, bold: true, color: C.white,
    align: "left", valign: "middle", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.07,
    fill: { color: C.green }, line: { color: C.green }
  });

  // 피처 카드 그리드 (2열 × 4행)
  const features = [
    { name: "danceability", desc: "춤추기 적합한 정도", range: "0 – 1" },
    { name: "energy",       desc: "얼마나 강렬한가",   range: "0 – 1" },
    { name: "loudness",     desc: "평균 음량",         range: "dB" },
    { name: "instrumentalness", desc: "보컬 없이 악기만?", range: "0 – 1" },
    { name: "acousticness", desc: "어쿠스틱 악기 비율", range: "0 – 1" },
    { name: "valence",      desc: "밝고 긍정적인 분위기", range: "0 – 1" },
    { name: "tempo",        desc: "빠르기",             range: "BPM" },
    { name: "explicit",     desc: "선정적 가사 여부",   range: "0 / 1" },
  ];

  features.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 0.4 + col * 4.85;
    const cy = 1.1 + row * 1.05;

    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 4.5, h: 0.88,
      fill: { color: C.card }, line: { color: "E8E8E8" },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 0.07, h: 0.88,
      fill: { color: C.green }, line: { color: C.green }
    });
    s.addText(f.name, {
      x: cx + 0.2, y: cy + 0.06, w: 3.0, h: 0.32,
      fontSize: 12, bold: true, color: C.text, margin: 0
    });
    s.addText(f.desc, {
      x: cx + 0.2, y: cy + 0.42, w: 3.0, h: 0.32,
      fontSize: 10.5, color: C.subtext, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 3.35, y: cy + 0.26, w: 0.9, h: 0.32,
      fill: { color: "EBF9F0" }, line: { color: C.green, transparency: 50 }
    });
    s.addText(f.range, {
      x: cx + 3.35, y: cy + 0.26, w: 0.9, h: 0.32,
      fontSize: 10, color: C.green2, align: "center", valign: "middle", bold: true, margin: 0
    });
  });

  // 타겟 변수 설명
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.1, w: 9.2, h: 0.42,
    fill: { color: "FFF8E1" }, line: { color: C.amber }
  });
  s.addText("⚠  타겟: popularity ≥ 60이면 인기곡(1), 미만이면 비인기곡(0) — 전체의 약 11%만 인기곡 → 클래스 불균형!", {
    x: 0.4, y: 5.1, w: 9.2, h: 0.42,
    fontSize: 11.5, color: "8B6914", align: "center", valign: "middle", margin: 0
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 4 — 접근 방법
// ════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offwhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("어떻게 풀었나 — 3단계 모델 비교", {
    x: 0.5, y: 0, w: 9, h: 0.9,
    fontSize: 26, bold: true, color: C.white,
    align: "left", valign: "middle", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.07,
    fill: { color: C.green }, line: { color: C.green }
  });

  // 3개 모델 박스
  const models = [
    {
      title: "Logistic Regression",
      tag: "BASELINE",
      tagColor: C.blue,
      desc: "가장 단순한 선형 분류기.\n성능의 하한선 기준점 역할.",
      x: 0.35
    },
    {
      title: "Random Forest",
      tag: "앙상블",
      tagColor: C.amber,
      desc: "수백 개 결정 트리를 합산.\n비선형 패턴 학습 가능.",
      x: 3.55
    },
    {
      title: "XGBoost",
      tag: "BEST",
      tagColor: C.green,
      desc: "오류에 집중하며 순차 개선.\n하이퍼파라미터 자동 탐색.",
      x: 6.75
    },
  ];

  models.forEach((m) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: m.x, y: 1.1, w: 2.9, h: 2.6,
      fill: { color: C.card }, line: { color: "E0E0E0" },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: m.x, y: 1.1, w: 2.9, h: 0.38,
      fill: { color: m.tagColor }, line: { color: m.tagColor }
    });
    s.addText(m.tag, {
      x: m.x, y: 1.1, w: 2.9, h: 0.38,
      fontSize: 11, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0
    });
    s.addText(m.title, {
      x: m.x + 0.15, y: 1.56, w: 2.6, h: 0.6,
      fontSize: 14, bold: true, color: C.text, margin: 0
    });
    s.addText(m.desc, {
      x: m.x + 0.15, y: 2.2, w: 2.6, h: 1.3,
      fontSize: 12, color: C.subtext, margin: 0
    });
  });

  // 화살표
  [3.25, 6.45].forEach(ax => {
    s.addShape(pres.shapes.LINE, {
      x: ax, y: 2.4, w: 0.3, h: 0,
      line: { color: C.green, width: 2.5 }
    });
    // 화살표 머리 (삼각형 흉내)
    s.addText("▶", {
      x: ax + 0.18, y: 2.26, w: 0.25, h: 0.28,
      fontSize: 13, color: C.green, align: "left", margin: 0
    });
  });

  // 발견한 문제 박스
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 3.9, w: 4.3, h: 1.55,
    fill: { color: "FFF3F3" }, line: { color: C.red, width: 1.5 },
    shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 3.9, w: 4.3, h: 0.38,
    fill: { color: C.red }, line: { color: C.red }
  });
  s.addText("⚠  실험 중 발견한 문제", {
    x: 0.35, y: 3.9, w: 4.3, h: 0.38,
    fontSize: 11, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
  });
  s.addText("초기 결과: Accuracy 89%, F1 = 0.00\n→ 모델이 모든 곡을 \"비인기\"로만 예측!\n→ 해결: 인기곡에 8배 더 높은 가중치 부여", {
    x: 0.5, y: 4.35, w: 4.0, h: 1.05,
    fontSize: 11.5, color: C.text
  });

  // 교훈 박스
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 3.9, w: 4.5, h: 1.55,
    fill: { color: "EBF9F0" }, line: { color: C.green, width: 1.5 },
    shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 3.9, w: 4.5, h: 0.38,
    fill: { color: C.green }, line: { color: C.green }
  });
  s.addText("💡  핵심 교훈", {
    x: 5.1, y: 3.9, w: 4.5, h: 0.38,
    fontSize: 11, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
  });
  s.addText("정확도(Accuracy)만 믿으면 안 된다.\nF1 Score가 불균형 데이터의 진짜 성능 지표.\nXGBoost 60번 실험 → 최적 파라미터 탐색.", {
    x: 5.25, y: 4.35, w: 4.2, h: 1.05,
    fontSize: 11.5, color: C.text
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 5 — 실험 결과
// ════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offwhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("실험 결과 — XGBoost가 가장 좋았다", {
    x: 0.5, y: 0, w: 9, h: 0.9,
    fontSize: 26, bold: true, color: C.white,
    align: "left", valign: "middle", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.07,
    fill: { color: C.green }, line: { color: C.green }
  });

  // 결과 표
  const tableData = [
    [
      { text: "Model",                  options: { bold: true, color: C.white, fill: { color: C.dark },    align: "center" } },
      { text: "Test Accuracy",          options: { bold: true, color: C.white, fill: { color: C.dark },    align: "center" } },
      { text: "Test F1",                options: { bold: true, color: C.white, fill: { color: C.dark },    align: "center" } },
      { text: "Test AUC",               options: { bold: true, color: C.white, fill: { color: C.dark },    align: "center" } },
    ],
    [
      { text: "Logistic Regression",    options: { color: C.text, align: "left" } },
      { text: "0.543",                  options: { color: C.text, align: "center" } },
      { text: "0.242",                  options: { color: C.text, align: "center" } },
      { text: "0.644",                  options: { color: C.text, align: "center" } },
    ],
    [
      { text: "Random Forest (default)",options: { color: C.text, align: "left" } },
      { text: "0.888",                  options: { color: C.text, align: "center" } },
      { text: "0.073",                  options: { color: C.text, align: "center" } },
      { text: "0.718",                  options: { color: C.text, align: "center" } },
    ],
    [
      { text: "Random Forest (tuned)",  options: { color: C.text, align: "left" } },
      { text: "0.617",                  options: { color: C.text, align: "center" } },
      { text: "0.277",                  options: { color: C.text, align: "center" } },
      { text: "0.703",                  options: { color: C.text, align: "center" } },
    ],
    [
      { text: "XGBoost (default)",      options: { color: C.text, align: "left" } },
      { text: "0.765",                  options: { color: C.text, align: "center" } },
      { text: "0.275",                  options: { color: C.text, align: "center" } },
      { text: "0.701",                  options: { color: C.text, align: "center" } },
    ],
    [
      { text: "⭐  XGBoost (tuned)",     options: { bold: true, color: C.white, fill: { color: C.green2 }, align: "left"   } },
      { text: "0.745",                  options: { bold: true, color: C.white, fill: { color: C.green2 }, align: "center" } },
      { text: "0.294",                  options: { bold: true, color: C.white, fill: { color: C.green2 }, align: "center" } },
      { text: "0.722",                  options: { bold: true, color: C.white, fill: { color: C.green2 }, align: "center" } },
    ],
  ];

  s.addTable(tableData, {
    x: 0.4, y: 1.05, w: 5.4, h: 3.4,
    border: { pt: 0.5, color: "DDDDDD" },
    rowH: 0.56,
    colW: [2.2, 1.05, 1.05, 1.05],
    fontSize: 11.5,
    fontFace: "Arial",
  });

  // 오른쪽 F1 막대 차트
  s.addChart(pres.charts.BAR, [
    {
      name: "Test F1",
      labels: ["Logistic\nRegression", "RF\n(default)", "RF\n(tuned)", "XGBoost\n(default)", "XGBoost\n(tuned)"],
      values: [0.242, 0.073, 0.277, 0.275, 0.294],
    },
  ], {
    x: 5.9, y: 1.0, w: 3.9, h: 3.5,
    barDir: "col",
    chartColors: ["636EFA", "636EFA", "636EFA", "636EFA", "1DB954"],
    chartArea: { fill: { color: "FAFAFA" } },
    catAxisLabelColor: "64748B",
    valAxisLabelColor: "64748B",
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: "1C1C1C",
    dataLabelFontSize: 10,
    valAxisMaxVal: 0.45,
    showLegend: false,
    showTitle: true,
    title: "Test F1 Score 비교",
    titleColor: C.text,
    titleFontSize: 12,
  });

  // 지표 설명
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 4.62, w: 9.2, h: 0.78,
    fill: { color: "E8F5E9" }, line: { color: C.green }
  });
  s.addText(
    "F1 Score: 인기곡을 얼마나 잘 찾아내는가 (0~1, 높을수록 좋음)  |  " +
    "AUC: 랜덤 추측(0.5)보다 얼마나 더 잘 구분하는가  |  " +
    "XGBoost(tuned) AUC 0.722 → 랜덤 대비 +22%p",
    {
      x: 0.4, y: 4.62, w: 9.2, h: 0.78,
      fontSize: 11, color: C.green2,
      align: "center", valign: "middle", margin: 0
    }
  );
}

// ════════════════════════════════════════════════════════════
// SLIDE 6 — Feature Importance
// ════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offwhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("무엇이 인기를 결정하는가?", {
    x: 0.5, y: 0, w: 9, h: 0.9,
    fontSize: 26, bold: true, color: C.white,
    align: "left", valign: "middle", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.07,
    fill: { color: C.green }, line: { color: C.green }
  });

  // 가로 막대 차트
  s.addChart(pres.charts.BAR, [
    {
      name: "Importance",
      labels: ["key","mode","tempo","speechiness","danceability","valence","liveness","duration_min","energy","acousticness","loudness","instrumentalness","explicit"],
      values: [0.057, 0.059, 0.065, 0.066, 0.068, 0.070, 0.073, 0.075, 0.075, 0.078, 0.080, 0.098, 0.140],
    },
  ], {
    x: 0.3, y: 1.0, w: 5.6, h: 4.4,
    barDir: "bar",
    chartColors: ["1DB954"],
    chartArea: { fill: { color: "FAFAFA" } },
    catAxisLabelColor: "1C1C1C",
    valAxisLabelColor: "64748B",
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: "1C1C1C",
    dataLabelFontSize: 9,
    showLegend: false,
    showTitle: false,
  });

  // Top 3 인사이트 카드
  const insights = [
    {
      rank: "🥇 1위",
      feat: "explicit",
      val:  "0.140",
      color: "FFF3E0",
      border: C.amber,
      desc: "선정적 가사 여부\n→ 힙합·R&B 장르 강세 반영\n보컬+강렬한 현대 음악 = 인기",
    },
    {
      rank: "🥈 2위",
      feat: "instrumentalness",
      val:  "0.098",
      color: "E3F2FD",
      border: C.blue,
      desc: "보컬 없는 정도\n→ 순수 악기 곡(클래식·재즈)은\n스트리밍에서 비인기 경향",
    },
    {
      rank: "🥉 3위",
      feat: "loudness",
      val:  "0.080",
      color: "EBF9F0",
      border: C.green,
      desc: "음량 크기\n→ 크고 강한 곡이 유리\n조용한 어쿠스틱 곡은 불리",
    },
  ];

  insights.forEach((ins, i) => {
    const iy = 1.05 + i * 1.47;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.15, y: iy, w: 3.6, h: 1.32,
      fill: { color: ins.color }, line: { color: ins.border, width: 1.5 },
      shadow: makeShadow()
    });
    s.addText(`${ins.rank}  ${ins.feat}  (${ins.val})`, {
      x: 6.3, y: iy + 0.08, w: 3.3, h: 0.38,
      fontSize: 12, bold: true, color: C.text, margin: 0
    });
    s.addText(ins.desc, {
      x: 6.3, y: iy + 0.5, w: 3.3, h: 0.78,
      fontSize: 10.5, color: C.subtext, margin: 0
    });
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 7 — 한계와 실패 분석
// ════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offwhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("한계와 실패 분석", {
    x: 0.5, y: 0, w: 9, h: 0.9,
    fontSize: 26, bold: true, color: C.white,
    align: "left", valign: "middle", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.9, w: 10, h: 0.07,
    fill: { color: C.red }, line: { color: C.red }
  });

  // 왼쪽: 오분류 패턴
  s.addText("오분류가 집중되는 경우", {
    x: 0.4, y: 1.1, w: 4.4, h: 0.45,
    fontSize: 16, bold: true, color: C.text, margin: 0
  });

  const errors = [
    { icon: "📍", title: "경계선상 곡들", desc: "popularity 45~65점\n→ 인기/비인기 구분 어려운 회색지대" },
    { icon: "🎻", title: "장르 혼재 문제", desc: "클래식·재즈의 오디오 피처가\n팝·힙합과 완전히 다른 패턴" },
    { icon: "📉", title: "Val-Test 갭", desc: "XGBoost Val F1 0.593 → Test 0.294\n하이퍼파라미터 과적합 징후" },
  ];
  errors.forEach((e, i) => {
    const ey = 1.65 + i * 1.2;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: ey, w: 4.4, h: 1.05,
      fill: { color: "FFF5F5" }, line: { color: "FFCDD2" },
      shadow: makeShadow()
    });
    s.addText(e.icon + "  " + e.title, {
      x: 0.6, y: ey + 0.08, w: 4.0, h: 0.35,
      fontSize: 12, bold: true, color: C.text, margin: 0
    });
    s.addText(e.desc, {
      x: 0.6, y: ey + 0.46, w: 4.0, h: 0.52,
      fontSize: 10.5, color: C.subtext, margin: 0
    });
  });

  // 오른쪽: 근본 원인
  s.addText("근본적 한계", {
    x: 5.3, y: 1.1, w: 4.3, h: 0.45,
    fontSize: 16, bold: true, color: C.text, margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.65, w: 4.3, h: 2.6,
    fill: { color: "F8F8F8" }, line: { color: "DDDDDD" },
    shadow: makeShadow()
  });
  s.addText("오디오 피처만으로 설명 못하는 것들", {
    x: 5.5, y: 1.78, w: 3.9, h: 0.35,
    fontSize: 12, bold: true, color: C.red, margin: 0
  });

  const missing = ["아티스트 팬덤 크기", "마케팅·프로모션 비용", "앨범 발매 시기", "소셜미디어 바이럴"];
  missing.forEach((m, i) => {
    s.addText([{ text: m, options: { bullet: true } }], {
      x: 5.5, y: 2.2 + i * 0.38, w: 3.9, h: 0.36,
      fontSize: 12, color: C.subtext
    });
  });

  // 최종 평가
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 4.35, w: 4.3, h: 1.1,
    fill: { color: "FFF8E1" }, line: { color: C.amber, width: 1.5 }
  });
  s.addText("📊  최종 평가", {
    x: 5.5, y: 4.42, w: 3.9, h: 0.32,
    fontSize: 12, bold: true, color: "8B6914", margin: 0
  });
  s.addText("F1 = 0.294, AUC = 0.722\n실서비스엔 부족하지만, 랜덤(0.5)보다\n유의미하게 높은 예측력 확인", {
    x: 5.5, y: 4.75, w: 3.9, h: 0.65,
    fontSize: 10.5, color: "8B6914", margin: 0
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 8 — 결론 & Future Work (다크)
// ════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: C.green }, line: { color: C.green }
  });

  // 장식
  s.addShape(pres.shapes.OVAL, {
    x: 7.5, y: 3.5, w: 3.5, h: 3.5,
    fill: { color: C.green, transparency: 90 }, line: { color: C.green, transparency: 90 }
  });

  s.addText("결론", {
    x: 0.5, y: 0.25, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: C.white, margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.88, w: 1.5, h: 0.05,
    fill: { color: C.green }, line: { color: C.green }
  });

  // 결론 3가지
  const conclusions = [
    { icon: "✅", color: C.green,  text: "오디오 피처만으로도 랜덤 대비 유의미한 예측 가능 (AUC 0.722)" },
    { icon: "✅", color: C.green,  text: "explicit·instrumentalness가 핵심 인기 결정 인자" },
    { icon: "⚠️", color: C.amber,  text: "오디오 외 정보(아티스트·트렌드) 없이는 근본적 한계 존재" },
  ];
  conclusions.forEach((c, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 1.1 + i * 0.82, w: 5.5, h: 0.68,
      fill: { color: "1E1E1E" }, line: { color: "2A2A2A" }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 1.1 + i * 0.82, w: 0.07, h: 0.68,
      fill: { color: c.color }, line: { color: c.color }
    });
    s.addText(c.icon + "  " + c.text, {
      x: 0.72, y: 1.1 + i * 0.82, w: 5.1, h: 0.68,
      fontSize: 12, color: C.white, valign: "middle", margin: 0
    });
  });

  // Future Work
  s.addText("Future Work", {
    x: 6.3, y: 0.9, w: 3.4, h: 0.45,
    fontSize: 16, bold: true, color: C.green, margin: 0
  });

  const fw = [
    "아티스트 팔로워 수 피처 추가",
    "장르별 분리 모델 학습",
    "Regression으로 전환",
    "Raw 오디오 → CNN 학습",
    "SMOTE 오버샘플링 적용",
  ];
  fw.forEach((f, i) => {
    s.addText([{ text: f, options: { bullet: true } }], {
      x: 6.3, y: 1.42 + i * 0.43, w: 3.4, h: 0.4,
      fontSize: 11.5, color: C.gray
    });
  });

  // 핵심 메시지
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.65, w: 9.1, h: 0.78,
    fill: { color: C.green, transparency: 85 },
    line: { color: C.green, width: 1 }
  });
  s.addText(
    "\" 소리 자체는 인기의 일부만 설명한다.  하지만 그 일부조차도 의미 있는 신호를 담고 있다. \"",
    {
      x: 0.5, y: 4.65, w: 9.1, h: 0.78,
      fontSize: 13, italic: true, bold: true, color: C.white,
      align: "center", valign: "middle"
    }
  );
}

// ════════════════════════════════════════════════════════════
// 저장
// ════════════════════════════════════════════════════════════
pres.writeFile({ fileName: "spotify_presentation.pptx" })
  .then(() => console.log("✅  spotify_presentation.pptx 저장 완료"))
  .catch(e => console.error("❌ 오류:", e));
