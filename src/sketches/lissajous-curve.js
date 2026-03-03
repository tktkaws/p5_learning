/** リサージュ曲線 — 周波数比で変わる美しい曲線 */
export default function (p) {
  let mode = 0;
  const presets = [
    { a: 1, b: 2, label: "1 : 2" },
    { a: 2, b: 3, label: "2 : 3" },
    { a: 3, b: 4, label: "3 : 4" },
    { a: 3, b: 5, label: "3 : 5" },
    { a: 5, b: 6, label: "5 : 6" },
  ];

  let t = 0; // 描画の進行度
  let points = []; // 軌跡の保存

  p.setup = () => {
    p.createCanvas(400, 400);
    resetCurve();
  };

  function resetCurve() {
    t = 0;
    points = [];
  }

  p.draw = () => {
    p.background(20, 20, 35);

    const preset = presets[mode];
    const cx = p.width / 2;
    const cy = (p.height - 40) / 2;
    const amp = 150;

    // 軌跡を追加
    const speed = 0.025;
    const stepsPerFrame = 4;

    for (let s = 0; s < stepsPerFrame; s++) {
      if (t <= p.TWO_PI) {
        const x = cx + amp * p.sin(preset.a * t + p.PI / 2);
        const y = cy + amp * p.sin(preset.b * t);
        points.push({ x, y, t });
        t += speed;
      }
    }

    // --- 軌跡を描画 ---
    p.push();
    p.colorMode(p.HSB, 360, 100, 100);
    p.noFill();
    p.strokeWeight(2);

    p.beginShape();
    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const hue = p.map(pt.t, 0, p.TWO_PI, 0, 360) % 360;
      p.stroke(hue, 70, 90);
      p.vertex(pt.x, pt.y);
    }
    p.endShape();
    p.pop();

    // --- 現在位置の点 ---
    if (points.length > 0) {
      const last = points[points.length - 1];
      p.noStroke();
      p.fill(255);
      p.circle(last.x, last.y, 8);

      // グロー効果
      p.fill(255, 60);
      p.circle(last.x, last.y, 20);
    }

    // --- 完了後のループ表示 ---
    if (t > p.TWO_PI) {
      p.noLoop();
    }

    // --- モード表示 ---
    p.noStroke();
    p.fill(20, 20, 35, 220);
    p.rect(0, p.height - 40, p.width, 40);
    p.fill(200);
    p.textSize(13);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      "周波数比 " + preset.label + "（クリックで切替）",
      p.width / 2,
      p.height - 20
    );
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      mode = (mode + 1) % presets.length;
      resetCurve();
      p.loop();
      p.redraw();
    }
  };
}
