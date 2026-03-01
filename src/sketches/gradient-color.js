/** グラデーションと色空間 — lerpColor() と HSB モード */
export default function (p) {
  p.setup = () => {
    p.createCanvas(400, 400);
    p.noLoop();
  };

  p.draw = () => {
    p.background(240);

    // --- 上半分: HSB モードで虹色グラデーション ---
    p.push();
    p.colorMode(p.HSB, 360, 100, 100);
    const barH = 60;
    const y1 = 40;
    for (let x = 0; x < p.width; x++) {
      const hue = p.map(x, 0, p.width, 0, 360);
      p.stroke(hue, 80, 90);
      p.line(x, y1, x, y1 + barH);
    }
    p.pop();

    // ラベル
    p.noStroke();
    p.fill(80);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("HSB 虹色グラデーション", 10, y1 - 6);

    // --- 中段: lerpColor で 2 色補間 ---
    const y2 = 140;
    const c1 = p.color(99, 102, 241); // indigo
    const c2 = p.color(236, 72, 153); // pink
    for (let x = 0; x < p.width; x++) {
      const t = x / p.width;
      const c = p.lerpColor(c1, c2, t);
      p.stroke(c);
      p.line(x, y2, x, y2 + barH);
    }

    p.noStroke();
    p.fill(80);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("lerpColor（Indigo → Pink）", 10, y2 - 6);

    // --- 下段: マウス X で色が変わるインタラクティブ円 ---
    const y3 = 260;
    p.noStroke();
    p.fill(80);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("HSB 色相グリッド", 10, y3 - 6);

    p.push();
    p.colorMode(p.HSB, 360, 100, 100);
    const cols = 10;
    const rows = 3;
    const cellW = (p.width - 20) / cols;
    const cellH = 60 / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hue = (c / cols) * 360;
        const sat = p.map(r, 0, rows - 1, 40, 100);
        p.fill(hue, sat, 90);
        p.noStroke();
        p.rect(10 + c * cellW, y3 + r * cellH, cellW - 2, cellH - 2, 4);
      }
    }
    p.pop();

    // --- 説明テキスト ---
    p.noStroke();
    p.fill(160);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.text("colorMode(HSB) と lerpColor() で色を自在に操る", 200, 380);
  };

  p.mousePressed = () => {
    p.redraw();
  };
}
