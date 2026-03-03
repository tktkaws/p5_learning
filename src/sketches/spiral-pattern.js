/** 螺旋パターン — アルキメデス螺旋・フィボナッチ螺旋・渦巻きアニメーション */
export default function (p) {
  let mode = 0; // 0: アルキメデス, 1: フィボナッチ, 2: 渦巻き
  const labels = ["アルキメデス螺旋", "フィボナッチ螺旋", "渦巻きアニメーション"];
  let angle = 0; // 渦巻きアニメーション用

  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(240);

    if (mode === 0) {
      drawArchimedean();
    } else if (mode === 1) {
      drawFibonacci();
    } else {
      drawVortex();
    }

    // --- モード表示 ---
    p.noStroke();
    p.fill(255, 220);
    p.rect(0, p.height - 40, p.width, 40);
    p.fill(60);
    p.textSize(13);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(labels[mode] + "（クリックで切替）", p.width / 2, p.height - 20);

    // 静的モードはループ停止
    if (mode !== 2) {
      p.noLoop();
    }
  };

  // --- アルキメデス螺旋 ---
  function drawArchimedean() {
    p.push();
    p.translate(p.width / 2, (p.height - 40) / 2);
    p.colorMode(p.HSB, 360, 100, 100);
    p.noFill();
    p.strokeWeight(2);

    // 3本の螺旋を120度ずつずらして描画
    for (let s = 0; s < 3; s++) {
      p.beginShape();
      const offsetAngle = (p.TWO_PI / 3) * s;
      for (let i = 0; i < 600; i++) {
        const theta = i * 0.04 + offsetAngle;
        const r = 0.28 * i * 0.04; // r = a * theta
        const x = p.cos(theta) * r;
        const y = p.sin(theta) * r;
        const hue = (i * 0.6 + s * 120) % 360;
        p.stroke(hue, 70, 85);
        p.vertex(x, y);
      }
      p.endShape();
    }

    p.pop();
  }

  // --- フィボナッチ螺旋 ---
  function drawFibonacci() {
    p.push();
    p.translate(p.width / 2, (p.height - 40) / 2);
    p.colorMode(p.HSB, 360, 100, 100);
    p.noStroke();

    const goldenAngle = p.PI * (3 - p.sqrt(5)); // 黄金角 ≈ 137.5°
    const maxDots = 500;

    for (let i = 0; i < maxDots; i++) {
      const theta = i * goldenAngle;
      const r = p.sqrt(i) * 7;
      const x = p.cos(theta) * r;
      const y = p.sin(theta) * r;

      const hue = (i * 0.72) % 360;
      const size = p.map(i, 0, maxDots, 8, 3);

      p.fill(hue, 75, 90);
      p.circle(x, y, size);
    }

    p.pop();
  }

  // --- 渦巻きアニメーション ---
  function drawVortex() {
    p.push();
    p.translate(p.width / 2, (p.height - 40) / 2);
    p.colorMode(p.HSB, 360, 100, 100);

    const numArms = 5;
    const dotsPerArm = 80;

    for (let arm = 0; arm < numArms; arm++) {
      const armOffset = (p.TWO_PI / numArms) * arm;
      for (let i = 0; i < dotsPerArm; i++) {
        const t = i / dotsPerArm;
        const theta = t * p.TWO_PI * 3 + armOffset + angle;
        const r = t * 170;
        const x = p.cos(theta) * r;
        const y = p.sin(theta) * r;

        const hue = (arm * (360 / numArms) + i * 2 + p.frameCount) % 360;
        const size = p.map(i, 0, dotsPerArm, 2, 10);
        const alpha = p.map(i, 0, dotsPerArm, 40, 100);

        p.noStroke();
        p.fill(hue, 70, 90, alpha);
        p.circle(x, y, size);
      }
    }

    angle += 0.015;
    p.pop();
  }

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      mode = (mode + 1) % 3;
      if (mode === 2) {
        p.loop();
      }
      p.redraw();
    }
  };
}
