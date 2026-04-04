// 棒グラフアニメーション — lerp によるイージング付きデータ遷移
export default function (p) {
  const W = 400;
  const H = 400;

  const CATEGORIES = ["A", "B", "C", "D", "E", "F", "G"];
  const BAR_COUNT = CATEGORIES.length;
  const LERP_SPEED = 0.08;

  // グラフ領域
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 20;
  const MARGIN_TOP = 40;
  const MARGIN_BOTTOM = 50;
  const GRAPH_W = W - MARGIN_LEFT - MARGIN_RIGHT;
  const GRAPH_H = H - MARGIN_TOP - MARGIN_BOTTOM;

  let currentValues = [];
  let targetValues = [];
  let maxValue = 100;

  p.setup = () => {
    p.createCanvas(W, H);
    p.colorMode(p.HSB, 360, 100, 100, 1.0);
    p.textFont("sans-serif");

    // 初期値を生成
    for (let i = 0; i < BAR_COUNT; i++) {
      const v = randomValue();
      currentValues[i] = v;
      targetValues[i] = v;
    }
  };

  function randomValue() {
    return p.floor(p.random(10, 95));
  }

  function generateNewTargets() {
    for (let i = 0; i < BAR_COUNT; i++) {
      targetValues[i] = randomValue();
    }
  }

  p.draw = () => {
    p.background(220, 5, 98);

    // lerp で現在値を目標値へ補間
    let allSettled = true;
    for (let i = 0; i < BAR_COUNT; i++) {
      currentValues[i] = p.lerp(currentValues[i], targetValues[i], LERP_SPEED);
      if (p.abs(currentValues[i] - targetValues[i]) > 0.5) {
        allSettled = false;
      }
    }

    drawTitle();
    drawAxes();
    drawBars();
    drawHint(allSettled);
  };

  function drawTitle() {
    p.noStroke();
    p.fill(220, 10, 25);
    p.textSize(14);
    p.textAlign(p.LEFT, p.TOP);
    p.text("棒グラフアニメーション", MARGIN_LEFT, 12);
  }

  function drawAxes() {
    p.stroke(220, 5, 75);
    p.strokeWeight(1);

    // Y 軸
    p.line(MARGIN_LEFT, MARGIN_TOP, MARGIN_LEFT, MARGIN_TOP + GRAPH_H);
    // X 軸
    p.line(MARGIN_LEFT, MARGIN_TOP + GRAPH_H, MARGIN_LEFT + GRAPH_W, MARGIN_TOP + GRAPH_H);

    // Y 軸目盛り
    p.noStroke();
    p.fill(220, 5, 55);
    p.textSize(10);
    p.textAlign(p.RIGHT, p.CENTER);

    const ticks = [0, 25, 50, 75, 100];
    for (const tick of ticks) {
      const y = MARGIN_TOP + GRAPH_H - (tick / maxValue) * GRAPH_H;
      p.text(tick, MARGIN_LEFT - 8, y);

      // グリッド線
      p.stroke(220, 3, 90);
      p.strokeWeight(0.5);
      p.line(MARGIN_LEFT + 1, y, MARGIN_LEFT + GRAPH_W, y);
      p.noStroke();
    }
  }

  function drawBars() {
    const barGap = 8;
    const totalGaps = (BAR_COUNT + 1) * barGap;
    const barWidth = (GRAPH_W - totalGaps) / BAR_COUNT;

    for (let i = 0; i < BAR_COUNT; i++) {
      const x = MARGIN_LEFT + barGap + i * (barWidth + barGap);
      const barHeight = (currentValues[i] / maxValue) * GRAPH_H;
      const y = MARGIN_TOP + GRAPH_H - barHeight;

      // バーの色: カテゴリごとに色相を変える
      const hue = p.map(i, 0, BAR_COUNT, 200, 340);
      const sat = 65;
      const bri = 85;

      // バー本体
      p.noStroke();
      p.fill(hue, sat, bri);
      p.rect(x, y, barWidth, barHeight, 3, 3, 0, 0);

      // 値ラベル（バーの上）
      p.fill(220, 10, 30);
      p.textSize(10);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(p.floor(currentValues[i]), x + barWidth / 2, y - 4);

      // カテゴリラベル（X 軸下）
      p.fill(220, 5, 45);
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(CATEGORIES[i], x + barWidth / 2, MARGIN_TOP + GRAPH_H + 8);
    }
  }

  function drawHint(settled) {
    p.noStroke();
    p.fill(220, 5, 65);
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    const hint = settled ? "クリックでデータを更新" : "アニメーション中...";
    p.text(hint, W / 2, H - 8);
  }

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H) {
      generateNewTargets();
    }
  };
}
