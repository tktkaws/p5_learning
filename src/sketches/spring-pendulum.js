/** バネと振り子 — フックの法則と振り子運動のシミュレーション */
export default function (p) {
  // バネのパラメータ
  const springAnchorX = 100;
  const springAnchorY = 60;
  const springRestLen = 100;
  const springK = 0.01;
  const springDamping = 0.995;
  const gravity = 0.5;
  let springBobY;
  let springVelY = 0;

  // 振り子のパラメータ
  const pendPivotX = 300;
  const pendPivotY = 60;
  const pendLen = 140;
  const pendDamping = 0.998;
  let pendAngle;
  let pendAngVel = 0;

  let dragging = null; // "spring" | "pendulum" | null

  p.setup = () => {
    p.createCanvas(400, 400);
    springBobY = springAnchorY + springRestLen + 40;
    pendAngle = p.PI / 4;
  };

  p.draw = () => {
    p.background(245, 243, 240);

    // 中央の区切り線
    p.stroke(210);
    p.strokeWeight(1);
    p.line(200, 0, 200, 400);

    // ラベル
    p.noStroke();
    p.fill(100);
    p.textSize(14);
    p.textFont("sans-serif");
    p.textAlign(p.CENTER);
    p.text("バネ", 100, 30);
    p.text("振り子", 300, 30);

    // === バネ ===
    updateSpring();
    drawSpring();

    // === 振り子 ===
    updatePendulum();
    drawPendulum();

    // ガイド
    p.noStroke();
    p.fill(170);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.text("ドラッグで引っ張る", p.width / 2, p.height - 12);
  };

  function updateSpring() {
    if (dragging === "spring") return;
    const stretch = springBobY - springAnchorY - springRestLen;
    const force = -springK * stretch + gravity / 60;
    springVelY += force;
    springVelY *= springDamping;
    springBobY += springVelY;
  }

  function drawSpring() {
    const ax = springAnchorX;
    const ay = springAnchorY;
    const by = springBobY;

    // アンカー
    p.fill(80);
    p.noStroke();
    p.rect(ax - 20, ay - 6, 40, 6, 2);

    // バネのジグザグ
    p.stroke(120);
    p.strokeWeight(2);
    p.noFill();
    const coils = 12;
    const amp = 12;
    const segLen = (by - ay) / coils;
    p.beginShape();
    p.vertex(ax, ay);
    for (let i = 1; i < coils; i++) {
      const sx = ax + (i % 2 === 0 ? -amp : amp);
      const sy = ay + segLen * i;
      p.vertex(sx, sy);
    }
    p.vertex(ax, by);
    p.endShape();

    // おもり
    p.fill(99, 102, 241);
    p.noStroke();
    p.circle(ax, by, 32);
    p.fill(255, 200);
    p.circle(ax - 5, by - 5, 6);
  }

  function updatePendulum() {
    if (dragging === "pendulum") return;
    const angAcc = -(gravity / pendLen) * p.sin(pendAngle);
    pendAngVel += angAcc;
    pendAngVel *= pendDamping;
    pendAngle += pendAngVel;
  }

  function drawPendulum() {
    const px = pendPivotX;
    const py = pendPivotY;
    const bx = px + pendLen * p.sin(pendAngle);
    const by = py + pendLen * p.cos(pendAngle);

    // 支点のマウント
    p.fill(80);
    p.noStroke();
    p.rect(px - 20, py - 6, 40, 6, 2);

    // ロッド
    p.stroke(100);
    p.strokeWeight(3);
    p.line(px, py, bx, by);

    // 支点
    p.fill(60);
    p.noStroke();
    p.circle(px, py, 10);

    // おもり
    p.fill(239, 68, 68);
    p.noStroke();
    p.circle(bx, by, 32);
    p.fill(255, 200);
    p.circle(bx - 5, by - 5, 6);
  }

  p.mousePressed = () => {
    const mx = p.mouseX;
    const my = p.mouseY;

    // バネのおもりクリック判定
    if (p.dist(mx, my, springAnchorX, springBobY) < 20) {
      dragging = "spring";
      springVelY = 0;
      return;
    }

    // 振り子のおもりクリック判定
    const bx = pendPivotX + pendLen * p.sin(pendAngle);
    const by = pendPivotY + pendLen * p.cos(pendAngle);
    if (p.dist(mx, my, bx, by) < 20) {
      dragging = "pendulum";
      pendAngVel = 0;
      return;
    }
  };

  p.mouseDragged = () => {
    if (dragging === "spring") {
      springBobY = p.constrain(p.mouseY, springAnchorY + 30, p.height - 20);
      springVelY = 0;
    } else if (dragging === "pendulum") {
      pendAngle = p.atan2(p.mouseX - pendPivotX, p.mouseY - pendPivotY);
      pendAngVel = 0;
    }
  };

  p.mouseReleased = () => {
    dragging = null;
  };
}
