/** 基本図形と色 */
export default function (p) {
  p.setup = () => {
    p.createCanvas(400, 400);
    p.noLoop();
  };

  p.draw = () => {
    p.background(240);

    // 四角形（青）
    p.fill(100, 149, 237);
    p.noStroke();
    p.rect(50, 50, 120, 120, 12);

    // 円（ピンク）
    p.fill(255, 105, 135);
    p.circle(280, 110, 130);

    // 三角形（緑）
    p.fill(72, 199, 142);
    p.triangle(110, 350, 50, 250, 170, 250);

    // 線（枠付きの楕円）
    p.noFill();
    p.stroke(99, 102, 241);
    p.strokeWeight(3);
    p.ellipse(300, 300, 160, 100);

    // テキスト
    p.noStroke();
    p.fill(100);
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text("rect", 110, 190);
    p.text("circle", 280, 190);
    p.text("triangle", 110, 370);
    p.text("ellipse", 300, 370);
  };
}
