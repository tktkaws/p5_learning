/** 座標変換の基本 — translate / rotate / scale で時計風アニメーション */
export default function (p) {
  p.setup = () => {
    p.createCanvas(400, 400);
    p.angleMode(p.DEGREES);
  };

  p.draw = () => {
    p.background(240);

    // --- アナログ時計 ---
    p.push();
    p.translate(200, 180);

    // 文字盤
    p.stroke(200);
    p.strokeWeight(2);
    p.noFill();
    p.circle(0, 0, 260);

    // 目盛り
    for (let i = 0; i < 12; i++) {
      p.push();
      p.rotate(i * 30);
      p.stroke(150);
      p.strokeWeight(i % 3 === 0 ? 3 : 1);
      p.line(0, -120, 0, -110);
      p.pop();
    }

    // 時刻を取得
    const h = p.hour() % 12;
    const m = p.minute();
    const s = p.second();

    // 時針
    p.push();
    p.rotate(h * 30 + m * 0.5);
    p.stroke(60);
    p.strokeWeight(4);
    p.strokeCap(p.ROUND);
    p.line(0, 10, 0, -65);
    p.pop();

    // 分針
    p.push();
    p.rotate(m * 6 + s * 0.1);
    p.stroke(80);
    p.strokeWeight(3);
    p.strokeCap(p.ROUND);
    p.line(0, 14, 0, -90);
    p.pop();

    // 秒針
    p.push();
    p.rotate(s * 6);
    p.stroke(99, 102, 241);
    p.strokeWeight(1.5);
    p.line(0, 18, 0, -100);
    p.pop();

    // 中心の丸
    p.noStroke();
    p.fill(99, 102, 241);
    p.circle(0, 0, 8);

    p.pop();

    // --- 下部: 回転する四角形 ---
    p.push();
    p.translate(200, 350);
    p.rotate(p.frameCount * 2);
    p.noStroke();
    p.fill(99, 102, 241, 180);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 24, 24, 4);
    p.pop();

    // ラベル
    p.noStroke();
    p.fill(160);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.text("translate → rotate → 描画 の順で座標変換", 200, 390);
  };
}
