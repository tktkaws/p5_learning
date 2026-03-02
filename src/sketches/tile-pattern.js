/** タイル模様 — 市松模様・モザイク・イスラム幾何学風 */
export default function (p) {
  let mode = 0; // 0: 市松, 1: モザイク, 2: イスラム幾何学風
  const labels = ["市松模様", "モザイク", "イスラム幾何学風"];

  p.setup = () => {
    p.createCanvas(400, 400);
    p.noLoop();
  };

  p.draw = () => {
    p.background(240);

    if (mode === 0) {
      drawCheckerboard();
    } else if (mode === 1) {
      drawMosaic();
    } else {
      drawIslamicGeometry();
    }

    // --- モード表示 ---
    p.noStroke();
    p.fill(255, 220);
    p.rect(0, p.height - 40, p.width, 40);
    p.fill(60);
    p.textSize(13);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(labels[mode] + "（クリックで切替）", p.width / 2, p.height - 20);
  };

  // --- 市松模様 ---
  function drawCheckerboard() {
    const cols = 8;
    const rows = 8;
    const cellW = p.width / cols;
    const cellH = (p.height - 40) / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((col + row) % 2 === 0) {
          p.fill(30, 30, 60);
        } else {
          p.fill(230, 220, 200);
        }
        p.noStroke();
        p.rect(col * cellW, row * cellH, cellW, cellH);
      }
    }
  }

  // --- モザイク ---
  function drawMosaic() {
    const cols = 10;
    const rows = 10;
    const cellW = p.width / cols;
    const cellH = (p.height - 40) / rows;

    p.push();
    p.colorMode(p.HSB, 360, 100, 100);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const hue = p.map(col + row, 0, cols + rows - 2, 0, 360);
        const sat = p.map(row, 0, rows - 1, 50, 90);
        const bri = p.map(col, 0, cols - 1, 70, 95);

        p.fill(hue, sat, bri);
        p.stroke(255, 0, 100);
        p.strokeWeight(1);
        p.rect(
          col * cellW + 2,
          row * cellH + 2,
          cellW - 4,
          cellH - 4,
          3
        );
      }
    }

    p.pop();
  }

  // --- イスラム幾何学風 ---
  function drawIslamicGeometry() {
    const cols = 5;
    const rows = 5;
    const cellW = p.width / cols;
    const cellH = (p.height - 40) / rows;
    const size = Math.min(cellW, cellH);

    p.push();
    p.colorMode(p.HSB, 360, 100, 100);

    // 背景タイル
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;
        const hue = ((col + row * cols) * 37) % 360;

        // 外側の八角形
        p.fill(hue, 30, 95);
        p.stroke(hue, 50, 70);
        p.strokeWeight(1.5);
        drawPolygon(cx, cy, size * 0.46, 8, p.PI / 8);

        // 内側の星形
        p.fill(hue, 60, 85);
        p.stroke(hue, 70, 60);
        p.strokeWeight(1);
        drawStar(cx, cy, size * 0.18, size * 0.38, 8, p.PI / 8);

        // 中心の小さい円
        p.fill(hue, 40, 98);
        p.noStroke();
        p.circle(cx, cy, size * 0.14);
      }
    }

    // タイル間のダイヤモンド装飾
    p.noStroke();
    for (let row = 0; row < rows - 1; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const cx = (col + 1) * cellW;
        const cy = (row + 1) * cellH;
        const hue = ((col + row) * 50 + 180) % 360;
        p.fill(hue, 40, 90);
        drawPolygon(cx, cy, size * 0.16, 4, 0);
      }
    }

    p.pop();
  }

  // 正多角形を描く
  function drawPolygon(cx, cy, radius, sides, rotation) {
    p.beginShape();
    for (let i = 0; i < sides; i++) {
      const angle = (p.TWO_PI / sides) * i + rotation;
      p.vertex(cx + p.cos(angle) * radius, cy + p.sin(angle) * radius);
    }
    p.endShape(p.CLOSE);
  }

  // 星形を描く（内径と外径で頂点を交互配置）
  function drawStar(cx, cy, innerR, outerR, points, rotation) {
    p.beginShape();
    for (let i = 0; i < points * 2; i++) {
      const angle = (p.TWO_PI / (points * 2)) * i + rotation;
      const r = i % 2 === 0 ? outerR : innerR;
      p.vertex(cx + p.cos(angle) * r, cy + p.sin(angle) * r);
    }
    p.endShape(p.CLOSE);
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
