/** 流体シミュレーション — バネモデルによる水面表現 */
export default function (p) {
  const NUM_COLS = 120;
  const SPRING_K = 0.025;
  const SPREAD = 0.25;
  const DAMPING = 0.98;

  const heights = [];
  const velocities = [];

  p.setup = function () {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);

    for (let i = 0; i < NUM_COLS; i++) {
      heights[i] = 0;
      velocities[i] = 0;
    }
  };

  p.draw = function () {
    p.background(210, 15, 97);

    // 自動の雨滴（約5%の確率で落下）
    if (p.random(1) < 0.05) {
      var ri = p.floor(p.random(NUM_COLS));
      heights[ri] = -p.random(15, 40);
    }

    // バネ物理：各水柱を平衡位置（0）に引き戻す
    for (let i = 0; i < NUM_COLS; i++) {
      velocities[i] += -SPRING_K * heights[i];
      velocities[i] *= DAMPING;
      heights[i] += velocities[i];
    }

    // 隣接伝搬（複数パス）
    var leftDeltas = new Array(NUM_COLS).fill(0);
    var rightDeltas = new Array(NUM_COLS).fill(0);

    for (let pass = 0; pass < 4; pass++) {
      for (let i = 0; i < NUM_COLS; i++) {
        if (i > 0) {
          leftDeltas[i] = SPREAD * (heights[i] - heights[i - 1]);
          velocities[i - 1] += leftDeltas[i];
        }
        if (i < NUM_COLS - 1) {
          rightDeltas[i] = SPREAD * (heights[i] - heights[i + 1]);
          velocities[i + 1] += rightDeltas[i];
        }
      }
      for (let i = 0; i < NUM_COLS; i++) {
        if (i > 0) heights[i - 1] += leftDeltas[i];
        if (i < NUM_COLS - 1) heights[i + 1] += rightDeltas[i];
      }
    }

    // === 描画 ===
    var baseY = p.height * 0.45;
    var colW = p.width / NUM_COLS;

    // 水の本体（塗りつぶし）
    p.noStroke();
    p.fill(210, 60, 80, 70);
    p.beginShape();
    p.vertex(0, p.height);
    for (let i = 0; i < NUM_COLS; i++) {
      p.vertex(i * colW, baseY + heights[i]);
    }
    p.vertex(p.width, baseY + heights[NUM_COLS - 1]);
    p.vertex(p.width, p.height);
    p.endShape(p.CLOSE);

    // 水面のハイライト線
    p.noFill();
    p.stroke(200, 40, 95, 60);
    p.strokeWeight(2);
    p.beginShape();
    for (let i = 0; i < NUM_COLS; i++) {
      p.curveVertex(i * colW, baseY + heights[i]);
    }
    p.endShape();

    // 水面の2本目のライン
    p.stroke(195, 30, 100, 40);
    p.strokeWeight(1);
    p.beginShape();
    for (let i = 0; i < NUM_COLS; i++) {
      p.curveVertex(i * colW, baseY + heights[i] + 4);
    }
    p.endShape();

    // 深い部分のゆらぎ横線
    for (let row = 0; row < 6; row++) {
      var fy = baseY + 50 + row * 35;
      var alpha = p.map(row, 0, 6, 20, 4);
      p.stroke(215, 50, 60, alpha);
      p.strokeWeight(1);
      p.beginShape();
      for (let i = 0; i < NUM_COLS; i++) {
        var wave = heights[i] * p.map(row, 0, 6, 0.3, 0.05);
        p.curveVertex(i * colW, fy + wave);
      }
      p.endShape();
    }

    // ガイドテキスト
    p.noStroke();
    p.fill(0, 0, 50, 60);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.text("自動で雨滴が落下 / クリックでも波を起こせる", p.width / 2, p.height - 12);
  };

  p.mousePressed = function () {
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      var idx = p.floor(p.map(p.mouseX, 0, p.width, 0, NUM_COLS));
      idx = p.constrain(idx, 0, NUM_COLS - 1);
      heights[idx] = -40;
    }
  };

  p.mouseDragged = function () {
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      var idx = p.floor(p.map(p.mouseX, 0, p.width, 0, NUM_COLS));
      idx = p.constrain(idx, 0, NUM_COLS - 1);
      heights[idx] = -20;
    }
  };
}
