/** lerpColor で好きな配色のグラデーション — 複数プリセット切替 */
export default function (p) {
  const presets = [
    { name: "Indigo → Pink", c1: [99, 102, 241], c2: [236, 72, 153] },
    { name: "Emerald → Amber", c1: [16, 185, 129], c2: [245, 158, 11] },
    { name: "Sky → Violet", c1: [56, 189, 248], c2: [139, 92, 246] },
    { name: "Rose → Cyan", c1: [244, 63, 94], c2: [34, 211, 238] },
    { name: "Lime → Orange", c1: [132, 204, 22], c2: [249, 115, 22] },
  ];

  let current = 0;

  p.setup = () => {
    p.createCanvas(400, 400);
    p.noLoop();
  };

  p.draw = () => {
    p.background(240);

    const preset = presets[current];
    const c1 = p.color(...preset.c1);
    const c2 = p.color(...preset.c2);

    // --- 横方向グラデーション ---
    for (let x = 0; x < p.width; x++) {
      const t = x / p.width;
      const c = p.lerpColor(c1, c2, t);
      p.stroke(c);
      p.line(x, 30, x, 130);
    }

    // --- 縦方向グラデーション ---
    for (let y = 0; y < 100; y++) {
      const t = y / 100;
      const c = p.lerpColor(c1, c2, t);
      p.stroke(c);
      p.line(20, 160 + y, p.width - 20, 160 + y);
    }

    // --- 放射状グラデーション ---
    p.noStroke();
    const cx = p.width / 2;
    const cy = 330;
    const maxR = 60;
    for (let r = maxR; r > 0; r--) {
      const t = 1 - r / maxR;
      const c = p.lerpColor(c1, c2, t);
      p.fill(c);
      p.circle(cx, cy, r * 2);
    }

    // --- ラベル ---
    p.noStroke();
    p.fill(80);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("横方向", 10, 26);
    p.text("縦方向", 10, 156);
    p.text("放射状", 10, 275);

    // --- プリセット名 ---
    p.textAlign(p.CENTER);
    p.textSize(13);
    p.fill(60);
    p.text(preset.name, cx, p.height - 10);

    // --- プリセットインジケーター ---
    const dotY = p.height - 30;
    for (let i = 0; i < presets.length; i++) {
      const dx = cx + (i - (presets.length - 1) / 2) * 20;
      p.fill(i === current ? p.color(...presets[i].c1) : 200);
      p.circle(dx, dotY, i === current ? 10 : 7);
    }

    // --- 色見本 ---
    p.fill(c1);
    p.rect(10, p.height - 45, 30, 30, 4);
    p.fill(c2);
    p.rect(p.width - 40, p.height - 45, 30, 30, 4);
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      current = (current + 1) % presets.length;
      p.redraw();
    }
  };
};
