/** フラクタル樹木 — 再帰関数で枝分かれする木 */
export default function (p) {
  let mode = 0;
  const labels = ["基本の樹木", "風で揺れる", "桜の木"];
  let windTime = 0;

  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    if (mode === 0) {
      p.background(20, 20, 35);
      drawBasicTree(p.width / 2, p.height - 50, -p.HALF_PI, 85, 9);
      p.noLoop();
    } else if (mode === 1) {
      p.background(20, 20, 35);
      windTime += 0.015;
      drawWindTree(p.width / 2, p.height - 50, -p.HALF_PI, 85, 9, 0);
    } else {
      p.background(180, 210, 235);
      windTime += 0.008;
      drawSakuraTree(p.width / 2, p.height - 50, -p.HALF_PI, 85, 9, 0);
    }

    // --- モード表示 ---
    p.noStroke();
    p.fill(mode === 2 ? 255 : 20, mode === 2 ? 255 : 20, mode === 2 ? 255 : 35, 220);
    p.rect(0, p.height - 40, p.width, 40);
    p.fill(mode === 2 ? 80 : 200);
    p.textSize(13);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(labels[mode] + "（クリックで切替）", p.width / 2, p.height - 20);
  };

  function drawBasicTree(x, y, angle, len, depth) {
    if (depth <= 0 || len < 2) return;

    const x2 = x + p.cos(angle) * len;
    const y2 = y + p.sin(angle) * len;

    const sw = p.map(depth, 0, 9, 1, 7);
    const b = p.map(depth, 0, 9, 160, 70);
    p.stroke(b, b * 0.7, b * 0.4);
    p.strokeWeight(sw);
    p.line(x, y, x2, y2);

    if (depth <= 2) {
      p.noStroke();
      p.fill(60, 160, 80, 180);
      p.circle(x2, y2, p.map(depth, 0, 2, 4, 8));
    }

    const newLen = len * 0.67;
    const spread = p.PI / 5.5;
    drawBasicTree(x2, y2, angle - spread, newLen, depth - 1);
    drawBasicTree(x2, y2, angle + spread, newLen, depth - 1);
  }

  function drawWindTree(x, y, angle, len, depth, noiseIdx) {
    if (depth <= 0 || len < 2) return;

    const wind = (p.noise(noiseIdx * 0.15 + 50, windTime) - 0.5) * 0.5;
    const a = angle + wind * (1 - depth / 10);

    const x2 = x + p.cos(a) * len;
    const y2 = y + p.sin(a) * len;

    const sw = p.map(depth, 0, 9, 1, 7);
    const g = p.map(depth, 0, 9, 170, 70);
    p.stroke(60, g, 40);
    p.strokeWeight(sw);
    p.line(x, y, x2, y2);

    if (depth <= 2) {
      p.noStroke();
      p.fill(40, 170, 60, 160);
      p.circle(x2, y2, p.map(depth, 0, 2, 4, 9));
    }

    const newLen = len * 0.67;
    const spread = p.PI / 5.5;
    drawWindTree(x2, y2, a - spread, newLen, depth - 1, noiseIdx + 1);
    drawWindTree(x2, y2, a + spread, newLen, depth - 1, noiseIdx + 2);
  }

  function drawSakuraTree(x, y, angle, len, depth, noiseIdx) {
    if (depth <= 0 || len < 2) return;

    const wind = (p.noise(noiseIdx * 0.12, windTime) - 0.5) * 0.3;
    const a = angle + wind * (1 - depth / 10);

    const x2 = x + p.cos(a) * len;
    const y2 = y + p.sin(a) * len;

    p.stroke(90, 60, 45);
    p.strokeWeight(p.map(depth, 0, 9, 1, 8));
    p.line(x, y, x2, y2);

    if (depth <= 3) {
      p.noStroke();
      const numPetals = depth <= 1 ? 6 : 4;
      for (let i = 0; i < numPetals; i++) {
        const petalAngle = (p.TWO_PI / numPetals) * i + depth;
        const dist = depth <= 1 ? 7 : 5;
        const px = x2 + p.cos(petalAngle) * dist;
        const py = y2 + p.sin(petalAngle) * dist;
        const size = depth <= 1 ? 6 : 4;
        p.fill(255, 190, 200, 200);
        p.circle(px, py, size);
      }
      p.fill(255, 230, 100, 220);
      p.circle(x2, y2, 3);
    }

    const newLen = len * 0.67;
    const spread = p.PI / 5.5;
    drawSakuraTree(x2, y2, a - spread, newLen, depth - 1, noiseIdx + 1);
    drawSakuraTree(x2, y2, a + spread, newLen, depth - 1, noiseIdx + 2);
  }

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      mode = (mode + 1) % 3;
      p.loop();
    }
  };
}
