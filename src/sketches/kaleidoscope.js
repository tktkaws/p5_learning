/** 万華鏡パターン — 回転対称で模様を自動生成 */
export default function (p) {
  const symmetry = 8;
  const angle = p.TWO_PI / symmetry;
  let hueOffset = 0;

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.background(0, 0, 10);
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    hueOffset += 0.5;

    const t = p.frameCount * 0.02;
    const r = 50 + p.sin(t * 1.3) * 80;
    const x = r * p.cos(t * 2.1);
    const y = r * p.sin(t * 1.7);
    const size = 4 + p.sin(t * 3) * 3;
    const hue = (hueOffset + r) % 360;

    p.noStroke();
    p.fill(hue, 70, 95, 60);

    for (let i = 0; i < symmetry; i++) {
      p.push();
      p.rotate(angle * i);
      p.ellipse(x, y, size, size);
      // 鏡像
      p.push();
      p.scale(1, -1);
      p.ellipse(x, y, size, size);
      p.pop();
      p.pop();
    }

    // ゆっくりフェードアウト
    if (p.frameCount % 120 === 0) {
      p.push();
      p.resetMatrix();
      p.fill(0, 0, 10, 3);
      p.rect(0, 0, p.width, p.height);
      p.pop();
    }
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    ) {
      p.push();
      p.resetMatrix();
      p.background(0, 0, 10);
      p.pop();
    }
  };
}
