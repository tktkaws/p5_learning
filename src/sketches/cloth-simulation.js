/** 布シミュレーション — 点とバネの格子による布の表現 */
export default function (p) {
  const cols = 15;
  const rows = 15;
  const spacing = 22;
  const gravity = 0.4;
  const damping = 0.99;
  const stiffness = 0.5;
  const iterations = 5;

  const points = [];
  let dragPoint = null;

  class Point {
    constructor(x, y, pinned) {
      this.x = x;
      this.y = y;
      this.oldX = x;
      this.oldY = y;
      this.pinned = pinned;
    }
  }

  class Constraint {
    constructor(a, b, len) {
      this.a = a;
      this.b = b;
      this.len = len;
    }
  }

  const constraints = [];

  p.setup = () => {
    p.createCanvas(400, 400);
    p.colorMode(p.HSB, 360, 100, 100, 100);

    const offsetX = (p.width - (cols - 1) * spacing) / 2;
    const offsetY = 40;

    // 点の作成
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * spacing;
        const y = offsetY + row * spacing;
        const pinned = row === 0;
        points.push(new Point(x, y, pinned));
      }
    }

    // バネ制約の作成（水平・垂直）
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        // 右隣
        if (col < cols - 1) {
          constraints.push(new Constraint(points[idx], points[idx + 1], spacing));
        }
        // 下隣
        if (row < rows - 1) {
          constraints.push(new Constraint(points[idx], points[idx + cols], spacing));
        }
      }
    }
  };

  p.draw = () => {
    p.background(220, 8, 97);

    // Verlet 積分（位置更新）
    for (const pt of points) {
      if (pt.pinned) continue;
      const vx = (pt.x - pt.oldX) * damping;
      const vy = (pt.y - pt.oldY) * damping;
      pt.oldX = pt.x;
      pt.oldY = pt.y;
      pt.x += vx;
      pt.y += vy + gravity;
    }

    // 制約の解決（複数回反復）
    for (let i = 0; i < iterations; i++) {
      for (const c of constraints) {
        const dx = c.b.x - c.a.x;
        const dy = c.b.y - c.a.y;
        const dist = p.sqrt(dx * dx + dy * dy);
        if (dist === 0) continue;
        const diff = (dist - c.len) / dist * stiffness;
        const ox = dx * diff * 0.5;
        const oy = dy * diff * 0.5;

        if (!c.a.pinned) {
          c.a.x += ox;
          c.a.y += oy;
        }
        if (!c.b.pinned) {
          c.b.x -= ox;
          c.b.y -= oy;
        }
      }
    }

    // ドラッグ中の点をマウスに追従
    if (dragPoint) {
      dragPoint.x = p.mouseX;
      dragPoint.y = p.mouseY;
    }

    // 布の面を描画（三角メッシュ）
    p.noStroke();
    for (let row = 0; row < rows - 1; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const i = row * cols + col;
        const a = points[i];
        const b = points[i + 1];
        const c = points[i + cols];
        const d = points[i + cols + 1];

        // 行に基づくグラデーション
        const hue = p.map(row, 0, rows - 1, 210, 260);
        const bright = p.map(row, 0, rows - 1, 95, 70);

        p.fill(hue, 50, bright, 80);
        p.triangle(a.x, a.y, b.x, b.y, c.x, c.y);
        p.triangle(b.x, b.y, d.x, d.y, c.x, c.y);
      }
    }

    // バネ（エッジ）の線を描画
    p.stroke(220, 30, 60, 30);
    p.strokeWeight(0.5);
    for (const c of constraints) {
      p.line(c.a.x, c.a.y, c.b.x, c.b.y);
    }

    // 固定点を描画
    p.noStroke();
    p.fill(0, 0, 40);
    for (let col = 0; col < cols; col++) {
      const pt = points[col];
      p.circle(pt.x, pt.y, 5);
    }

    // ガイド
    p.noStroke();
    p.fill(0, 0, 50, 60);
    p.textSize(11);
    p.textAlign(p.CENTER);
    p.text("ドラッグで布を引っ張る", p.width / 2, p.height - 12);
  };

  p.mousePressed = () => {
    let closest = null;
    let minDist = 20;
    for (const pt of points) {
      if (pt.pinned) continue;
      const d = p.dist(p.mouseX, p.mouseY, pt.x, pt.y);
      if (d < minDist) {
        minDist = d;
        closest = pt;
      }
    }
    if (closest) {
      dragPoint = closest;
    }
  };

  p.mouseDragged = () => {
    if (dragPoint) {
      dragPoint.x = p.mouseX;
      dragPoint.y = p.mouseY;
    }
  };

  p.mouseReleased = () => {
    dragPoint = null;
  };
}
