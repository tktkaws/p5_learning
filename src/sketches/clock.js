// アナログ時計 — hour/minute/second と三角関数でリアルタイム描画
export default function (p) {
  const W = 400;
  const H = 400;
  const RADIUS = 160;

  p.setup = () => {
    p.createCanvas(W, H);
  };

  p.draw = () => {
    p.background(252);
    p.translate(W / 2, H / 2);

    drawFace();
    drawMarks();

    const hr = p.hour() % 12;
    const mn = p.minute();
    const sc = p.second();
    const ms = p.millis() % 1000;

    // millis で補間して滑らかに動かす
    const smoothSec = sc + ms / 1000;
    const smoothMin = mn + smoothSec / 60;
    const smoothHr = hr + smoothMin / 60;

    // 各針の角度（12時方向 = -HALF_PI が基準）
    const hourAngle = (smoothHr / 12) * p.TWO_PI - p.HALF_PI;
    const minAngle = (smoothMin / 60) * p.TWO_PI - p.HALF_PI;
    const secAngle = (smoothSec / 60) * p.TWO_PI - p.HALF_PI;

    drawHand(hourAngle, RADIUS * 0.5, 6, p.color(30));
    drawHand(minAngle, RADIUS * 0.72, 4, p.color(30));
    drawHand(secAngle, RADIUS * 0.85, 1.5, p.color(220, 60, 60));

    // 中心のドット
    p.noStroke();
    p.fill(220, 60, 60);
    p.circle(0, 0, 10);
  };

  function drawFace() {
    // 白い文字盤
    p.noStroke();
    p.fill(255);
    p.circle(0, 0, RADIUS * 2 + 20);

    // 外枠リング
    p.stroke(220);
    p.strokeWeight(2);
    p.noFill();
    p.circle(0, 0, RADIUS * 2 + 10);
  }

  function drawMarks() {
    for (let i = 0; i < 60; i++) {
      const angle = p.map(i, 0, 60, 0, p.TWO_PI) - p.HALF_PI;
      const isHour = i % 5 === 0;

      const outerR = RADIUS;
      const innerR = isHour ? RADIUS - 15 : RADIUS - 7;

      p.stroke(isHour ? 40 : 190);
      p.strokeWeight(isHour ? 2.5 : 1);

      p.line(
        p.cos(angle) * innerR,
        p.sin(angle) * innerR,
        p.cos(angle) * outerR,
        p.sin(angle) * outerR
      );
    }
  }

  function drawHand(angle, length, weight, col) {
    p.stroke(col);
    p.strokeWeight(weight);
    p.strokeCap(p.ROUND);
    p.line(0, 0, p.cos(angle) * length, p.sin(angle) * length);
  }
}
