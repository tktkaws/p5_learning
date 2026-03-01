/** HSB 色相グリッド — 彩度・明度を変えた 2D マトリクス */
export default function (p) {
  const cols = 12; // 色相の分割数
  let mode = 0; // 0: H×S, 1: H×B, 2: H×S×B

  p.setup = () => {
    p.createCanvas(400, 400);
    p.noLoop();
  };

  p.draw = () => {
    p.background(240);

    p.push();
    p.colorMode(p.HSB, 360, 100, 100);

    if (mode === 0) {
      drawHueSatGrid();
    } else if (mode === 1) {
      drawHueBriGrid();
    } else {
      drawCombinedGrid();
    }

    p.pop();

    // --- モード表示 ---
    p.noStroke();
    p.fill(60);
    p.textSize(13);
    p.textAlign(p.CENTER);
    const labels = ["色相 × 彩度", "色相 × 明度", "色相 × 彩度 × 明度"];
    p.text(labels[mode], p.width / 2, p.height - 10);

    // --- モードインジケーター ---
    for (let i = 0; i < 3; i++) {
      const dx = p.width / 2 + (i - 1) * 24;
      p.fill(i === mode ? 100 : 210);
      p.circle(dx, p.height - 28, i === mode ? 10 : 7);
    }
  };

  function drawHueSatGrid() {
    const rows = 8;
    const cellW = (p.width - 40) / cols;
    const cellH = (p.height - 100) / rows;
    const startY = 40;

    // ラベル
    p.colorMode(p.RGB);
    p.noStroke();
    p.fill(80);
    p.textSize(11);
    p.textAlign(p.LEFT, p.CENTER);
    for (let r = 0; r < rows; r++) {
      const sat = p.map(r, 0, rows - 1, 100, 10);
      p.text(`S:${Math.round(sat)}`, 2, startY + r * cellH + cellH / 2);
    }
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("← 色相 (H) →", p.width / 2, startY - 6);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("↑ 彩度 (S)", 2, startY - 6);
    p.colorMode(p.HSB, 360, 100, 100);

    // グリッド
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hue = (c / cols) * 360;
        const sat = p.map(r, 0, rows - 1, 100, 10);
        p.fill(hue, sat, 90);
        p.noStroke();
        p.rect(
          28 + c * cellW,
          startY + r * cellH,
          cellW - 2,
          cellH - 2,
          3
        );
      }
    }
  }

  function drawHueBriGrid() {
    const rows = 8;
    const cellW = (p.width - 40) / cols;
    const cellH = (p.height - 100) / rows;
    const startY = 40;

    // ラベル
    p.colorMode(p.RGB);
    p.noStroke();
    p.fill(80);
    p.textSize(11);
    p.textAlign(p.LEFT, p.CENTER);
    for (let r = 0; r < rows; r++) {
      const bri = p.map(r, 0, rows - 1, 100, 10);
      p.text(`B:${Math.round(bri)}`, 2, startY + r * cellH + cellH / 2);
    }
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("← 色相 (H) →", p.width / 2, startY - 6);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("↑ 明度 (B)", 2, startY - 6);
    p.colorMode(p.HSB, 360, 100, 100);

    // グリッド
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hue = (c / cols) * 360;
        const bri = p.map(r, 0, rows - 1, 100, 10);
        p.fill(hue, 80, bri);
        p.noStroke();
        p.rect(
          28 + c * cellW,
          startY + r * cellH,
          cellW - 2,
          cellH - 2,
          3
        );
      }
    }
  }

  function drawCombinedGrid() {
    // 上段: H×S（B固定=90）、下段: H×B（S固定=80）
    const rows = 4;
    const cellW = (p.width - 40) / cols;
    const cellH = (p.height - 130) / (rows * 2);

    // 上段ラベル
    const y1 = 40;
    p.colorMode(p.RGB);
    p.noStroke();
    p.fill(80);
    p.textSize(11);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("色相 × 彩度（B=90 固定）", 28, y1 - 4);
    p.colorMode(p.HSB, 360, 100, 100);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hue = (c / cols) * 360;
        const sat = p.map(r, 0, rows - 1, 100, 20);
        p.fill(hue, sat, 90);
        p.noStroke();
        p.rect(28 + c * cellW, y1 + r * cellH, cellW - 2, cellH - 2, 3);
      }
    }

    // 下段ラベル
    const y2 = y1 + rows * cellH + 30;
    p.colorMode(p.RGB);
    p.noStroke();
    p.fill(80);
    p.textSize(11);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("色相 × 明度（S=80 固定）", 28, y2 - 4);
    p.colorMode(p.HSB, 360, 100, 100);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hue = (c / cols) * 360;
        const bri = p.map(r, 0, rows - 1, 100, 20);
        p.fill(hue, 80, bri);
        p.noStroke();
        p.rect(28 + c * cellW, y2 + r * cellH, cellW - 2, cellH - 2, 3);
      }
    }
  }

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      mode = (mode + 1) % 3;
      p.redraw();
    }
  };
};
